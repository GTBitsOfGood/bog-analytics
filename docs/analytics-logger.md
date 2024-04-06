### Constructor:

Initializes a new instance of the AnalyticsLogger class<br>
**Parameters:** <br>

-   apiBaseUrl (optional): The base URL for the analytics service. Defaults to "https://analytics.bitsofgood.org".
-   environment (optional): The environment in which the analytics logger operates (e.g., development, production). Defaults to EventEnvironment.DEVELOPMENT.

```
    const logger = new AnalyticsLogger({
        apiBaseUrl: "https://analytics.example.com",
        environment: EventEnvironment.PRODUCTION,
    });
```

### authenticate:

Authenticates the client with the analytics service using an API key<br>
**Parameter:** clientApiKey: A string representing the client API key.<br>
**Returns:** A promise that resolves when the authentication is complete.

    logger.authenticate('your-client-api-key');

### logClickEvent:

Logs a click event to the analytics service<br>
**Parameter:** clickEvent: An object containing the properties objectId and userId<br>
**Returns:** A promise that resolves with the logged ClickEvent object or null in case of an error.

    logger.logClickEvent({
        objectId: 'button123',
        userId: 'user456',
    }).then(event => console.log('Click event logged:', event));

### logVisitEvent

Logs a page visit event<br>
**Parameter:** visitEvent: An object containing pageUrl and userId<br>
**Returns:** A promise that resolves with the logged VisitEvent object or null if an error occurs.

    logger.logVisitEvent({
        pageUrl: 'https://example.com/home',
        userId: 'user456',
    }).then(event => console.log('Visit event logged:', event));

### logInputEvent:

Logs an input event, typically when a user enters text in a form field<br>
**Parameter:** inputEvent: An object with objectId, userId, and textValue<br>
**Returns:** A promise that resolves with the logged InputEvent object or null in case of an error.

    logger.logInputEvent({
        objectId: 'textInput',
        userId: 'user456',
        textValue: 'Hello, world!',
    }).then(event => console.log('Input event logged:', event));

### logCustomEvent:

Logs a custom event defined by the developer<br>
**Parameter:** customEvent: An object with eventTypeId and properties <br>
**Returns:** A promise that resolves with the logged CustomEvent object or null if an error occurs.

```
logger.logCustomEvent({
    eventTypeId: 'customEventType123',
    properties: {
        key: 'value',
        anotherKey: 'anotherValue',
    },
}).then(event => console.log('Custom event logged:', event));
```
