import { generateQuarters } from "../../src/utils/quarter-utils";

describe("generateQuarters - Core Requirement Tests", () => {
	test("returns current quarter and at least 4 previous quarters for Q1 2024", () => {
		const testDate = new Date(2024, 1, 15); // February 15, 2024 (Q1)
		const quarters = generateQuarters(testDate);

		// Should return 6 quarters
		expect(quarters).toHaveLength(6);

		// Find the current quarter (should contain test date)
		const currentQuarter = quarters.find(
			(q) => testDate >= q.startDate && testDate <= q.endDate,
		);
		expect(currentQuarter).toBeDefined();
		expect(currentQuarter!.quarter).toBe(1);
		expect(currentQuarter!.year).toBe(2024);

		// Should have at least 4 quarters before current
		const quartersBefore = quarters.filter(
			(q) => q.startDate < currentQuarter!.startDate,
		);
		expect(quartersBefore.length).toBeGreaterThanOrEqual(4);

		// Should be in chronological order
		const [first, ...rest] = quarters;
		if (first === undefined) {
			throw new Error("Expected quarters to contain at least one entry");
		}
		let prev = first;
		for (const q of rest) {
			expect(q.startDate.getTime()).toBeGreaterThan(
				prev.startDate.getTime(),
			);
			prev = q;
		}
	});

	test("returns current quarter and at least 4 previous quarters for Q2 2024", () => {
		const testDate = new Date(2024, 4, 15); // May 15, 2024 (Q2)
		const quarters = generateQuarters(testDate);

		// Should return 6 quarters
		expect(quarters).toHaveLength(6);

		// Find the current quarter
		const currentQuarter = quarters.find(
			(q) => testDate >= q.startDate && testDate <= q.endDate,
		);
		expect(currentQuarter).toBeDefined();
		expect(currentQuarter!.quarter).toBe(2);
		expect(currentQuarter!.year).toBe(2024);

		// Should have at least 4 quarters before current
		const quartersBefore = quarters.filter(
			(q) => q.startDate < currentQuarter!.startDate,
		);
		expect(quartersBefore.length).toBeGreaterThanOrEqual(4);

		// Verify specific previous quarters exist
		expect(quarters.some((q) => q.quarter === 1 && q.year === 2024)).toBe(
			true,
		); // Q1 2024
		expect(quarters.some((q) => q.quarter === 4 && q.year === 2023)).toBe(
			true,
		); // Q4 2023
		expect(quarters.some((q) => q.quarter === 3 && q.year === 2023)).toBe(
			true,
		); // Q3 2023
		expect(quarters.some((q) => q.quarter === 2 && q.year === 2023)).toBe(
			true,
		); // Q2 2023
	});

	test("returns current quarter and at least 4 previous quarters for Q3 2024", () => {
		const testDate = new Date(2024, 7, 15); // August 15, 2024 (Q3)
		const quarters = generateQuarters(testDate);

		const currentQuarter = quarters.find(
			(q) => testDate >= q.startDate && testDate <= q.endDate,
		);
		expect(currentQuarter).toBeDefined();
		expect(currentQuarter!.quarter).toBe(3);
		expect(currentQuarter!.year).toBe(2024);

		const quartersBefore = quarters.filter(
			(q) => q.startDate < currentQuarter!.startDate,
		);
		expect(quartersBefore.length).toBeGreaterThanOrEqual(4);
	});

	test("returns current quarter and at least 4 previous quarters for Q4 2024", () => {
		const testDate = new Date(2024, 10, 15); // November 15, 2024 (Q4)
		const quarters = generateQuarters(testDate);

		const currentQuarter = quarters.find(
			(q) => testDate >= q.startDate && testDate <= q.endDate,
		);
		expect(currentQuarter).toBeDefined();
		expect(currentQuarter!.quarter).toBe(4);
		expect(currentQuarter!.year).toBe(2024);

		const quartersBefore = quarters.filter(
			(q) => q.startDate < currentQuarter!.startDate,
		);
		expect(quartersBefore.length).toBeGreaterThanOrEqual(4);
	});

	test("quarter boundaries are correct", () => {
		const testDate = new Date(2024, 4, 15); // Q2 2024
		const quarters = generateQuarters(testDate);

		// Verify Q1 2024 dates
		const q1_2024 = quarters.find(
			(q) => q.quarter === 1 && q.year === 2024,
		);
		expect(q1_2024).toBeDefined();
		expect(q1_2024!.startDate).toEqual(new Date(2024, 0, 1)); // Jan 1
		expect(q1_2024!.endDate).toEqual(new Date(2024, 2, 31)); // Mar 31

		// Verify Q2 2024 dates
		const q2_2024 = quarters.find(
			(q) => q.quarter === 2 && q.year === 2024,
		);
		expect(q2_2024).toBeDefined();
		expect(q2_2024!.startDate).toEqual(new Date(2024, 3, 1)); // Apr 1
		expect(q2_2024!.endDate).toEqual(new Date(2024, 5, 30)); // Jun 30
	});

	test("handles year boundaries correctly", () => {
		const testDate = new Date(2024, 1, 15); // Q1 2024
		const quarters = generateQuarters(testDate);

		// Should span multiple years
		const years = [...new Set(quarters.map((q) => q.year))];
		expect(years.length).toBeGreaterThan(1);
		expect(years).toContain(2023);
		expect(years).toContain(2024);
	});
});
