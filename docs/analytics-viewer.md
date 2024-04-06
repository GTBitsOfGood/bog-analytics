### Constructor

Initializes a new instance of the AnalyticsViewer class <br>
**Parameter:** apiBaseUrl (optional): The base URL for the analytics service. Defaults to "https://analytics.bitsofgood.org".

```
const analyticsViewer = new AnalyticsViewer({
    apiBaseUrl: "https://analytics.example.com",
});
```

### getCustomEventTypes

Retrieves a list of custom event types defined in the analytics system for a given project <br>
**Parameter:** projectName: A string representing the name of the project for which to retrieve the custom event types.<br>
**Returns:** A promise that resolves with an array of CustomEventType objects or null if an error occurs.

```
analyticsViewer.getCustomEventTypes('ProjectX').then(eventTypes => {
if (eventTypes) {
console.log('Custom event types retrieved:', eventTypes);
}
});
```

### getCustomGraphTypesbyId

Fetches custom graph types associated with a specific event type ID within a project
**Parameters:**

-   projectName: The name of the project from which to retrieve the custom graph types.
-   eventTypeId: A string identifier for the event type associated with the graph types to be retrieved.

**Returns:** A promise that resolves with an array of custom graph types or null if an error occurs.

```
analyticsViewer.getCustomGraphTypesbyId('ProjectX', 'eventType123').then(graphTypes => {
    if (graphTypes) {
        console.log('Custom graph types retrieved:', graphTypes);
    }
});
```
