---
sidebar_position: 22
---

# LoggerInstance.setConsoleLogging

Enable or disable console logging for this specific logger instance.

## Syntax

```typescript
setConsoleLogging(enabled: boolean): void
```

## Parameters

### `enabled` (required)

Whether to enable console logging for this instance.

- `true`: Enable console output for this instance
- `false`: Disable console output for this instance

**Type**: `boolean`

## Examples

### Basic Usage

```javascript
const appLogger = logger.createInstance('app');

// Enable console output for this instance
appLogger.setConsoleLogging(true);

// Disable console output for this instance
appLogger.setConsoleLogging(false);
```

### Per-Instance Configuration

```javascript
const logger = InteractiveLogger();

// Global console logging disabled
logger.setConsoleLogging(false);

// But enable it for specific instances
const debugLogger = logger.createInstance('debug');
debugLogger.setConsoleLogging(true);

const productionLogger = logger.createInstance('production');
productionLogger.setConsoleLogging(false);
```

## Notes

- This setting overrides the global console logging setting for this instance
- When enabled, logs are written to both storage and console
- When disabled, logs are only written to storage
- This is instance-specific and doesn't affect other logger instances

## See Also

- [setConsoleLogging](./set-console-logging) - Set console logging globally
- [LoggerInstance.setEnabled](./logger-instance-set-enabled) - Enable/disable logging for this instance
