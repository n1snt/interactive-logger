---
sidebar_position: 7
---

# enableConsoleInterception

Enable console interception to capture all console output (console.log, console.error, console.warn, console.info, console.debug, console.trace) and automatically write them to the log file. This allows you to capture console output from your application and third-party libraries.

## Syntax

```typescript
enableConsoleInterception(): void
```

## Examples

### Basic Usage

```javascript
const logger = InteractiveLogger();
logger.enableConsoleInterception();

// Now all console output will be captured
console.log("This will be captured");
console.error("This error will be captured");
console.warn("This warning will be captured");
```

### With Third-Party Libraries

```javascript
const logger = InteractiveLogger();
logger.enableConsoleInterception();

// All console output from third-party libraries will be captured
someLibrary.doSomething(); // If it logs to console, it will be captured
```

## Intercepted Methods

The following console methods are intercepted:

- `console.log`
- `console.error`
- `console.warn`
- `console.info`
- `console.debug`
- `console.trace`

## Log Format

Intercepted console calls are stored with:
- **Logger name**: `__console__`
- **Log level prefix**: `[LOG]`, `[ERROR]`, `[WARN]`, `[INFO]`, `[DEBUG]`, `[TRACE]`

Example in downloaded logs:

```
[2024-01-15T10:30:00.000Z] [__console__] [LOG] This will be captured
[2024-01-15T10:30:01.000Z] [__console__] [ERROR] This error will be captured
[2024-01-15T10:30:02.000Z] [__console__] [WARN] This warning will be captured
```

## Notes

- Console interception wraps the native console methods
- Original console functionality is preserved (logs still appear in console)
- Intercepted logs are stored in addition to normal console output
- Use [disableConsoleInterception](./disable-console-interception) to stop interception
- Use [isConsoleInterceptionEnabled](./is-console-interception-enabled) to check if interception is active

## See Also

- [disableConsoleInterception](./disable-console-interception) - Disable console interception
- [isConsoleInterceptionEnabled](./is-console-interception-enabled) - Check if interception is enabled
- [Examples](../examples#console-interception) - More examples
