export const EmptySectionBehavior = {
	REMOVE_EMPTY_SECTIONS: "remove",
	DONOT_REMOVE_EMPTY_SECTIONS: "keep",
} as const;

export type EmptySectionBehaviorType =
	(typeof EmptySectionBehavior)[keyof typeof EmptySectionBehavior];

export interface QuarterlyReviewSettings {
	tempFolderPath: string;
	removeEmptySections: EmptySectionBehaviorType;
}

export const DEFAULT_SETTINGS: QuarterlyReviewSettings = {
	tempFolderPath: "temp",
	removeEmptySections: EmptySectionBehavior.REMOVE_EMPTY_SECTIONS,
};
