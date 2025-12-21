import { Notice, Plugin, SuggestModal, TFile } from "obsidian";
import { QuarterlyReviewSettings, TemplateFilterBehavior } from "../settings";
import {
	PeriodicNotesUtil,
	NotesInfo,
	DateRange,
} from "../utils/periodic-notes-util";
import { generateWeeks, WeekInfo } from "../utils/week-utils";
import {
	getDailyNoteSettings,
	getTemplateInfo,
} from "obsidian-daily-notes-interface";

class WeekSelectionModal extends SuggestModal<WeekInfo> {
	plugin: Plugin & { settings: QuarterlyReviewSettings };
	onChoose: (week: WeekInfo) => void;

	constructor(
		plugin: Plugin & { settings: QuarterlyReviewSettings },
		onChoose: (week: WeekInfo) => void,
	) {
		super(plugin.app);
		this.plugin = plugin;
		this.onChoose = onChoose;
		this.setPlaceholder("Choose a week for the weekly review...");
	}

	getSuggestions(query: string): WeekInfo[] {
		const weeks = generateWeeks();

		return weeks.filter((week) =>
			week.dateRangeLabel.toLowerCase().includes(query.toLowerCase()),
		);
	}

	renderSuggestion(week: WeekInfo, el: HTMLElement) {
		el.createEl("div", { text: week.dateRangeLabel });
	}

	onChooseSuggestion(week: WeekInfo, evt: MouseEvent | KeyboardEvent) {
		this.onChoose(week);
	}
}

export async function buildWeeklyReview(
	plugin: Plugin & { settings: QuarterlyReviewSettings },
) {
	try {
		const periodicNotesUtil = new PeriodicNotesUtil(plugin.app);

		if (!periodicNotesUtil.arePeriodicNotesConfigured()) {
			new Notice(
				"Daily/Weekly notes functionality is not available. Please enable Daily Notes or install Periodic Notes plugin.",
			);
			return;
		}

		// Show week selection modal
		const modal = new WeekSelectionModal(
			plugin,
			async (selectedWeek: WeekInfo) => {
				await createWeeklyReview(
					plugin,
					selectedWeek,
					periodicNotesUtil,
				);
			},
		);
		modal.open();
	} catch (error) {
		console.error("Error building weekly review:", error);
		new Notice(
			"Failed to create weekly review. Check console for details.",
		);
	}
}

async function createWeeklyReview(
	plugin: Plugin & { settings: QuarterlyReviewSettings },
	selectedWeek: WeekInfo,
	periodicNotesIntegration: PeriodicNotesUtil,
) {
	try {
		const { tempFolderPath } = plugin.settings;

		// Get Daily notes information for the selected week
		new Notice(
			`Scanning for Daily notes in ${selectedWeek.dateRangeLabel}...`,
		);
		const dateRange: DateRange = {
			startDate: selectedWeek.startDate,
			endDate: selectedWeek.endDate,
		};
		const notesInfo: NotesInfo =
			await periodicNotesIntegration.getNotesInfo(dateRange);

		// Write daily notes to temp file
		new Notice(
			`Creating temp file for daily notes from ${selectedWeek.label}...`,
		);
		const tempFilePath = await writeWeeklyReviewTempFile(
			notesInfo.dailyNotes,
			tempFolderPath,
			selectedWeek,
			periodicNotesIntegration,
			plugin,
		);

		// Open the newly created file
		if (tempFilePath) {
			const fileName = tempFilePath.split("/").pop();
			new Notice(`Weekly review written to: ${fileName}`);
			const reviewFile =
				plugin.app.vault.getAbstractFileByPath(tempFilePath);
			if (reviewFile instanceof TFile) {
				await plugin.app.workspace.getLeaf().openFile(reviewFile);
			}
		} else {
			new Notice(`No daily notes found for ${selectedWeek.label}.`);
		}
	} catch (error) {
		console.error("Error creating weekly review:", error);
		new Notice(
			"Failed to create weekly review. Check console for details.",
		);
	}
}

async function writeWeeklyReviewTempFile(
	dailyNotes: TFile[],
	tempFolderPath: string,
	weekInfo: WeekInfo,
	periodicNotesUtil: PeriodicNotesUtil,
	plugin: Plugin & { settings: QuarterlyReviewSettings },
): Promise<string | null> {
	if (dailyNotes.length === 0) {
		return null;
	}

	// Ensure temp folder exists
	const app = plugin.app;
	const tempFolder = app.vault.getAbstractFileByPath(tempFolderPath);
	if (!tempFolder) {
		await app.vault.createFolder(tempFolderPath);
	}

	// Create filename with week number (zero-padded)
	const weekNumberPadded = weekInfo.weekNumber.toString().padStart(2, "0");
	const fileName = `daily_notes_w${weekNumberPadded}.md`;
	const filePath = `${tempFolderPath}/${fileName}`;

	// #{#tlf1a-1}: Retrieve template content for daily notes
	const dailySettings = getDailyNoteSettings();
	let dailyTemplateLines: string[] = [];
	if (
		plugin.settings.filterTemplateLines ===
			TemplateFilterBehavior.FILTER_TEMPLATE_LINES &&
		dailySettings?.template
	) {
		try {
			const [templateContent] = await getTemplateInfo(
				dailySettings.template,
			);
			if (templateContent) {
				dailyTemplateLines = templateContent.split("\n");
			}
		} catch (error) {
			console.warn(
				`Could not retrieve template content from "${dailySettings.template}":`,
				error,
			);
		}
	}

	// Get daily notes content
	const dailyContent = await periodicNotesUtil.getNotesContent(
		dailyNotes,
		plugin.settings.removeEmptySections,
		dailyTemplateLines,
	);
	const fileContent = `# Weekly Review - ${weekInfo.label}\n\n${dailyContent.join("")}`;

	// Check if file exists and delete it first (since we want to overwrite)
	const existingFile = app.vault.getAbstractFileByPath(filePath);
	if (existingFile) {
		await app.vault.delete(existingFile);
	}

	// Create the new file
	await app.vault.create(filePath, fileContent);

	return filePath;
}
