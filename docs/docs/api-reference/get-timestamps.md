---
sidebar_position: 12
---

# getTimestamps

Get the current global timestamp setting.

## Syntax

```typescript
getTimestamps(): boolean
```

## Returns

- `true` if timestamps are enabled
- `false` if timestamps are disabled

## Examples

### Basic Usage

```javascript
const logger = InteractiveLogger();

const timestampsEnabled = logger.getTimestamps();
console.log('Timestamps enabled:', timestampsEnabled);
```

### Conditional Logic

```javascript
const logger = InteractiveLogger();

if (!logger.getTimestamps()) {
  logger.setTimestamps(true);
  console.log('Timestamps enabled');
}
```

## See Also

- [setTimestamps](./set-timestamps) - Set timestamp setting
- [LoggerInstance.setTimestamps](./logger-instance-set-timestamps) - Set timestamps for a specific instance
