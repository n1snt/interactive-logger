---
sidebar_position: 16
---

# disableConsoleInterface

Removes the `downloadLogs()` function from the `window` object.

## Syntax

```typescript
disableConsoleInterface(): void
```

## Examples

### Basic Usage

```javascript
const logger = InteractiveLogger();
logger.enableConsoleInterface();

// ... later ...

logger.disableConsoleInterface();
// downloadLogs() is no longer available in console
```

## Notes

- Removes `window.downloadLogs` if it exists
- Safe to call even if console interface is not enabled
- Does not affect the programmatic `downloadLogs()` method

## See Also

- [enableConsoleInterface](./enable-console-interface) - Enable console interface
- [downloadLogs](./download-logs) - Programmatic download method
