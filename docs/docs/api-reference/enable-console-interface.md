---
sidebar_position: 15
---

# enableConsoleInterface

Exposes the `downloadLogs()` function on the `window` object, allowing you to trigger downloads directly from the browser console.

## Syntax

```typescript
enableConsoleInterface(): void
```

## Examples

### Basic Usage

```javascript
const logger = InteractiveLogger();
logger.enableConsoleInterface();

// Then in browser console:
downloadLogs()  // Triggers the download
```

### For Debugging

```javascript
const logger = InteractiveLogger();
logger.enableConsoleInterface();

// Now you can download logs from the console without UI
// Useful for debugging in production
```

## Notes

- Only works in browser environments
- The function is exposed as `window.downloadLogs`
- Useful for debugging when you can't access the UI button
- Use [disableConsoleInterface](./disable-console-interface) to remove the function

## See Also

- [disableConsoleInterface](./disable-console-interface) - Remove console interface
- [downloadLogs](./download-logs) - Programmatic download method
