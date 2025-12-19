/**
 * Test suite for template line filtering functionality
 * Specification: #{#tlf1a authority=developer}
 *
 * This test suite covers the following acceptance criteria:
 * - #{#tlf1a-1}: Template content retrieval
 * - #{#tlf1a-2}: Line-by-line comparison
 * - #{#tlf1a-3}: Processing order (after removeEmptySections)
 * - #{#tlf1a-4}: Heading preservation
 * - #{#tlf1a-5}: Template availability handling
 */

import { filterTemplateLines } from "../../src/utils/template-filter";
import { removeEmptySections } from "../../src/utils/markdown-utils";

describe("template-filter", () => {
	describe("filterTemplateLines - #{#tlf1a-2}: Line-by-line comparison", () => {
		it("should filter out exact template line matches", () => {
			const content = `## Morning Reflection
What are my priorities today?
- Finish the quarterly report
- Meet with team`;

			const templateLines = [
				"## Morning Reflection",
				"What are my priorities today?",
				"",
				"## Evening Review",
				"What did I accomplish?",
			];

			const expected = `## Morning Reflection
- Finish the quarterly report
- Meet with team`;

			expect(filterTemplateLines(content, templateLines)).toBe(expected);
		});

		it("should preserve lines that differ from template", () => {
			const content = `## Goals
- Complete project documentation
- Review pull requests`;

			const templateLines = ["## Goals", "What do you want to achieve?"];

			const expected = `## Goals
- Complete project documentation
- Review pull requests`;

			expect(filterTemplateLines(content, templateLines)).toBe(expected);
		});

		it("should be case-sensitive when matching", () => {
			const content = `## Section
what are my goals?
What Are My Goals?`;

			const templateLines = ["## Section", "What are my goals?"];

			const expected = `## Section
what are my goals?
What Are My Goals?`;

			expect(filterTemplateLines(content, templateLines)).toBe(expected);
		});

		it("should be whitespace-sensitive when matching", () => {
			// Line 2: exact match (will be filtered)
			// Line 3: trailing space (will be kept)
			// Line 4: leading space (will be kept)
			const line1 = "## Section";
			const line2 = "What are my priorities?";
			const line3 = "What are my priorities? "; // trailing space
			const line4 = " What are my priorities?"; // leading space

			const content = `${line1}
${line2}
${line3}
${line4}`;

			const templateLines = ["## Section", "What are my priorities?"];

			const expected = `${line1}
${line3}
${line4}`;

			expect(filterTemplateLines(content, templateLines)).toBe(expected);
		});

		it("should filter empty lines that match template", () => {
			const content = `## Section 1
Content here

## Section 2
More content`;

			const templateLines = ["## Section 1", "", "## Section 2"];

			const expected = `## Section 1
Content here
## Section 2
More content`;

			expect(filterTemplateLines(content, templateLines)).toBe(expected);
		});
	});

	describe("filterTemplateLines - #{#tlf1a-4}: Heading preservation", () => {
		it("should always preserve headings even if they match template", () => {
			const content = `## Morning Routine
- Woke up at 7am

## Work Tasks
- Completed report

## Evening
Relaxed`;

			const templateLines = [
				"## Morning Routine",
				"",
				"## Work Tasks",
				"",
				"## Evening",
				"",
			];

			const expected = `## Morning Routine
- Woke up at 7am
## Work Tasks
- Completed report
## Evening
Relaxed`;

			expect(filterTemplateLines(content, templateLines)).toBe(expected);
		});

		it("should preserve all heading levels (h1-h6)", () => {
			const content = `# H1 Heading
# H1 Heading
## H2 Heading
### H3 Heading
#### H4 Heading
##### H5 Heading
###### H6 Heading
Content`;

			const templateLines = [
				"# H1 Heading",
				"## H2 Heading",
				"### H3 Heading",
				"#### H4 Heading",
				"##### H5 Heading",
				"###### H6 Heading",
			];

			// All headings should be preserved
			expect(filterTemplateLines(content, templateLines)).toBe(content);
		});

		it("should preserve headings with special characters", () => {
			const content = `## Goals & Objectives
Content

## Q&A Section
More content`;

			const templateLines = ["## Goals & Objectives", "## Q&A Section"];

			expect(filterTemplateLines(content, templateLines)).toBe(content);
		});
	});

	describe("filterTemplateLines - #{#tlf1a-5}: Template availability handling", () => {
		it("should handle empty template array", () => {
			const content = `## Section
Some content here`;

			const templateLines: string[] = [];

			expect(filterTemplateLines(content, templateLines)).toBe(content);
		});

		it("should handle undefined template lines", () => {
			const content = `## Section
Content`;

			expect(filterTemplateLines(content, undefined)).toBe(content);
		});

		it("should handle null template lines", () => {
			const content = `## Section
Content`;

			expect(filterTemplateLines(content, null)).toBe(content);
		});
	});

	describe("filterTemplateLines - Complex scenarios", () => {
		it("should handle real daily note example", () => {
			const content = `## 2024-01-15

### Morning Reflection
What are my top 3 priorities today?
- Complete quarterly review
- Team standup at 10am
- Lunch with Sarah

### Gratitude
What am I grateful for today?
My supportive team

### Evening Review
What did I accomplish today?

### Notes`;

			const templateLines = [
				"## {{date}}",
				"",
				"### Morning Reflection",
				"What are my top 3 priorities today?",
				"",
				"### Gratitude",
				"What am I grateful for today?",
				"",
				"### Evening Review",
				"What did I accomplish today?",
				"",
				"### Notes",
				"",
			];

			const expected = `## 2024-01-15
### Morning Reflection
- Complete quarterly review
- Team standup at 10am
- Lunch with Sarah
### Gratitude
My supportive team
### Evening Review
### Notes`;

			expect(filterTemplateLines(content, templateLines)).toBe(expected);
		});

		it("should handle markdown formatting in content", () => {
			const content = `## Tasks
- [x] Complete report
- [ ] Review code
**Important**: Don't forget meeting

### Notes
> This is a quote
\`\`\`typescript
const x = 1;
\`\`\``;

			const templateLines = ["## Tasks", "", "### Notes", ""];

			const expected = `## Tasks
- [x] Complete report
- [ ] Review code
**Important**: Don't forget meeting
### Notes
> This is a quote
\`\`\`typescript
const x = 1;
\`\`\``;

			expect(filterTemplateLines(content, templateLines)).toBe(expected);
		});

		it("should preserve lines with partial template matches", () => {
			const content = `## Goals
What are my goals for this week?
What are my goals?`;

			const templateLines = ["## Goals", "What are my goals?"];

			const expected = `## Goals
What are my goals for this week?`;

			expect(filterTemplateLines(content, templateLines)).toBe(expected);
		});
	});

	describe("Integration with removeEmptySections - #{#tlf1a-3}: Processing order", () => {
		it("should apply removeEmptySections BEFORE template filtering", () => {
			// First, removeEmptySections removes empty sections
			const rawContent = `## Morning Tasks
What should I do?

## Afternoon Tasks

## Evening Tasks
Relax`;

			const afterEmptyRemoval = removeEmptySections(rawContent);

			// Then template filtering removes unchanged template lines
			const templateLines = [
				"## Morning Tasks",
				"What should I do?",
				"",
				"## Afternoon Tasks",
				"",
				"## Evening Tasks",
				"",
			];

			const expected = `## Morning Tasks
## Evening Tasks
Relax`;

			expect(filterTemplateLines(afterEmptyRemoval, templateLines)).toBe(
				expected,
			);
		});

		it("should handle complex pipeline: empty removal then template filter", () => {
			const rawContent = `### Daily Standup
What did I do yesterday?

### Goals

### Blockers
None today

### Notes`;

			// Step 1: Remove empty sections
			const afterEmptyRemoval = removeEmptySections(rawContent);
			// After step 1: Goals and Notes sections should be removed

			const templateLines = [
				"### Daily Standup",
				"What did I do yesterday?",
				"",
				"### Goals",
				"",
				"### Blockers",
				"",
				"### Notes",
				"",
			];

			// Step 2: Filter template lines
			const final = filterTemplateLines(afterEmptyRemoval, templateLines);

			const expected = `### Daily Standup
### Blockers
None today`;

			expect(final).toBe(expected);
		});
	});

	describe("Edge cases", () => {
		it("should handle empty content", () => {
			const content = "";
			const templateLines = ["## Section"];

			expect(filterTemplateLines(content, templateLines)).toBe("");
		});

		it("should handle content with no headings", () => {
			const content = `Just some text
More text
No headings`;

			const templateLines = ["Just some text"];

			const expected = `More text
No headings`;

			expect(filterTemplateLines(content, templateLines)).toBe(expected);
		});

		it("should handle template with lines not in content", () => {
			const content = `## Section
User content`;

			const templateLines = [
				"## Section",
				"Template line 1",
				"Template line 2",
			];

			const expected = `## Section
User content`;

			expect(filterTemplateLines(content, templateLines)).toBe(expected);
		});

		it("should handle multiple consecutive template matches", () => {
			const content = `Template line 1
Template line 2
Template line 3
User content
Template line 4`;

			const templateLines = [
				"Template line 1",
				"Template line 2",
				"Template line 3",
				"Template line 4",
			];

			const expected = `User content`;

			expect(filterTemplateLines(content, templateLines)).toBe(expected);
		});

		it("should preserve trailing newlines in content", () => {
			const content = `## Section
Content

`;
			const templateLines = ["## Section"];

			const expected = `## Section
Content

`;

			expect(filterTemplateLines(content, templateLines)).toBe(expected);
		});
	});
});
