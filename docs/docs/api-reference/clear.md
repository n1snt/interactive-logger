---
sidebar_position: 17
---

# clear

Clears all logs from storage. This operation is irreversible.

## Syntax

```typescript
clear(): Promise<void>
```

## Returns

A `Promise<void>` that resolves when all logs are cleared.

## Examples

### Basic Usage

```javascript
const logger = InteractiveLogger();

await logger.clear();
console.log('All logs cleared');
```

### With Error Handling

```javascript
const logger = InteractiveLogger();

try {
  await logger.clear();
  console.log('All logs cleared successfully');
} catch (error) {
  console.error('Failed to clear logs:', error);
}
```

### Before New Session

```javascript
const logger = InteractiveLogger();

// Clear logs before starting a new test session
await logger.clear();
logger.createInstance('test').writeLog('New test session started');
```

## Notes

- This operation is **irreversible**
- Clears all logs from all logger instances
- Clears the entire IndexedDB object store
- Use with caution in production environments

## See Also

- [getStats](./get-stats) - Get storage statistics
- [setMaxLogs](./set-max-logs) - Update maximum log limit
