---
sidebar_position: 20
---

# getMaxLogs

Get the current maximum number of logs setting.

## Syntax

```typescript
getMaxLogs(): number
```

## Returns

The current maximum number of logs allowed.

## Examples

### Basic Usage

```javascript
const logger = InteractiveLogger();

const maxLogs = logger.getMaxLogs();
console.log(`Max logs: ${maxLogs}`);
```

### Check Current Limit

```javascript
const logger = InteractiveLogger();

const maxLogs = logger.getMaxLogs();
if (maxLogs < 10000) {
  await logger.setMaxLogs(10000);
}
```

## See Also

- [setMaxLogs](./set-max-logs) - Update maximum log limit
- [getStats](./get-stats) - Get storage statistics
