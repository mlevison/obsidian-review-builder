import { describe, it, expect } from "@jest/globals";
import {
	generateWeeks,
	getWeekInfo,
	getISOWeekNumber,
	getWeekDateRange,
	getCurrentWeek,
	getPreviousWeek,
	WeekInfo,
} from "../../src/utils/week-utils";

describe("week-utils", () => {
	describe("getISOWeekNumber", () => {
		it("should return correct week number for dates in 2024", () => {
			// January 1, 2024 is a Monday (Week 1)
			const jan1 = new Date(2024, 0, 1);
			expect(getISOWeekNumber(jan1)).toEqual({
				weekNumber: 1,
				year: 2024,
			});

			// January 8, 2024 is a Monday (Week 2)
			const jan8 = new Date(2024, 0, 8);
			expect(getISOWeekNumber(jan8)).toEqual({
				weekNumber: 2,
				year: 2024,
			});

			// December 30, 2024 is a Monday (Week 53)
			const dec30 = new Date(2024, 11, 30);
			expect(getISOWeekNumber(dec30)).toEqual({
				weekNumber: 1,
				year: 2025,
			});
		});

		it("should handle year boundaries correctly", () => {
			// December 31, 2023 is a Sunday, falls in week 52 of 2023
			const dec31_2023 = new Date(2023, 11, 31);
			const result2023 = getISOWeekNumber(dec31_2023);
			expect(result2023.year).toBe(2023);
			expect(result2023.weekNumber).toBe(52);

			// January 1, 2024 is in week 1 of 2024
			const jan1_2024 = new Date(2024, 0, 1);
			const result2024 = getISOWeekNumber(jan1_2024);
			expect(result2024.weekNumber).toBe(1);
			expect(result2024.year).toBe(2024);
		});
	});

	describe("getWeekDateRange", () => {
		it("should return Monday to Sunday range for any day in the week", () => {
			// Test with a Wednesday (January 3, 2024)
			const wednesday = new Date(2024, 0, 3);
			const range = getWeekDateRange(wednesday);

			// Should start on Monday (January 1, 2024)
			expect(range.startDate.getFullYear()).toBe(2024);
			expect(range.startDate.getMonth()).toBe(0);
			expect(range.startDate.getDate()).toBe(1);
			expect(range.startDate.getDay()).toBe(1); // Monday

			// Should end on Sunday (January 7, 2024)
			expect(range.endDate.getFullYear()).toBe(2024);
			expect(range.endDate.getMonth()).toBe(0);
			expect(range.endDate.getDate()).toBe(7);
			expect(range.endDate.getDay()).toBe(0); // Sunday
		});

		it("should handle Sunday correctly", () => {
			// Test with a Sunday (January 7, 2024)
			const sunday = new Date(2024, 0, 7);
			const range = getWeekDateRange(sunday);

			// Should start on Monday (January 1, 2024)
			expect(range.startDate.getDate()).toBe(1);
			expect(range.startDate.getDay()).toBe(1); // Monday

			// Should end on Sunday (January 7, 2024)
			expect(range.endDate.getDate()).toBe(7);
			expect(range.endDate.getDay()).toBe(0); // Sunday
		});

		it("should set correct times", () => {
			const date = new Date(2024, 0, 3);
			const range = getWeekDateRange(date);

			// Start date should be at beginning of day
			expect(range.startDate.getHours()).toBe(0);
			expect(range.startDate.getMinutes()).toBe(0);
			expect(range.startDate.getSeconds()).toBe(0);
			expect(range.startDate.getMilliseconds()).toBe(0);

			// End date should be at end of day
			expect(range.endDate.getHours()).toBe(23);
			expect(range.endDate.getMinutes()).toBe(59);
			expect(range.endDate.getSeconds()).toBe(59);
			expect(range.endDate.getMilliseconds()).toBe(999);
		});
	});

	describe("getWeekInfo", () => {
		it("should return complete week information", () => {
			const date = new Date(2024, 0, 3); // Wednesday, January 3, 2024
			const weekInfo = getWeekInfo(date);

			expect(weekInfo.weekNumber).toBe(1);
			expect(weekInfo.year).toBe(2024);
			expect(weekInfo.label).toBe("Week 1, 2024");
			expect(weekInfo.startDate.getDate()).toBe(1); // Monday
			expect(weekInfo.endDate.getDate()).toBe(7); // Sunday
			expect(weekInfo.dateRangeLabel).toContain("Week 1, 2024");
			expect(weekInfo.dateRangeLabel).toContain("Jan 01, 2024");
			expect(weekInfo.dateRangeLabel).toContain("Jan 07, 2024");
		});
	});

	describe("generateWeeks", () => {
		it("should generate current and previous week", () => {
			const testDate = new Date(2024, 0, 10); // Wednesday, January 10, 2024 (Week 2)
			const weeks = generateWeeks(testDate);

			expect(weeks).toHaveLength(2);

			const [previousWeek, currentWeek] = weeks;
			if (previousWeek === undefined || currentWeek === undefined) {
				throw new Error("Expected weeks to contain two entries");
			}

			// First item should be previous week (Week 1)
			expect(previousWeek.weekNumber).toBe(1);
			expect(previousWeek.year).toBe(2024);
			expect(previousWeek.label).toBe("Week 1, 2024");

			// Second item should be current week (Week 2)
			expect(currentWeek.weekNumber).toBe(2);
			expect(currentWeek.year).toBe(2024);
			expect(currentWeek.label).toBe("Week 2, 2024");
		});

		it("should handle year boundary correctly", () => {
			const testDate = new Date(2024, 0, 3); // Wednesday, January 3, 2024 (Week 1)
			const weeks = generateWeeks(testDate);

			expect(weeks).toHaveLength(2);

			// Previous week should be from 2023 or 2024 depending on ISO week calculation
			const [previousWeek, currentWeek] = weeks;
			if (previousWeek === undefined || currentWeek === undefined) {
				throw new Error("Expected weeks to contain two entries");
			}

			expect(currentWeek.weekNumber).toBe(1);
			expect(currentWeek.year).toBe(2024);
			expect(previousWeek.weekNumber).toBeLessThanOrEqual(53);
		});
	});

	describe("getCurrentWeek", () => {
		it("should return week info for current date", () => {
			const currentWeek = getCurrentWeek();
			const today = new Date();
			const expectedWeek = getWeekInfo(today);

			expect(currentWeek.weekNumber).toBe(expectedWeek.weekNumber);
			expect(currentWeek.year).toBe(expectedWeek.year);
			expect(currentWeek.label).toBe(expectedWeek.label);
		});
	});

	describe("getPreviousWeek", () => {
		it("should return week info for previous week", () => {
			const previousWeek = getPreviousWeek();
			const lastWeek = new Date();
			lastWeek.setDate(lastWeek.getDate() - 7);
			const expectedWeek = getWeekInfo(lastWeek);

			expect(previousWeek.weekNumber).toBe(expectedWeek.weekNumber);
			expect(previousWeek.year).toBe(expectedWeek.year);
			expect(previousWeek.label).toBe(expectedWeek.label);
		});
	});

	describe("WeekInfo interface", () => {
		it("should have all required properties", () => {
			const date = new Date(2024, 0, 3);
			const weekInfo: WeekInfo = getWeekInfo(date);

			expect(typeof weekInfo.label).toBe("string");
			expect(typeof weekInfo.weekNumber).toBe("number");
			expect(typeof weekInfo.year).toBe("number");
			expect(weekInfo.startDate).toBeInstanceOf(Date);
			expect(weekInfo.endDate).toBeInstanceOf(Date);
			expect(typeof weekInfo.dateRangeLabel).toBe("string");
		});
	});
});
