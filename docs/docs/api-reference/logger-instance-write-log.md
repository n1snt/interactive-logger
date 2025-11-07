---
sidebar_position: 21
---

# LoggerInstance.writeLog

Write a log entry. Accepts any number of arguments, which are serialized appropriately.

## Syntax

```typescript
writeLog(...args: any[]): void
```

## Parameters

### `...args` (required)

Any number of arguments to log. The following types are handled:

- **Strings**: Kept as-is
- **Errors**: Serialized with message and stack trace
- **Objects**: JSON stringified
- **Arrays**: JSON stringified
- **Multiple arguments**: Joined with spaces

## Examples

### Simple Messages

```javascript
const appLogger = logger.createInstance('app');

appLogger.writeLog('Application started');
appLogger.writeLog('User logged in');
appLogger.writeLog('Processing payment');
```

### With Data

```javascript
const apiLogger = logger.createInstance('api');

appLogger.writeLog('User ID:', 12345);
appLogger.writeLog('Status:', 'success');
appLogger.writeLog('Count:', 42);
```

### Logging Errors

```javascript
const errorLogger = logger.createInstance('errors');

try {
  riskyOperation();
} catch (error) {
  errorLogger.writeLog('Operation failed:', error);
  // Error message and stack trace are automatically captured
}
```

### Logging Objects

```javascript
const apiLogger = logger.createInstance('api');

apiLogger.writeLog('User data:', {
  id: 123,
  name: 'John Doe',
  email: 'john@example.com'
});
```

### Logging Arrays

```javascript
const apiLogger = logger.createInstance('api');

apiLogger.writeLog('Items:', [1, 2, 3, 4, 5]);
apiLogger.writeLog('Users:', ['Alice', 'Bob', 'Charlie']);
```

### Multiple Arguments

```javascript
const apiLogger = logger.createInstance('api');

apiLogger.writeLog('Request:', 'GET', '/api/users', { status: 200 });
apiLogger.writeLog('Error:', 'Network timeout', 'Retrying...');
```

## Behavior

- If logging is disabled globally or for this instance, this method does nothing (unless console logging is enabled)
- Logs are written asynchronously to IndexedDB (fire-and-forget)
- Errors during storage are caught and logged to console
- Logs are batched and written every 100ms for performance

## Notes

- The method is synchronous but the actual storage operation is asynchronous
- Logs are queued and written in batches
- If the log limit is reached, oldest entries are automatically trimmed
- Timestamps are added automatically if timestamps are enabled

## See Also

- [LoggerInstance.setEnabled](./logger-instance-set-enabled) - Enable/disable logging for this instance
- [LoggerInstance.setTimestamps](./logger-instance-set-timestamps) - Configure timestamps for this instance
- [Examples](../examples) - More examples
