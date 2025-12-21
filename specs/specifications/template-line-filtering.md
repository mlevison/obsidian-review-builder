# Template Line Filtering Specification

## Overview
This specification defines the behavior for filtering out unchanged template lines when compiling daily or weekly notes into review documents.

## Specification ID: #{#tlf1a authority=developer}

**Requirement**: When compiling daily or weekly notes, detect and skip lines that appear unchanged from the original template.

**Context**: 
- Daily and weekly notes are created from templates using Obsidian's daily-notes plugin or periodic-notes plugin
- Templates contain placeholder text and structure that users fill in over time
- When compiling multiple notes into a review document, unchanged template lines add noise and should be filtered out
- This filtering must occur AFTER empty sections are eliminated (via `removeEmptySections`)

**Rationale**:
- Reduces noise in compiled review documents
- Highlights actual user-written content
- Improves readability of quarterly/weekly reviews
- Maintains focus on meaningful content rather than template boilerplate

**Authority Level**: developer (application-level feature)

### Acceptance Criteria

1. **Template Content Retrieval** #{#tlf1a-1 authority=developer}
   - System SHALL retrieve template contents for daily notes using `getTemplateContents(dailySettings.template)` when `dailySettings.template` is defined
   - System SHALL retrieve template contents for weekly notes using `getTemplateContents(weeklySettings.template)` when `weeklySettings.template` is defined
   - System SHALL handle cases where no template is configured (template field is undefined or null)
   - Template retrieval SHALL occur once per compilation operation, not per note

2. **Line-by-Line Comparison** #{#tlf1a-2 authority=developer}
   - System SHALL compare each line of compiled note content against template lines
   - Comparison SHALL be exact string matching (case-sensitive, whitespace-sensitive)
   - System SHALL skip lines that match template lines exactly (excluding blank lines)
   - System SHALL include lines that differ from template in any way
   - System SHALL preserve all blank lines (empty or whitespace-only lines) in the output
   - Blank lines SHALL NOT be filtered even if they exist in the template

3. **Processing Order** #{#tlf1a-3 authority=developer}
   - Template line filtering SHALL occur AFTER `removeEmptySections` processing
   - The processing pipeline SHALL be:
     1. Read note content
     2. Apply `removeEmptySections` if enabled
     3. Apply template line filtering
     4. Return filtered content
   - Each processing stage SHALL preserve line structure and markdown formatting

4. **Heading Preservation** #{#tlf1a-4 authority=developer}
   - System SHALL preserve all heading lines (lines matching `/^#{1,6}\s+/`)
   - Headings SHALL NOT be filtered even if they match template headings
   - This ensures document structure is maintained in compiled output
   - Section boundaries remain clear in the compiled review

5. **Template Availability Handling** #{#tlf1a-5 authority=developer}
   - When no template is configured, system SHALL proceed without template filtering
   - When template file cannot be retrieved, system SHALL log warning and proceed without filtering
   - System SHALL NOT fail compilation if template is unavailable
   - System SHALL provide clear user feedback about template filtering status

6. **Configuration** #{#tlf1a-6 authority=developer}
   - Template line filtering SHALL be configurable via settings
   - Settings SHALL include option to enable/disable template filtering for daily notes
   - Settings SHALL include option to enable/disable template filtering for weekly notes
   - Default behavior SHALL be enabled for both daily and weekly notes
   - Configuration SHALL be independent from `removeEmptySections` setting

### Implementation Notes

**Affected Files**:
- `src/utils/periodic-notes-util.ts` - Main implementation location
  - Modify `getNotesContent()` method to accept template content and apply filtering
  - Add new method `filterTemplateLines(content: string, templateLines: string[]): string`
- `src/commands/weekly-review.ts` - Weekly review compilation
  - Retrieve weekly template before calling `getNotesContent()`
- `src/commands/quarterly-review.ts` - Quarterly review compilation  
  - Retrieve daily/weekly templates before calling `getNotesContent()`
- `src/settings.ts` - Add configuration options
  - Add `filterDailyTemplateLines: boolean` setting
  - Add `filterWeeklyTemplateLines: boolean` setting

**Dependencies**:
- `obsidian-daily-notes-interface`: Uses `getTemplateContents()` and settings interfaces
- Existing `removeEmptySections` functionality from `markdown-utils.ts`

**Testing Considerations**:
- Mock `getTemplateContents()` to return controlled template content
- Test with various template formats (simple, complex, multi-section)
- Verify filtering doesn't affect user-modified lines
- Test interaction with `removeEmptySections` 
- Verify heading preservation
- Test edge cases: empty templates, missing templates, malformed templates

### Example Scenarios

**Scenario 1: Daily Note with Unchanged Template Lines**

Template content:
```markdown
## Morning Reflection
What are my priorities today?

## Evening Review  
What did I accomplish?
```

Daily note content:
```markdown
## Morning Reflection
What are my priorities today?
- Finish the quarterly report
- Meet with team

## Evening Review
What did I accomplish?
```

After `removeEmptySections`: (no change, both sections have content)
```markdown
## Morning Reflection
What are my priorities today?
- Finish the quarterly report
- Meet with team

## Evening Review
What did I accomplish?
```

After template filtering (note: blank lines are preserved):
```markdown
## Morning Reflection

- Finish the quarterly report
- Meet with team

## Evening Review

```

**Scenario 2: Weekly Note with No Template**

When `weeklySettings.template` is undefined or null, no filtering occurs.
Content passes through unchanged (except for `removeEmptySections` if enabled).

**Scenario 3: Template Lines Modified**

Template: `## Goals`
Note: `## Goals for This Week`

Result: Both heading and content preserved (line differs from template)

### Related Specifications

- Empty Section Removal: Existing functionality in `markdown-utils.ts`
- Periodic Notes Integration: Uses `obsidian-daily-notes-interface`

### Version History

- v1.1 (2025-12-21): Updated to preserve blank lines during template filtering
- v1.0 (2025-12-18): Initial specification created

---

**Traceability**: 
- Implementation: TBD
- Tests: TBD
- Documentation: TBD
