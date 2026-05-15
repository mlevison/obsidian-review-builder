export const removeEmptySections = (content: string): string => {
	if (!content.trim()) {
		return "";
	}

	const lines = content.split("\n");
	const lineAt = (idx: number): string => {
		const line = lines[idx];
		if (line === undefined) {
			throw new Error(`Line index ${idx} out of bounds`);
		}
		return line;
	};
	const result: string[] = [];

	let i = 0;
	while (i < lines.length) {
		const line = lineAt(i);
		const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);

		if (headingMatch) {
			// Found a heading - check if section is empty
			const headingLine = line;
			const sectionContent: string[] = [];

			// Collect lines until next heading or end
			let j = i + 1;
			while (j < lines.length) {
				const nextLine = lineAt(j);
				const nextHeadingMatch = nextLine.match(/^#{1,6}\s+/);

				if (nextHeadingMatch) {
					// Found next heading, stop collecting
					break;
				}

				sectionContent.push(nextLine);
				j++;
			}

			// Check if section has any non-whitespace content
			const hasContent = sectionContent.some(
				(contentLine) => contentLine.trim().length > 0,
			);

			if (hasContent) {
				// Section has content, include it
				result.push(headingLine);
				result.push(...sectionContent);
			}
			// If no content, skip this heading

			// Move to next heading or end
			i = j;
		} else {
			// Not a heading - add to result
			result.push(line);
			i++;
		}
	}

	// Clean up trailing empty lines
	while (result.at(-1)?.trim() === "") {
		result.pop();
	}

	return result.join("\n");
};

/**
 * Checks if a markdown section is empty.
 * A section is considered empty if it contains only whitespace between headings.
 *
 * @param section - The section content to check (including the heading)
 * @returns True if the section is empty, false otherwise
 */
export const isSectionEmpty = (section: string): boolean => {
	const lines = section.split("\n");
	const lineAt = (idx: number): string => {
		const line = lines[idx];
		if (line === undefined) {
			throw new Error(`Line index ${idx} out of bounds`);
		}
		return line;
	};

	// Skip the heading line and check remaining lines
	for (let i = 1; i < lines.length; i++) {
		const line = lineAt(i);

		// If we hit another heading, the section is empty
		if (line.match(/^#{1,6}\s+/)) {
			return true;
		}

		// If we find non-whitespace content, section is not empty
		if (line.trim().length > 0) {
			return false;
		}
	}

	// If we only found whitespace, the section is empty
	return true;
};
