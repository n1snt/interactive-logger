---
sidebar_position: 18
---

# getStats

Get statistics about the current log storage.

## Syntax

```typescript
getStats(): Promise<{ totalLogs: number; activeLoggers: number; maxLogs: number }>
```

## Returns

A `Promise<object>` with the following properties:

- `totalLogs` (number): Total number of log entries stored
- `activeLoggers` (number): Number of unique logger instances that have logged
- `maxLogs` (number): Maximum number of logs allowed

## Examples

### Basic Usage

```javascript
const logger = InteractiveLogger();

const stats = await logger.getStats();
console.log(`Total logs: ${stats.totalLogs}`);
console.log(`Active loggers: ${stats.activeLoggers}`);
console.log(`Max logs: ${stats.maxLogs}`);
```

### Display Statistics

```javascript
const logger = InteractiveLogger();

const stats = await logger.getStats();
const usagePercent = (stats.totalLogs / stats.maxLogs) * 100;

console.log(`Storage: ${stats.totalLogs}/${stats.maxLogs} (${usagePercent.toFixed(1)}%)`);
console.log(`Active loggers: ${stats.activeLoggers}`);
```

### Check Storage Usage

```javascript
const logger = InteractiveLogger();

const stats = await logger.getStats();
if (stats.totalLogs > stats.maxLogs * 0.9) {
  console.warn('Storage is nearly full');
  await logger.setMaxLogs(stats.maxLogs * 2);
}
```

## See Also

- [setMaxLogs](./set-max-logs) - Update maximum log limit
- [clear](./clear) - Clear all logs
