import { Plugin } from "obsidian";
import { buildQuarterlyReview } from "./quarterly-review";
import { buildWeeklyReview } from "./weekly-review";
import { QuarterlyReviewSettings } from "../settings";

export function registerCommands(
	plugin: Plugin & { settings: QuarterlyReviewSettings },
) {
	plugin.addCommand({
		id: "build-quarterly-review",
		// eslint-disable-next-line obsidianmd/ui/sentence-case
		name: "Build Quarterly Review",
		callback: () => buildQuarterlyReview(plugin),
	});

	plugin.addCommand({
		id: "build-weekly-review",
		// eslint-disable-next-line obsidianmd/ui/sentence-case
		name: "Weekly Review",
		callback: () => buildWeeklyReview(plugin),
	});
}
