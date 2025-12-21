export const EmptySectionBehavior = {
	REMOVE_EMPTY_SECTIONS: "remove",
	DONOT_REMOVE_EMPTY_SECTIONS: "keep",
} as const;

export type EmptySectionBehaviorType =
	(typeof EmptySectionBehavior)[keyof typeof EmptySectionBehavior];

export const TemplateFilterBehavior = {
	FILTER_TEMPLATE_LINES: "filter",
	DONOT_FILTER_TEMPLATE_LINES: "keep",
} as const;

export type TemplateFilterBehaviorType =
	(typeof TemplateFilterBehavior)[keyof typeof TemplateFilterBehavior];

export interface QuarterlyReviewSettings {
	tempFolderPath: string;
	removeEmptySections: EmptySectionBehaviorType;
	filterDailyTemplateLines: TemplateFilterBehaviorType; // #{#tlf1a-6}: Configuration for daily notes
	filterWeeklyTemplateLines: TemplateFilterBehaviorType; // #{#tlf1a-6}: Configuration for weekly notes
}

export const DEFAULT_SETTINGS: QuarterlyReviewSettings = {
	tempFolderPath: "temp",
	removeEmptySections: EmptySectionBehavior.REMOVE_EMPTY_SECTIONS,
	filterDailyTemplateLines: TemplateFilterBehavior.FILTER_TEMPLATE_LINES, // #{#tlf1a-6}: Enabled by default
	filterWeeklyTemplateLines: TemplateFilterBehavior.FILTER_TEMPLATE_LINES, // #{#tlf1a-6}: Enabled by default
};
