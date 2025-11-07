---
sidebar_position: 6
---

# withdrawButton

Removes the download button from the page and cleans up all event listeners.

## Syntax

```typescript
withdrawButton(): void
```

## Examples

### Basic Usage

```javascript
const logger = InteractiveLogger();
logger.injectButton();

// Later, remove the button
logger.withdrawButton();
```

### Conditional Button

```javascript
const logger = InteractiveLogger();

if (isDevelopment) {
  logger.injectButton();
} else {
  logger.withdrawButton();
}
```

### Toggle Button

```javascript
const logger = InteractiveLogger();
let buttonVisible = false;

function toggleButton() {
  if (buttonVisible) {
    logger.withdrawButton();
    buttonVisible = false;
  } else {
    logger.injectButton();
    buttonVisible = true;
  }
}
```

## Notes

- Removes the button element from the DOM
- Cleans up all event listeners (drag, click, resize)
- Does not clear the position from localStorage (it will be reused if button is injected again)
- Safe to call even if no button is currently injected

## See Also

- [injectButton](./inject-button) - Inject the download button
- [Examples](../examples#download-button) - More examples
