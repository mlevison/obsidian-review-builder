/**
 * Template Line Filtering Utility
 * Specification: #{#tlf1a authority=developer}
 *
 * Filters out unchanged template lines from compiled daily/weekly notes.
 * This processing occurs AFTER removeEmptySections has been applied.
 */

/**
 * Filter out template lines from content while preserving headings
 * #{#tlf1a-2}: Line-by-line comparison
 * #{#tlf1a-4}: Heading preservation
 * #{#tlf1a-5}: Template availability handling
 *
 * @param content - The note content to filter
 * @param templateLines - Array of template lines to filter out (or null/undefined)
 * @returns Filtered content with template lines removed (except headings)
 */
export function filterTemplateLines(
	content: string,
	templateLines: string[] | null | undefined,
): string {
	// #{#tlf1a-5}: Handle missing or empty templates
	if (!templateLines || templateLines.length === 0) {
		return content;
	}

	// Handle empty content
	if (!content) {
		return "";
	}

	// Convert template lines to a Set for faster lookup
	const templateSet = new Set(templateLines);

	// Process content line by line
	const lines = content.split("\n");
	const filteredLines: string[] = [];
	for (const line of lines) {
		// #{#tlf1a-4}: Always preserve headings (lines starting with # followed by space)
		const isHeading = /^#{1,6}\s+/.test(line);
		const isBlankLine = /^\s*$/.test(line);

		if (isHeading || isBlankLine) {
			filteredLines.push(line);
		} else {
			// #{#tlf1a-2}: Exact string matching (case-sensitive, whitespace-sensitive)
			if (!templateSet.has(line)) {
				filteredLines.push(line);
			}
		}
	}

	return filteredLines.join("\n");
}
