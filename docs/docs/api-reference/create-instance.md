---
sidebar_position: 2
---

# createInstance

Creates a new logger instance with a unique name.

## Syntax

```typescript
createInstance(name: string, options?: CreateInstanceOptions): LoggerInstance
```

## Parameters

### `name` (required)

Unique identifier for the logger instance. This name is used to:
- Group logs in storage
- Identify logs in downloaded files
- Retrieve the logger instance later

**Type**: `string`

### `options` (optional)

An object with the following properties:

#### `timeStamps?: boolean`

Override global timestamp setting for this instance. If not provided, uses the global timestamp setting.

**Type**: `boolean`

## Returns

A `LoggerInstance` object with methods for writing logs and configuring instance-specific settings.

## Examples

### Basic Usage

```javascript
const logger = InteractiveLogger();
const appLogger = logger.createInstance('app');
```

### With Timestamp Override

```javascript
const logger = InteractiveLogger({
  timestamps: false  // Global setting: no timestamps
});

// This instance will have timestamps
const appLogger = logger.createInstance('app', { timeStamps: true });

// This instance will not have timestamps (uses global setting)
const apiLogger = logger.createInstance('api');
```

### Multiple Instances

```javascript
const logger = InteractiveLogger();

// Create loggers for different parts of your application
const appLogger = logger.createInstance('app');
const apiLogger = logger.createInstance('api');
const authLogger = logger.createInstance('auth');
const uiLogger = logger.createInstance('ui');
const errorLogger = logger.createInstance('errors');
```

## Notes

- Each logger instance operates independently
- You can configure timestamps, console logging, and enabled state per instance
- Logger instances are stored in memory and can be retrieved using `getLogger()`
- Logs from different instances are stored separately and can be downloaded as separate files

## See Also

- [getLogger](./get-logger) - Retrieve an existing logger instance
- [LoggerInstance.writeLog](./logger-instance-write-log) - Write logs to an instance
- [Core Concepts](../core-concepts#logger-instances) - Learn more about logger instances
