import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import {
	QuarterlyReviewSettings,
	DEFAULT_SETTINGS,
	EmptySectionBehavior,
	TemplateFilterBehavior,
} from "../settings";

export interface SettingsPlugin extends Plugin {
	settings: QuarterlyReviewSettings;
	saveSettings: () => Promise<void>;
}

export class QuarterlyReviewSettingTab extends PluginSettingTab {
	plugin: SettingsPlugin;

	constructor(app: App, plugin: SettingsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", {
			text: "Quarterly Review Builder Settings",
		});

		new Setting(containerEl)
			.setName("Temp Folder Path")
			.setDesc(
				"The folder path where quarterly review files will be created",
			)
			.addText((text) =>
				text
					.setPlaceholder(DEFAULT_SETTINGS.tempFolderPath)
					.setValue(this.plugin.settings.tempFolderPath)
					.onChange(async (value) => {
						this.plugin.settings.tempFolderPath = value || "temp";
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Empty Section Handling")
			.setDesc(
				"Choose whether to remove empty sections (headings with no content) from weekly and quarterly review notes",
			)
			.addDropdown((dropdown) =>
				dropdown
					.addOption(
						EmptySectionBehavior.REMOVE_EMPTY_SECTIONS,
						"Remove empty sections",
					)
					.addOption(
						EmptySectionBehavior.DONOT_REMOVE_EMPTY_SECTIONS,
						"Keep empty sections",
					)
					.setValue(this.plugin.settings.removeEmptySections)
					.onChange(async (value) => {
						this.plugin.settings.removeEmptySections = value as
							| typeof EmptySectionBehavior.REMOVE_EMPTY_SECTIONS
							| typeof EmptySectionBehavior.DONOT_REMOVE_EMPTY_SECTIONS;
						await this.plugin.saveSettings();
					}),
			);

		// #{#tlf1a-6}: Configuration for template line filtering
		containerEl.createEl("h3", { text: "Template Line Filtering" });

		new Setting(containerEl)
			.setName("Filter Daily Note Template Lines")
			.setDesc(
				"Remove unchanged template lines from daily notes when compiling reviews. This helps highlight actual content you've written.",
			)
			.addDropdown((dropdown) =>
				dropdown
					.addOption(
						TemplateFilterBehavior.FILTER_TEMPLATE_LINES,
						"Filter template lines",
					)
					.addOption(
						TemplateFilterBehavior.DONOT_FILTER_TEMPLATE_LINES,
						"Keep template lines",
					)
					.setValue(this.plugin.settings.filterDailyTemplateLines)
					.onChange(async (value) => {
						this.plugin.settings.filterDailyTemplateLines =
							value as
								| typeof TemplateFilterBehavior.FILTER_TEMPLATE_LINES
								| typeof TemplateFilterBehavior.DONOT_FILTER_TEMPLATE_LINES;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Filter Weekly Note Template Lines")
			.setDesc(
				"Remove unchanged template lines from weekly notes when compiling reviews. This helps highlight actual content you've written.",
			)
			.addDropdown((dropdown) =>
				dropdown
					.addOption(
						TemplateFilterBehavior.FILTER_TEMPLATE_LINES,
						"Filter template lines",
					)
					.addOption(
						TemplateFilterBehavior.DONOT_FILTER_TEMPLATE_LINES,
						"Keep template lines",
					)
					.setValue(this.plugin.settings.filterWeeklyTemplateLines)
					.onChange(async (value) => {
						this.plugin.settings.filterWeeklyTemplateLines =
							value as
								| typeof TemplateFilterBehavior.FILTER_TEMPLATE_LINES
								| typeof TemplateFilterBehavior.DONOT_FILTER_TEMPLATE_LINES;
						await this.plugin.saveSettings();
					}),
			);
	}
}
