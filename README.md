# Review Builder

Review Builder simplifies quarterly and weekly reviews by consolidating your Daily and Weekly notes into single files for easier reflection and analysis.

## Overview

This plugin was created to streamline the review process. Instead of manually flipping through 13 weekly notes during a quarterly review, Review Builder generates two consolidated files: `quarterly_days.md` and `quarterly_weeks.md`. These combined files make it easier to:

- Get a complete overview of your notes in one place
- Identify patterns and important items you might have missed
- Work with AI tools by providing consolidated context in fewer files

## Features

### Commands

- **Build Quarterly Review**: Select a quarter, and the plugin compiles all Daily and Weekly notes from that period into separate consolidated files
- **Build Weekly Review**: Select a week, and the plugin compiles all Daily notes from that week (with the previous week's review file included at the top)

### Settings

Configure the plugin behavior in Settings → Review Builder:

- **Temp Folder**: Choose where temporary review files are saved
- **Empty Section Handling**: Control whether empty sections are removed or kept
  - **Remove empty sections** (default): Automatically removes headings with no content, cleaning up templates that were never filled in
- **Filter Template Lines**: Option to remove lines that exist in the template and are unmodified in the output.

## Installation

### From Obsidian Community Plugins

1. Open Settings in Obsidian
2. Navigate to Community plugins and disable Safe mode
3. Click Browse and search for "Review Builder"
4. Click Install, then Enable

### Manual Installation

1. Download the latest release from the [GitHub releases page](https://github.com/mlevison/obsidian-review-builder/releases)
2. Extract the files to your vault's plugins folder: `<VaultFolder>/.obsidian/plugins/review-builder/`
3. Reload Obsidian
4. Enable the plugin in Settings → Community plugins

## Usage

### Building a Quarterly Review

1. Open the command palette (Cmd/Ctrl + P)
2. Search for "Build Quarterly Review"
3. Select the quarter you want to review
4. The plugin creates consolidated files in your configured temp folder

### Building a Weekly Review

1. Open the command palette (Cmd/Ctrl + P)
2. Search for "Build Weekly Review"
3. Select the week you want to review
4. The plugin creates a consolidated file with the previous week's review included

## Development

This plugin uses TypeScript and the Obsidian API.

### Building from Source

```bash
npm install
npm run dev    # Development build with watch mode
npm run build  # Production build
npm run test   # Run tests
```

### Project Structure

```
src/
├── main.ts              # Plugin entry point
├── settings.ts          # Settings interface and defaults
├── commands/
│   ├── index.ts         # Command registration
│   ├── quarterly-review.ts
│   └── weekly-review.ts
├── utils/
│   ├── periodic-notes-util.ts
│   ├── quarter-utils.ts
│   ├── week-utils.ts
│   ├── markdown-utils.ts
│   └── template-filter.ts
└── ui/
    └── settings-tab.ts  # Settings UI
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This plugin is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Support

If you encounter issues or have feature requests, please [create an issue on GitHub](https://github.com/mlevison/obsidian-review-builder/issues).
