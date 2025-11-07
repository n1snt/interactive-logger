---
sidebar_position: 14
---

# getEnabled

Get the current global enabled state.

## Syntax

```typescript
getEnabled(): boolean
```

## Returns

- `true` if logging is enabled
- `false` if logging is disabled

## Examples

### Basic Usage

```javascript
const logger = InteractiveLogger();

const isEnabled = logger.getEnabled();
if (!isEnabled) {
  console.warn('Logger is currently disabled');
}
```

### Conditional Logic

```javascript
const logger = InteractiveLogger();

if (!logger.getEnabled()) {
  logger.setEnabled(true);
  console.log('Logging enabled');
}
```

## See Also

- [setEnabled](./set-enabled) - Set enabled state
- [LoggerInstance.setEnabled](./logger-instance-set-enabled) - Set enabled state for a specific instance
