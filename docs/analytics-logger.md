## AnalyticsLogger

The `AnalyticsLogger` class is a client-side class used for logging various types of events to an analytics service. It provides methods for logging click events, visit events, input events, and custom events.

### Constructor

```javascript
constructor({ apiBaseUrl, environment }: { apiBaseUrl?: string, environment?: EventEnvironment })
```

- `apiBaseUrl` (optional): The base URL of the analytics service. If not provided, it defaults to `"https://analytics.bitsofgood.org"`.
- `environment` (optional): The environment in which the events are being logged (e.g., development, production). If not provided, it defaults to `EventEnvironment.DEVELOPMENT`.

### Methods

#### `authenticate(clientApiKey: string): Promise<void>`

Authenticates the `AnalyticsLogger` instance with the provided client API key.

##### Example

```javascript
const analyticsLogger = new AnalyticsLogger({ environment: EventEnvironment.PRODUCTION });
await analyticsLogger.authenticate('your-client-api-key');
```

#### `logClickEvent(clickEvent: ClickEventProperties): Promise<ClickEvent | null>`

Logs a click event to the analytics service.

- `clickEvent`: An object containing the properties of the click event, including `objectId` and `userId`.

##### Example

```javascript
const clickEvent = await analyticsLogger.logClickEvent({
  objectId: 'button-1',
  userId: 'user123',
});
```

#### `logVisitEvent(visitEvent: VisitEventProperties): Promise<VisitEvent | null>`

Logs a visit event to the analytics service.

- `visitEvent`: An object containing the properties of the visit event, including `pageUrl` and `userId`.

##### Example

```javascript
const visitEvent = await analyticsLogger.logVisitEvent({
  pageUrl: 'https://example.com/page',
  userId: 'user123',
});
```

#### `logInputEvent(inputEvent: InputEventProperties): Promise<InputEvent | null>`

Logs an input event to the analytics service.

- `inputEvent`: An object containing the properties of the input event, including `objectId`, `userId`, and `textValue`.

##### Example

```javascript
const inputEvent = await analyticsLogger.logInputEvent({
  objectId: 'input-field-1',
  userId: 'user123',
  textValue: 'example text',
});
```

#### `logCustomEvent(category: string, subcategory: string, customEvent: Partial<CustomEvent>): Promise<CustomEvent | null>`

Logs a custom event to the analytics service.

- `category`: The category of the custom event.
- `subcategory`: The subcategory of the custom event.
- `customEvent`: An object containing the properties of the custom event.

##### Example

```javascript
const customEvent = await analyticsLogger.logCustomEvent('feature', 'signup', {
  properties: {
    email: 'user@example.com',
    plan: 'premium',
  },
});
```

In case of any errors during the logging process, the methods return `null` and log an error message using the `logMessage` function provided.