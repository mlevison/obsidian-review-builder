import {
	EmptySectionBehavior,
	EmptySectionBehaviorType,
	DEFAULT_SETTINGS,
	QuarterlyReviewSettings,
} from "../../src/settings";

describe("Settings", () => {
	describe("EmptySectionBehavior", () => {
		it("should have REMOVE_EMPTY_SECTIONS constant", () => {
			expect(EmptySectionBehavior.REMOVE_EMPTY_SECTIONS).toBe("remove");
		});

		it("should have DONOT_REMOVE_EMPTY_SECTIONS constant", () => {
			expect(EmptySectionBehavior.DONOT_REMOVE_EMPTY_SECTIONS).toBe(
				"keep",
			);
		});

		it("should have exactly two values", () => {
			const keys = Object.keys(EmptySectionBehavior);
			expect(keys).toHaveLength(2);
			expect(keys).toContain("REMOVE_EMPTY_SECTIONS");
			expect(keys).toContain("DONOT_REMOVE_EMPTY_SECTIONS");
		});

		it("should have distinct values", () => {
			expect(EmptySectionBehavior.REMOVE_EMPTY_SECTIONS).not.toBe(
				EmptySectionBehavior.DONOT_REMOVE_EMPTY_SECTIONS,
			);
		});

		it("should be immutable (as const)", () => {
			// TypeScript should prevent this at compile time, but we can verify runtime behavior
			const behavior = EmptySectionBehavior;
			expect(Object.isFrozen(behavior)).toBe(false); // 'as const' doesn't freeze, but makes readonly

			// Verify the type is correctly defined
			const removeValue: EmptySectionBehaviorType =
				EmptySectionBehavior.REMOVE_EMPTY_SECTIONS;
			const keepValue: EmptySectionBehaviorType =
				EmptySectionBehavior.DONOT_REMOVE_EMPTY_SECTIONS;

			expect(removeValue).toBe("remove");
			expect(keepValue).toBe("keep");
		});
	});

	describe("EmptySectionBehaviorType", () => {
		it("should accept REMOVE_EMPTY_SECTIONS value", () => {
			const value: EmptySectionBehaviorType =
				EmptySectionBehavior.REMOVE_EMPTY_SECTIONS;
			expect(value).toBe("remove");
		});

		it("should accept DONOT_REMOVE_EMPTY_SECTIONS value", () => {
			const value: EmptySectionBehaviorType =
				EmptySectionBehavior.DONOT_REMOVE_EMPTY_SECTIONS;
			expect(value).toBe("keep");
		});

		it("should accept string literal values", () => {
			const removeValue: EmptySectionBehaviorType = "remove";
			const keepValue: EmptySectionBehaviorType = "keep";

			expect(removeValue).toBe(
				EmptySectionBehavior.REMOVE_EMPTY_SECTIONS,
			);
			expect(keepValue).toBe(
				EmptySectionBehavior.DONOT_REMOVE_EMPTY_SECTIONS,
			);
		});
	});

	describe("DEFAULT_SETTINGS", () => {
		it("should have tempFolderPath default", () => {
			expect(DEFAULT_SETTINGS.tempFolderPath).toBe("temp");
		});

		it("should have removeEmptySections set to REMOVE_EMPTY_SECTIONS by default", () => {
			expect(DEFAULT_SETTINGS.removeEmptySections).toBe(
				EmptySectionBehavior.REMOVE_EMPTY_SECTIONS,
			);
		});

		it("should have filterDailyTemplateLines enabled by default", () => {
			expect(DEFAULT_SETTINGS.filterDailyTemplateLines).toBe(true);
		});

		it("should have filterWeeklyTemplateLines enabled by default", () => {
			expect(DEFAULT_SETTINGS.filterWeeklyTemplateLines).toBe(true);
		});

		it("should have valid EmptySectionBehaviorType value", () => {
			const validValues = [
				EmptySectionBehavior.REMOVE_EMPTY_SECTIONS,
				EmptySectionBehavior.DONOT_REMOVE_EMPTY_SECTIONS,
			];

			expect(validValues).toContain(DEFAULT_SETTINGS.removeEmptySections);
		});
	});

	describe("QuarterlyReviewSettings interface", () => {
		it("should accept valid settings with REMOVE_EMPTY_SECTIONS", () => {
			const settings: QuarterlyReviewSettings = {
				tempFolderPath: "my-temp",
				removeEmptySections: EmptySectionBehavior.REMOVE_EMPTY_SECTIONS,
				filterDailyTemplateLines: true,
				filterWeeklyTemplateLines: true,
			};

			expect(settings.tempFolderPath).toBe("my-temp");
			expect(settings.removeEmptySections).toBe("remove");
		});

		it("should accept valid settings with DONOT_REMOVE_EMPTY_SECTIONS", () => {
			const settings: QuarterlyReviewSettings = {
				tempFolderPath: "another-temp",
				removeEmptySections:
					EmptySectionBehavior.DONOT_REMOVE_EMPTY_SECTIONS,
				filterDailyTemplateLines: false,
				filterWeeklyTemplateLines: false,
			};

			expect(settings.tempFolderPath).toBe("another-temp");
			expect(settings.removeEmptySections).toBe("keep");
		});

		it("should work with spread operator and defaults", () => {
			const customSettings: QuarterlyReviewSettings = {
				...DEFAULT_SETTINGS,
				tempFolderPath: "custom-folder",
			};

			expect(customSettings.tempFolderPath).toBe("custom-folder");
			expect(customSettings.removeEmptySections).toBe(
				EmptySectionBehavior.REMOVE_EMPTY_SECTIONS,
			);
		});

		it("should allow toggling between behavior values", () => {
			const settings: QuarterlyReviewSettings = { ...DEFAULT_SETTINGS };

			// Start with default (REMOVE)
			expect(settings.removeEmptySections).toBe(
				EmptySectionBehavior.REMOVE_EMPTY_SECTIONS,
			);

			// Change to DONOT_REMOVE
			settings.removeEmptySections =
				EmptySectionBehavior.DONOT_REMOVE_EMPTY_SECTIONS;
			expect(settings.removeEmptySections).toBe("keep");

			// Change back to REMOVE
			settings.removeEmptySections =
				EmptySectionBehavior.REMOVE_EMPTY_SECTIONS;
			expect(settings.removeEmptySections).toBe("remove");
		});
	});

	describe("Type safety", () => {
		it("should ensure EmptySectionBehaviorType is a union type", () => {
			// This test verifies that the type correctly represents the union
			const testValues = [
				EmptySectionBehavior.REMOVE_EMPTY_SECTIONS,
				EmptySectionBehavior.DONOT_REMOVE_EMPTY_SECTIONS,
			];

			testValues.forEach((value) => {
				const typed: EmptySectionBehaviorType = value;
				expect(["remove", "keep"]).toContain(typed);
			});
		});

		it("should handle comparison operations correctly", () => {
			const checkBehavior = (setting: EmptySectionBehaviorType) => {
				const shouldRemove =
					setting === EmptySectionBehavior.REMOVE_EMPTY_SECTIONS;
				const shouldKeep =
					setting ===
					EmptySectionBehavior.DONOT_REMOVE_EMPTY_SECTIONS;
				return { shouldRemove, shouldKeep };
			};

			// Test with REMOVE_EMPTY_SECTIONS
			const removeResult = checkBehavior(
				EmptySectionBehavior.REMOVE_EMPTY_SECTIONS,
			);
			expect(removeResult.shouldRemove).toBe(true);
			expect(removeResult.shouldKeep).toBe(false);

			// Test with DONOT_REMOVE_EMPTY_SECTIONS
			const keepResult = checkBehavior(
				EmptySectionBehavior.DONOT_REMOVE_EMPTY_SECTIONS,
			);
			expect(keepResult.shouldRemove).toBe(false);
			expect(keepResult.shouldKeep).toBe(true);
		});

		it("should work with switch statements", () => {
			const testBehavior = (
				behavior: EmptySectionBehaviorType,
			): string => {
				switch (behavior) {
					case EmptySectionBehavior.REMOVE_EMPTY_SECTIONS:
						return "removing";
					case EmptySectionBehavior.DONOT_REMOVE_EMPTY_SECTIONS:
						return "keeping";
				}
			};

			expect(
				testBehavior(EmptySectionBehavior.REMOVE_EMPTY_SECTIONS),
			).toBe("removing");
			expect(
				testBehavior(EmptySectionBehavior.DONOT_REMOVE_EMPTY_SECTIONS),
			).toBe("keeping");
		});
	});
});
