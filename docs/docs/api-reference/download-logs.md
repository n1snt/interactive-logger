---
sidebar_position: 4
---

# downloadLogs

Programmatically trigger a log download. This method respects the current `singleFile` and `timestamps` settings and will download logs in the same format as the UI button.

## Syntax

```typescript
downloadLogs(): Promise<void>
```

## Returns

A `Promise<void>` that resolves when the download is initiated.

## Examples

### Basic Usage

```javascript
const logger = InteractiveLogger();

// Trigger download programmatically
await logger.downloadLogs();
```

### In Event Handler

```javascript
const logger = InteractiveLogger();

document.getElementById('downloadBtn').addEventListener('click', async () => {
  await logger.downloadLogs();
});
```

### With Error Handling

```javascript
const logger = InteractiveLogger();

try {
  await logger.downloadLogs();
  console.log('Download initiated');
} catch (error) {
  console.error('Download failed:', error);
}
```

## Download Format

The download format depends on your `singleFile` setting:

### Single File Mode (`singleFile: true`)

Downloads a single `.log` file containing all logs from all logger instances, sorted chronologically:

```
============================================================
[2024-01-15T10:30:00.000Z] New Session
============================================================

[2024-01-15T10:30:00.000Z] [app] Application started
[2024-01-15T10:30:01.000Z] [api] GET /api/users - Status: 200
[2024-01-15T10:30:02.000Z] [app] User logged in
```

### Multi-File Mode (`singleFile: false`, default)

Downloads a `.zip` file with separate files for each logger instance:

```
illogger-logs.zip
├── app.log
├── api.log
├── ui.log
├── auth.log
└── __console__.log  (if console interception is enabled)
```

Each file contains logs from that specific logger instance, with timestamps if enabled.

## Notes

- The download is triggered asynchronously
- The promise resolves when the download is initiated, not when it completes
- The download format matches what the UI button would download
- Session separators are included if `sessionSeparator` is enabled
- Console intercepted logs are included if console interception is enabled

## See Also

- [injectButton](./inject-button) - Inject a UI button for downloads
- [enableConsoleInterface](./enable-console-interface) - Enable console download function
- [Examples](../examples#programmatic-download) - More examples
