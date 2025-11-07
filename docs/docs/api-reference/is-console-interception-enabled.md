---
sidebar_position: 9
---

# isConsoleInterceptionEnabled

Check if console interception is currently enabled.

## Syntax

```typescript
isConsoleInterceptionEnabled(): boolean
```

## Returns

- `true` if console interception is enabled
- `false` if console interception is disabled

## Examples

### Basic Usage

```javascript
const logger = InteractiveLogger();

if (logger.isConsoleInterceptionEnabled()) {
  console.log("Console interception is active");
} else {
  console.log("Console interception is not active");
}
```

### Conditional Logic

```javascript
const logger = InteractiveLogger();

if (!logger.isConsoleInterceptionEnabled()) {
  logger.enableConsoleInterception();
  console.log("Console interception enabled");
}
```

## See Also

- [enableConsoleInterception](./enable-console-interception) - Enable console interception
- [disableConsoleInterception](./disable-console-interception) - Disable console interception
