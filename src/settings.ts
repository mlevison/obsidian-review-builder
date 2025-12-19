export const EmptySectionBehavior = {
	REMOVE_EMPTY_SECTIONS: "remove",
	DONOT_REMOVE_EMPTY_SECTIONS: "keep",
} as const;

export type EmptySectionBehaviorType =
	(typeof EmptySectionBehavior)[keyof typeof EmptySectionBehavior];

export interface QuarterlyReviewSettings {
	tempFolderPath: string;
	removeEmptySections: EmptySectionBehaviorType;
	filterDailyTemplateLines: boolean; // #{#tlf1a-6}: Configuration for daily notes
	filterWeeklyTemplateLines: boolean; // #{#tlf1a-6}: Configuration for weekly notes
}

export const DEFAULT_SETTINGS: QuarterlyReviewSettings = {
	tempFolderPath: "temp",
	removeEmptySections: EmptySectionBehavior.REMOVE_EMPTY_SECTIONS,
	filterDailyTemplateLines: true, // #{#tlf1a-6}: Enabled by default
	filterWeeklyTemplateLines: true, // #{#tlf1a-6}: Enabled by default
};
