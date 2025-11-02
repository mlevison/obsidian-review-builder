import {
	removeEmptySections,
	isSectionEmpty,
} from "../../src/utils/markdown-utils";

describe("markdown-utils", () => {
	describe("removeEmptySections", () => {
		it("should remove a single empty section", () => {
			const input = `## Section 1
Some content
## Empty Section
## Section 3
More content`;

			const expected = `## Section 1
Some content
## Section 3
More content`;

			expect(removeEmptySections(input)).toBe(expected);
		});

		it("should remove multiple consecutive empty sections", () => {
			const input = `## Section 1
Content here
## Empty Section 1
## Empty Section 2
## Empty Section 3
## Section 4
Final content`;

			const expected = `## Section 1
Content here
## Section 4
Final content`;

			expect(removeEmptySections(input)).toBe(expected);
		});

		it("should handle empty sections with only whitespace", () => {
			const input = `## Section 1
Some content
## Empty with spaces


## Section 3
More content`;

			const expected = `## Section 1
Some content
## Section 3
More content`;

			expect(removeEmptySections(input)).toBe(expected);
		});

		it("should preserve sections with content", () => {
			const input = `## Section 1
Content 1
## Section 2
Content 2
## Section 3
Content 3`;

			expect(removeEmptySections(input)).toBe(input);
		});

		it("should handle empty section at the end of document", () => {
			const input = `## Section 1
Some content
## Empty at end`;

			const expected = `## Section 1
Some content`;

			expect(removeEmptySections(input)).toBe(expected);
		});

		it("should handle document with only headings (all empty)", () => {
			const input = `## Section 1
## Section 2
## Section 3`;

			const expected = ``;

			expect(removeEmptySections(input)).toBe(expected);
		});

		it("should handle different heading levels", () => {
			const input = `### Level 3 Empty
### Level 3 With Content
Some text
#### Level 4
More text
##### Level 5 Empty
## Another Level 2
Content here`;

			const expected = `### Level 3 With Content
Some text
#### Level 4
More text
## Another Level 2
Content here`;

			expect(removeEmptySections(input)).toBe(expected);
		});

		it("should preserve blank lines within sections that have content", () => {
			const input = `## Section 1
First paragraph

Second paragraph after blank line
## Section 2
Content`;

			expect(removeEmptySections(input)).toBe(input);
		});

		it("should handle markdown with lists", () => {
			const input = `## Section with list
- Item 1
- Item 2
## Empty section
## Section with numbered list
1. First
2. Second`;

			const expected = `## Section with list
- Item 1
- Item 2
## Section with numbered list
1. First
2. Second`;

			expect(removeEmptySections(input)).toBe(expected);
		});

		it("should handle markdown with code blocks", () => {
			const input = `## Section with code
\`\`\`typescript
const x = 1;
\`\`\`
## Empty section
## Another section
Text here`;

			const expected = `## Section with code
\`\`\`typescript
const x = 1;
\`\`\`
## Another section
Text here`;

			expect(removeEmptySections(input)).toBe(expected);
		});

		it("should handle empty string", () => {
			expect(removeEmptySections("")).toBe("");
		});

		it("should handle document with no headings", () => {
			const input = `Just some text
with multiple lines
no headings here`;

			expect(removeEmptySections(input)).toBe(input);
		});

		it("should handle document starting with content before first heading", () => {
			const input = `Some intro text
## First heading
Content here
## Empty heading
## Last heading
More content`;

			const expected = `Some intro text
## First heading
Content here
## Last heading
More content`;

			expect(removeEmptySections(input)).toBe(expected);
		});

		it("should preserve inline code and bold text", () => {
			const input = `## Section 1
This has \`inline code\` and **bold text**
## Empty
## Section 2
*Italic* and ***bold italic***`;

			const expected = `## Section 1
This has \`inline code\` and **bold text**
## Section 2
*Italic* and ***bold italic***`;

			expect(removeEmptySections(input)).toBe(expected);
		});

		it("should handle blockquotes", () => {
			const input = `## Section with quote
> This is a quote
> Multiple lines
## Empty section
## Another section
Regular text`;

			const expected = `## Section with quote
> This is a quote
> Multiple lines
## Another section
Regular text`;

			expect(removeEmptySections(input)).toBe(expected);
		});

		it("should handle tables", () => {
			const input = `## Section with table
| Column 1 | Column 2 |
|----------|----------|
| Value 1  | Value 2  |
## Empty section
## Next section
Text`;

			const expected = `## Section with table
| Column 1 | Column 2 |
|----------|----------|
| Value 1  | Value 2  |
## Next section
Text`;

			expect(removeEmptySections(input)).toBe(expected);
		});

		it("should handle horizontal rules", () => {
			const input = `## Section 1
Content
---
More content
## Empty section
## Section 2
Final content`;

			const expected = `## Section 1
Content
---
More content
## Section 2
Final content`;

			expect(removeEmptySections(input)).toBe(expected);
		});

		it("should handle mixed heading levels with complex nesting", () => {
			const input = `# Main Title
Content under main title
### Empty subsection
### Subsection with content
Some text here
#### Empty level 4
#### Level 4 with content
Details
## Chapter 2
More content`;

			const expected = `# Main Title
Content under main title
### Subsection with content
Some text here
#### Level 4 with content
Details
## Chapter 2
More content`;

			expect(removeEmptySections(input)).toBe(expected);
		});

		it("should handle real-world daily note example", () => {
			const input = `## 2024-01-15

### Morning Routine

- Woke up at 7am
- Coffee

### Work Tasks

### Evening
Dinner with family

### Notes`;

			const expected = `### Morning Routine

- Woke up at 7am
- Coffee

### Evening
Dinner with family`;

			expect(removeEmptySections(input)).toBe(expected);
		});

		it("should handle sections with only special characters", () => {
			const input = `## Section 1
!!!
## Empty
## Section 2
***`;

			const expected = `## Section 1
!!!
## Section 2
***`;

			expect(removeEmptySections(input)).toBe(expected);
		});
	});

	describe("isSectionEmpty", () => {
		it("should return true for section with only heading", () => {
			const section = `## Empty Section`;
			expect(isSectionEmpty(section)).toBe(true);
		});

		it("should return true for section with heading and whitespace", () => {
			const section = `## Empty Section

	`;
			expect(isSectionEmpty(section)).toBe(true);
		});

		it("should return false for section with content", () => {
			const section = `## Section
Some content here`;
			expect(isSectionEmpty(section)).toBe(false);
		});

		it("should return true for section followed immediately by another heading", () => {
			const section = `## Section 1
## Section 2`;
			expect(isSectionEmpty(section)).toBe(true);
		});

		it("should return false for section with list", () => {
			const section = `## Section
- Item 1`;
			expect(isSectionEmpty(section)).toBe(false);
		});

		it("should return false for section with code block", () => {
			const section = `## Section
\`\`\`
code
\`\`\``;
			expect(isSectionEmpty(section)).toBe(false);
		});

		it("should return false for section with single character", () => {
			const section = `## Section
x`;
			expect(isSectionEmpty(section)).toBe(false);
		});

		it("should handle empty string", () => {
			expect(isSectionEmpty("")).toBe(true);
		});

		it("should return false for section with blockquote", () => {
			const section = `## Section
> Quote`;
			expect(isSectionEmpty(section)).toBe(false);
		});

		it("should return false for section with horizontal rule", () => {
			const section = `## Section
---`;
			expect(isSectionEmpty(section)).toBe(false);
		});
	});
});
