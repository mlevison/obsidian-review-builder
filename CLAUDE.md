# Project Conventions

## Error handling in catch blocks

When catching an error and surfacing it to the user via `new Notice(...)`, always extract the error message using the typesafe pattern and include it in the notice:

```ts
} catch (error) {
	const message =
		error instanceof Error ? error.message : String(error);
	new Notice(`Failed to do X: ${message}`);
}
```

Do not leave `error` unused, and do not interpolate `error` directly (`${error}`) — `instanceof Error` narrowing keeps the message extraction typesafe for non-`Error` throws.

Reference implementation: `src/utils/periodic-notes-util.ts` (the `getTemplateContent` and file-read catch blocks).
