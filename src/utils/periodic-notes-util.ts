import { App, TFile, Notice } from "obsidian";
import {
	getAllDailyNotes,
	getAllWeeklyNotes,
	getDailyNote,
	getWeeklyNote,
	getDailyNoteSettings,
	getWeeklyNoteSettings,
} from "obsidian-daily-notes-interface";
import { removeEmptySections } from "./markdown-utils";
import { EmptySectionBehavior, EmptySectionBehaviorType } from "../settings";

export interface NotesInfo {
	dailyNotes: TFile[];
	weeklyNotes: TFile[];
	dailyFolder: string | null;
	weeklyFolder: string | null;
	dailyFormat: string | null;
	weeklyFormat: string | null;
}

export interface DateRange {
	startDate: Date;
	endDate: Date;
}

export class PeriodicNotesUtil {
	private app: App;

	constructor(app: App) {
		this.app = app;
	}

	// Type declaration for window.moment
	private get moment() {
		return (window as any).moment;
	}

	/**
	 * Check if daily or weekly notes functionality is available
	 * This now checks if the daily-notes-interface can access the settings
	 */
	arePeriodicNotesConfigured(): boolean {
		try {
			// Try to get settings to see if daily/weekly notes are configured
			const dailySettings = getDailyNoteSettings();
			const weeklySettings = getWeeklyNoteSettings();
			return !!(dailySettings || weeklySettings);
		} catch (error) {
			console.error("Error checking periodic notes availability:", error);
			return false;
		}
	}

	/**
	 * Get Daily and Weekly notes information using obsidian-daily-notes-interface
	 * Optionally filter by date range
	 */
	async getNotesInfo(dateRange?: DateRange): Promise<NotesInfo> {
		try {
			// Get settings using the interface
			const dailySettings = getDailyNoteSettings();
			const weeklySettings = getWeeklyNoteSettings();

			// Get all notes using the interface - these are retrieved within filterNotesByDateRange

			// Filter and convert to TFile arrays based on date range
			const dailyNotes: TFile[] = this.filterNotesByDateRange(
				"daily",
				dateRange,
			);
			const weeklyNotes: TFile[] = this.filterNotesByDateRange(
				"weekly",
				dateRange,
			);

			// Extract folder and format information
			const dailyFolder = dailySettings?.folder || null;
			const dailyFormat = dailySettings?.format || null;
			const weeklyFolder = weeklySettings?.folder || null;
			const weeklyFormat = weeklySettings?.format || null;

			// Post notices about results with date range context
			this.checkAndNotifyResultsWithDateRange(
				"Daily",
				dailyFolder,
				dailyNotes,
				dateRange,
			);
			this.checkAndNotifyResultsWithDateRange(
				"Weekly",
				weeklyFolder,
				weeklyNotes,
				dateRange,
			);

			return {
				dailyNotes,
				weeklyNotes,
				dailyFolder,
				weeklyFolder,
				dailyFormat,
				weeklyFormat,
			};
		} catch (error) {
			console.error("Error getting notes info:", error);
			new Notice(
				"Error accessing daily/weekly notes. Please check your settings.",
			);
			return {
				dailyNotes: [],
				weeklyNotes: [],
				dailyFolder: null,
				weeklyFolder: null,
				dailyFormat: null,
				weeklyFormat: null,
			};
		}
	}

	/**
	 * Filter notes by date range based on their date keys
	 */
	private filterNotesByDateRange(
		notesType: "daily" | "weekly",
		dateRange: DateRange | undefined,
	): TFile[] {
		if (!dateRange) {
			// Return all notes if no date range specified
			if (notesType === "daily") {
				return Object.values(getAllDailyNotes());
			} else {
				return Object.values(getAllWeeklyNotes());
			}
		}

		const filteredNotes: TFile[] = [];
		const currentDate = this.moment(dateRange.startDate);
		const endDate = this.moment(dateRange.endDate);

		if (notesType === "daily") {
			// Get all daily notes - returns Record<string, TFile>
			const allDailyNotes = getAllDailyNotes();

			// For daily notes, iterate through each day in the range
			while (currentDate.isSameOrBefore(endDate, "day")) {
				const note = getDailyNote(currentDate, allDailyNotes);
				if (note) {
					filteredNotes.push(note);
				}
				currentDate.add(1, "day");
			}
		} else {
			// Get all weekly notes - this returns Record<string, TFile>
			const allWeeklyNotes = getAllWeeklyNotes();

			// For weekly notes, iterate through each week in the range
			currentDate.startOf("week"); // Start from beginning of week
			while (currentDate.isSameOrBefore(endDate, "week")) {
				const note = getWeeklyNote(currentDate, allWeeklyNotes);
				if (note) {
					filteredNotes.push(note);
				}
				currentDate.add(1, "week");
			}
		}

		return filteredNotes;
	}

	/**
	 * Check results and post appropriate notices
	 */
	private checkAndNotifyResults(
		type: string,
		folder: string | null,
		notes: TFile[],
	): void {
		if (!folder && folder !== "") {
			new Notice(`${type} notes are not configured or enabled`);
			return;
		}

		if (folder && folder !== "") {
			const folderObj = this.app.vault.getAbstractFileByPath(folder);
			if (!folderObj) {
				new Notice(`${type} notes folder "${folder}" does not exist`);
				return;
			}
		}

		if (notes.length === 0) {
			new Notice(`No ${type.toLowerCase()} notes found`);
		} else {
			new Notice(`Found ${notes.length} ${type.toLowerCase()} notes`);
		}
	}

	/**
	 * Check results and post appropriate notices with date range context
	 */
	private checkAndNotifyResultsWithDateRange(
		type: string,
		folder: string | null,
		notes: TFile[],
		dateRange?: DateRange,
	): void {
		if (!folder && folder !== "") {
			new Notice(`${type} notes are not configured or enabled`);
			return;
		}

		if (folder && folder !== "") {
			const folderObj = this.app.vault.getAbstractFileByPath(folder);
			if (!folderObj) {
				new Notice(`${type} notes folder "${folder}" does not exist`);
				return;
			}
		}

		const rangeText = dateRange ? " in selected quarter" : "";
		if (notes.length === 0) {
			new Notice(`No ${type.toLowerCase()} notes found${rangeText}`);
		} else {
			new Notice(
				`Found ${notes.length} ${type.toLowerCase()} notes${rangeText}`,
			);
		}
	}

	/**
	 * Get summary of notes for display
	 */
	getNotesContent(
		notes: TFile[],
		shouldRemoveEmptySections: EmptySectionBehaviorType = EmptySectionBehavior.DONOT_REMOVE_EMPTY_SECTIONS,
	): Promise<string[]> {
		return Promise.all(
			notes.map(async (file) => {
				try {
					let content = await this.app.vault.read(file);

					if (
						shouldRemoveEmptySections ===
						EmptySectionBehavior.REMOVE_EMPTY_SECTIONS
					) {
						content = removeEmptySections(content);
					}

					return `## ${file.basename}\n${content}\n\n`;
				} catch (error) {
					console.error(`Error reading file ${file.path}:`, error);
					return `## ${file.basename}\n*Error reading file content*\n\n`;
				}
			}),
		);
	}

	/**
	 * Create a summary of all notes for the quarterly review
	 */
	async createNotesSummary(
		dailyNotes: TFile[],
		weeklyNotes: TFile[],
		shouldRemoveEmptySections: EmptySectionBehaviorType = EmptySectionBehavior.DONOT_REMOVE_EMPTY_SECTIONS,
	): Promise<string> {
		let summary = "";

		if (dailyNotes.length > 0) {
			summary += "# Daily Notes Summary\n\n";
			const dailyContent = await this.getNotesContent(
				dailyNotes,
				shouldRemoveEmptySections,
			);
			summary += dailyContent.join("");
		}

		if (weeklyNotes.length > 0) {
			summary += "# Weekly Notes Summary\n\n";
			const weeklyContent = await this.getNotesContent(
				weeklyNotes,
				shouldRemoveEmptySections,
			);
			summary += weeklyContent.join("");
		}

		if (dailyNotes.length === 0 && weeklyNotes.length === 0) {
			summary =
				"# Notes Summary\n\nNo daily or weekly notes found to include in this review.\n\n";
		}

		return summary;
	}

	/**
	 * Write daily and weekly notes to separate temp files
	 */
	async writeSeparateTempFiles(
		dailyNotes: TFile[],
		weeklyNotes: TFile[],
		tempFolderPath: string,
		quarterInfo?: { label: string; quarter: number; year: number },
		shouldRemoveEmptySections: EmptySectionBehaviorType = EmptySectionBehavior.DONOT_REMOVE_EMPTY_SECTIONS,
	): Promise<{
		dailyFilePath: string | null;
		weeklyFilePath: string | null;
	}> {
		let dailyFilePath: string | null = null;
		let weeklyFilePath: string | null = null;

		// Ensure temp folder exists
		const tempFolder = this.app.vault.getAbstractFileByPath(tempFolderPath);
		if (!tempFolder) {
			await this.app.vault.createFolder(tempFolderPath);
		}

		// Write daily notes to quarter-specific file
		if (dailyNotes.length > 0) {
			const dailyContent = await this.getNotesContent(
				dailyNotes,
				shouldRemoveEmptySections,
			);
			const quarterLabel = quarterInfo
				? `_${quarterInfo.label.replace(/\s/g, "_")}`
				: "";
			const dailyFileContent = quarterInfo
				? `# Daily Notes Summary - ${quarterInfo.label}\n\n${dailyContent.join("")}`
				: `# Daily Notes Summary\n\n${dailyContent.join("")}`;
			dailyFilePath = `${tempFolderPath}/quarterly_days${quarterLabel}.md`;

			// Check if file exists and delete it first
			const existingDailyFile =
				this.app.vault.getAbstractFileByPath(dailyFilePath);
			if (existingDailyFile) {
				await this.app.vault.delete(existingDailyFile);
			}

			await this.app.vault.create(dailyFilePath, dailyFileContent);
		}

		// Write weekly notes to quarter-specific file
		if (weeklyNotes.length > 0) {
			const weeklyContent = await this.getNotesContent(
				weeklyNotes,
				shouldRemoveEmptySections,
			);
			const quarterLabel = quarterInfo
				? `_${quarterInfo.label.replace(/\s/g, "_")}`
				: "";
			const weeklyFileContent = quarterInfo
				? `# Weekly Notes Summary - ${quarterInfo.label}\n\n${weeklyContent.join("")}`
				: `# Weekly Notes Summary\n\n${weeklyContent.join("")}`;
			weeklyFilePath = `${tempFolderPath}/quarterly_weeks${quarterLabel}.md`;

			// Check if file exists and delete it first
			const existingWeeklyFile =
				this.app.vault.getAbstractFileByPath(weeklyFilePath);
			if (existingWeeklyFile) {
				await this.app.vault.delete(existingWeeklyFile);
			}

			await this.app.vault.create(weeklyFilePath, weeklyFileContent);
		}

		return { dailyFilePath, weeklyFilePath };
	}
}
