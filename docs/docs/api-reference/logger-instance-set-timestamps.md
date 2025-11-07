---
sidebar_position: 23
---

# LoggerInstance.setTimestamps

Enable or disable timestamps for this specific logger instance.

## Syntax

```typescript
setTimestamps(enabled: boolean): void
```

## Parameters

### `enabled` (required)

Whether to include timestamps in log entries for this instance.

- `true`: Include ISO timestamps in log entries
- `false`: Exclude timestamps from log entries

**Type**: `boolean`

## Examples

### Basic Usage

```javascript
const appLogger = logger.createInstance('app');

// Enable timestamps for this instance
appLogger.setTimestamps(true);

// Disable timestamps for this instance
appLogger.setTimestamps(false);
```

### Per-Instance Configuration

```javascript
const logger = InteractiveLogger({
  timestamps: false  // Global setting: no timestamps
});

// Override for specific instances
const appLogger = logger.createInstance('app');
appLogger.setTimestamps(true);  // This instance will have timestamps

const apiLogger = logger.createInstance('api');
// This instance will not have timestamps (uses global setting)
```

## Notes

- This setting overrides the global timestamp setting for this instance
- Timestamps are in ISO format: `2024-01-15T10:30:00.000Z`
- This is instance-specific and doesn't affect other logger instances
- Timestamps are added when the log is written, not when the method is called

## See Also

- [setTimestamps](./set-timestamps) - Set timestamps globally
- [LoggerInstance.writeLog](./logger-instance-write-log) - Write logs to this instance
