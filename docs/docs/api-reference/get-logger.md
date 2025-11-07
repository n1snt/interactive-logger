---
sidebar_position: 3
---

# getLogger

Retrieves an existing logger instance by name.

## Syntax

```typescript
getLogger(name: string): LoggerInstance | undefined
```

## Parameters

### `name` (required)

The name of the logger instance to retrieve.

**Type**: `string`

## Returns

- `LoggerInstance` if a logger instance with the given name exists
- `undefined` if no logger instance with the given name exists

## Examples

### Basic Usage

```javascript
import { InteractiveLogger, getLogger } from 'interactive-logger';

const logger = InteractiveLogger();
const appLogger = logger.createInstance('app');

// Later, retrieve the logger instance
const retrievedLogger = getLogger('app');
if (retrievedLogger) {
  retrievedLogger.writeLog('Found existing logger');
}
```

### Check Before Use

```javascript
const apiLogger = getLogger('api');
if (apiLogger) {
  apiLogger.writeLog('API logger exists');
} else {
  console.warn('API logger not found');
}
```

### Global Access

Since `getLogger` is a global function, you can use it from anywhere in your application:

```javascript
// In one file
const logger = InteractiveLogger();
logger.createInstance('app');

// In another file
import { getLogger } from 'interactive-logger';
const appLogger = getLogger('app');
appLogger?.writeLog('Logging from another file');
```

## Notes

- `getLogger` is a global function, not a method on the logger instance
- Returns `undefined` if the logger instance doesn't exist
- Always check for `undefined` before using the returned logger instance
- Logger instances are stored in memory and persist for the lifetime of the page

## See Also

- [createInstance](./create-instance) - Create logger instances
- [LoggerInstance](./logger-instance-write-log) - Logger instance methods
