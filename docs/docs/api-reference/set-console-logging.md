---
sidebar_position: 10
---

# setConsoleLogging

Enable or disable console logging for all logger instances. When enabled, logs are also output to the browser console.

## Syntax

```typescript
setConsoleLogging(enabled: boolean): void
```

## Parameters

### `enabled` (required)

Whether to enable console logging.

- `true`: Enable console output for all logger instances
- `false`: Disable console output for all logger instances

**Type**: `boolean`

## Examples

### Basic Usage

```javascript
const logger = InteractiveLogger();

// Enable console output
logger.setConsoleLogging(true);

// Disable console output
logger.setConsoleLogging(false);
```

### Conditional Console Logging

```javascript
const logger = InteractiveLogger();

if (isDevelopment) {
  logger.setConsoleLogging(true);
} else {
  logger.setConsoleLogging(false);
}
```

## Notes

- This affects all logger instances globally
- When enabled, logs are written to both storage and console
- When disabled, logs are only written to storage
- This is different from console interception (which captures all console output)
- Individual logger instances can override this setting using `loggerInstance.setConsoleLogging()`

## See Also

- [LoggerInstance.setConsoleLogging](./logger-instance-set-console-logging) - Set console logging for a specific instance
- [enableConsoleInterception](./enable-console-interception) - Capture all console output
