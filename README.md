# Quarterly/Weekly Review Builder
An Obsidian plugin that speeds up quarterly (and weekly) reviews, by consolidating Daily and Weekly notes into a single file.

This plugin, was born out of a quarterly review, where I was frustrated with the process of flipping through 13 weekly notes, wondered if I was missing something important.

Now each quarter, I have two files to look at: quarterly_days.md and quarterly_weeks.md. In a world of GenAI, having only two files makes it easier to do a final check at each step the review process. Using your AI tool of choice (Obsidian Copilot in my case), I point the tool at my review file file and the `quarterly_days.md` and `quarterly_weeks.md` files. I ask questions like "looking at my review file so far, is there anything I missed?"

## Commands
- **Build Quarterly Review** - asks which quarter to compile notes for, then finds all the Daily and Weekly notes from the Quarter.
- **Build Weekly Review** - asks which week to compile notes for, then finds all the Daily notes from the Week. It also adds the previous week's review file at the top of the file.

## Settings
- **Temp Folder**: Select which folder to use for temporary files.
- **Empty Section Handling**: Choose whether to remove or keep empty sections (headings with no content) from weekly and quarterly review notes. Options:
  - **Remove empty sections** (default): Automatically removes headings with no content, cleaning up daily notes that often have blank section templates like "### Work Tasks" or "### Notes" that were never filled in.
  - **Keep empty sections**: Preserves all headings, even if they have no content.

## Installation

### Manual Installation (for development/testing)
1. Clone or download this repository
2. Copy the `main.js`, `manifest.json`, and `styles.css` (if present) files to your vault's plugins directory:
   ```
   <VaultFolder>/.obsidian/plugins/quarterly-review-builder/
   ```
3. Reload Obsidian
4. Enable the plugin in **Settings → Community plugins**

### From Community Plugins (when available)

1. Open **Settings → Community plugins**
2. Disable **Safe mode**
3. Click **Browse** and search for "Quarterly Review Builder"
4. Click **Install** and then **Enable**

## Development

This plugin is built using:

- **TypeScript** for type safety
- **esbuild** for fast bundling
- **Obsidian API** for plugin functionality

### Building from Source

```bash
# Install dependencies
npm install

# Development build (with watch mode)
npm run dev

# Production build
npm run build
```

### Project Structure

```
src/
├── main.ts              # Plugin entry point and lifecycle
├── settings.ts          # Settings interface and defaults
├── commands/
│   ├── index.ts         # Command registration
│   └── quarterly-review.ts # Quarterly review implementation
├── utils/
│   └── periodic-notes-integration.ts # Periodic Notes plugin integration
└── ui/
    └── settings-tab.ts  # Settings UI component
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[MIT License](LICENSE)

## Support

If you encounter any issues or have feature requests, please create an issue on the GitHub repository.

---

*Built with ❤️ for the Obsidian community*
