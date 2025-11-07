---
sidebar_position: 19
---

# setMaxLogs

Update the maximum number of logs to store. If the current count exceeds the new limit, oldest entries are automatically trimmed.

## Syntax

```typescript
setMaxLogs(maxLogs: number): Promise<void>
```

## Parameters

### `maxLogs` (required)

New maximum number of logs. Must be at least 1.

**Type**: `number`

**Minimum**: `1`

## Returns

A `Promise<void>` that resolves when the limit is updated and trimming is complete.

## Throws

- `Error` if `maxLogs` is less than 1

## Examples

### Basic Usage

```javascript
const logger = InteractiveLogger();

// Increase limit to 10,000
await logger.setMaxLogs(10000);

// Decrease limit to 1,000 (trims if needed)
await logger.setMaxLogs(1000);
```

### With Error Handling

```javascript
const logger = InteractiveLogger();

try {
  await logger.setMaxLogs(5000);
  console.log('Max logs updated');
} catch (error) {
  console.error('Invalid maxLogs value:', error);
}
```

### Dynamic Adjustment

```javascript
const logger = InteractiveLogger();

const stats = await logger.getStats();
if (stats.totalLogs > stats.maxLogs * 0.8) {
  // Increase limit if storage is getting full
  await logger.setMaxLogs(stats.maxLogs * 2);
}
```

## Notes

- If current log count exceeds the new limit, oldest entries are automatically removed
- Trimming happens synchronously when the limit is updated
- The operation is asynchronous and returns a Promise

## See Also

- [getMaxLogs](./get-max-logs) - Get current maximum log limit
- [getStats](./get-stats) - Get storage statistics
