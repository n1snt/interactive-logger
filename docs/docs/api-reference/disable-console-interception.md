---
sidebar_position: 8
---

# disableConsoleInterception

Disable console interception and restore the original console methods.

## Syntax

```typescript
disableConsoleInterception(): void
```

## Examples

### Basic Usage

```javascript
const logger = InteractiveLogger();
logger.enableConsoleInterception();

// ... later ...

logger.disableConsoleInterception();
// Console methods are now restored to their original behavior
```

### Conditional Interception

```javascript
const logger = InteractiveLogger();

if (isDevelopment) {
  logger.enableConsoleInterception();
} else {
  logger.disableConsoleInterception();
}
```

## Notes

- Restores the original console methods
- Stops capturing console output to logs
- Safe to call even if interception is not enabled
- Does not affect logs that were already captured

## See Also

- [enableConsoleInterception](./enable-console-interception) - Enable console interception
- [isConsoleInterceptionEnabled](./is-console-interception-enabled) - Check if interception is enabled
