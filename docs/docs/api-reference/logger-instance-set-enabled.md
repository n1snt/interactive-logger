---
sidebar_position: 24
---

# LoggerInstance.setEnabled

Enable or disable logging for this specific logger instance.

## Syntax

```typescript
setEnabled(enabled: boolean): void
```

## Parameters

### `enabled` (required)

Whether to enable logging for this instance.

- `true`: Enable logging for this instance
- `false`: Disable logging for this instance

**Type**: `boolean`

## Examples

### Basic Usage

```javascript
const appLogger = logger.createInstance('app');

// Disable logging for this instance
appLogger.setEnabled(false);

// ... later ...

// Re-enable logging for this instance
appLogger.setEnabled(true);
```

### Per-Instance Configuration

```javascript
const logger = InteractiveLogger({
  enabled: true  // Global setting: enabled
});

// Disable specific instances
const debugLogger = logger.createInstance('debug');
debugLogger.setEnabled(false);  // This instance won't log

const productionLogger = logger.createInstance('production');
// This instance will log (uses global setting)
```

### Conditional Logging

```javascript
const logger = InteractiveLogger();

const verboseLogger = logger.createInstance('verbose');
if (isDevelopment) {
  verboseLogger.setEnabled(true);
} else {
  verboseLogger.setEnabled(false);
}
```

## Notes

- This setting overrides the global enabled setting for this instance
- When disabled, `writeLog()` calls are ignored (no-op)
- Console logging may still work if `setConsoleLogging(true)` was called
- This is instance-specific and doesn't affect other logger instances

## See Also

- [setEnabled](./set-enabled) - Set enabled state globally
- [LoggerInstance.writeLog](./logger-instance-write-log) - Write logs to this instance
