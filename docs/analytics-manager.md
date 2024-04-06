### Constructor

Initializes a new instance of the AnalyticsManager class <br>
**Parameter:** apiBaseUrl (optional): The base URL for the analytics service. Defaults to "https://analytics.bitsofgood.org". <br>
**Throws:** An error if attempted to be instantiated in a client-side environment.

```
const analyticsManager = new AnalyticsManager({
    apiBaseUrl: "https://analytics.example.com",
});
```

### authenticate

Authenticates the server with the analytics service using an API key<br>
**Parameter:** serverApiKey: A string <br>
**Returns:** A promise that resolves once the authentication is complete.

```
analyticsManager.authenticate('your-server-api-key');
```

### defineCustomEvent

Defines a new custom event type in the analytics system<br>
**Parameter:** customEventType: An object of type CustomEventType that includes category, subcategory, and properties. <br>
**Returns:** A promise that resolves with the created custom event type or null if an error occurs.

```
analyticsManager.defineCustomEvent({
    category: 'User Interaction',
    subcategory: 'Button Click',
    properties: ['buttonId', 'clickTime'],
}).then(event => console.log('Custom event type defined:', event));
```

### defineCustomGraph

Creates a new custom graph type in the analytics system <br>
**Parameter:** customGraphType: An object of type CustomGraphType that includes eventTypeId, xProperty, yProperty, graphType, and graphTitle. <br>
**Returns:** A promise that resolves with the created custom graph type or null if an error occurs

```
analyticsManager.defineCustomGraph({
    eventTypeId: '12345',
    xProperty: 'clickTime',
    yProperty: 'buttonId',
    graphType: 'scatter',
    graphTitle: 'Button Clicks Over Time',
}).then(graph => console.log('Custom graph type defined:', graph));
```
