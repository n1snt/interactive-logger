---
sidebar_position: 13
---

# setEnabled

Enable or disable logging globally. When disabled, `writeLog()` calls are ignored (but console logging may still work if enabled).

## Syntax

```typescript
setEnabled(enabled: boolean): void
```

## Parameters

### `enabled` (required)

Whether to enable logging globally.

- `true`: Enable logging for all logger instances
- `false`: Disable logging for all logger instances

**Type**: `boolean`

## Examples

### Basic Usage

```javascript
const logger = InteractiveLogger();

// Disable all logging
logger.setEnabled(false);

// ... later ...

// Re-enable logging
logger.setEnabled(true);
```

### Conditional Logging

```javascript
const logger = InteractiveLogger();

if (isProduction) {
  logger.setEnabled(false);
} else {
  logger.setEnabled(true);
}
```

## Notes

- This affects all logger instances globally
- When disabled, `writeLog()` calls are ignored (no-op)
- Console logging may still work if `setConsoleLogging(true)` was called
- Individual logger instances can override this setting using `loggerInstance.setEnabled()`

## See Also

- [getEnabled](./get-enabled) - Get current enabled state
- [LoggerInstance.setEnabled](./logger-instance-set-enabled) - Set enabled state for a specific instance
