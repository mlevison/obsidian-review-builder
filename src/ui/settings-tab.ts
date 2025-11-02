import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import {
	QuarterlyReviewSettings,
	DEFAULT_SETTINGS,
	EmptySectionBehavior,
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
	}
}
