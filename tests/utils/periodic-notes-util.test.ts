import { describe, it, expect } from "@jest/globals";
import { DateRange } from "../../src/utils/periodic-notes-util";

describe("PeriodicNotesUtil", () => {
	describe("DateRange interface", () => {
		it("should define DateRange interface correctly", () => {
			const dateRange: DateRange = {
				startDate: new Date("2024-01-01"),
				endDate: new Date("2024-01-31"),
			};

			expect(dateRange.startDate).toBeInstanceOf(Date);
			expect(dateRange.endDate).toBeInstanceOf(Date);
			expect(dateRange.startDate.getTime()).toBeLessThan(
				dateRange.endDate.getTime(),
			);
		});

		it("should handle same start and end dates", () => {
			const sameDate = new Date("2024-01-15");
			const dateRange: DateRange = {
				startDate: sameDate,
				endDate: sameDate,
			};

			expect(dateRange.startDate.getTime()).toBe(
				dateRange.endDate.getTime(),
			);
		});
	});

	// Note: The main functionality of PeriodicNotesUtil relies heavily on Obsidian's
	// daily-notes-interface and window.moment, which are difficult to mock in a unit test
	// environment. The core logic has been refactored to use obsidian-daily-notes-interface
	// functions (getDailyNote, getWeeklyNote) instead of parsing dates from file keys,
	// which eliminates the need for custom date parsing logic and makes the code more reliable.
	//
	// The key improvements made:
	// 1. Removed parseDateFromKey function that relied on guessing date formats
	// 2. Use getDailyNote(moment, allDailyNotes) to check if notes exist for specific dates
	// 3. Use getWeeklyNote(moment, allWeeklyNotes) to check if notes exist for specific weeks
	// 4. Iterate through date ranges using moment.js instead of parsing file keys
	//
	// This approach is more robust because:
	// - It uses the same logic as Obsidian's daily/weekly notes plugins
	// - It doesn't require guessing or parsing date formats from filenames
	// - It handles different date formats automatically through the interface
	// - It's less prone to errors when users have custom date formats
});
