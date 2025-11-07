---
sidebar_position: 11
---

# setTimestamps

Enable or disable timestamps for all existing and future logger instances.

## Syntax

```typescript
setTimestamps(enabled: boolean): void
```

## Parameters

### `enabled` (required)

Whether to include timestamps in log entries.

- `true`: Include ISO timestamps in all log entries
- `false`: Exclude timestamps from all log entries

**Type**: `boolean`

## Examples

### Basic Usage

```javascript
const logger = InteractiveLogger();

// Enable timestamps
logger.setTimestamps(true);

// Disable timestamps
logger.setTimestamps(false);
```

### Runtime Toggle

```javascript
const logger = InteractiveLogger();

// Start with timestamps
logger.setTimestamps(true);

// Later, disable timestamps
logger.setTimestamps(false);

// Re-enable timestamps
logger.setTimestamps(true);
```

## Notes

- This affects all logger instances globally
- Applies to both existing and future logger instances
- Individual logger instances can override this setting using `loggerInstance.setTimestamps()`
- Timestamps are in ISO format: `2024-01-15T10:30:00.000Z`

## See Also

- [getTimestamps](./get-timestamps) - Get current timestamp setting
- [LoggerInstance.setTimestamps](./logger-instance-set-timestamps) - Set timestamps for a specific instance
