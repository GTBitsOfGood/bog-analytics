## AnalyticsManager

The `AnalyticsManager` class is a server-side class used for managing custom event types and custom graph types for an analytics service. It provides methods for defining custom events and custom graphs.

### Constructor

```javascript
constructor({ apiBaseUrl }: { apiBaseUrl?: string })
```

- `apiBaseUrl` (optional): The base URL of the analytics service. If not provided, it defaults to `"https://analytics.bitsofgood.org"`.

The constructor throws an error if it's used on the client-side (in the browser) since this class is intended for server-side usage.

### Methods

#### `authenticate(serverApiKey: string): Promise<void>`

Authenticates the `AnalyticsManager` instance with the provided server API key.

##### Example

```javascript
const analyticsManager = new AnalyticsManager();
await analyticsManager.authenticate('your-server-api-key');
```

#### `defineCustomEvent(customEventType: Partial<CustomEventType>): Promise<CustomEventType | null>`

Defines a custom event type in the analytics service.

- `customEventType`: An object containing the properties of the custom event type, including `category`, `subcategory`, and `properties` (an array of property names).

##### Example

```javascript
const customEventType = await analyticsManager.defineCustomEvent({
  category: 'user',
  subcategory: 'signup',
  properties: ['email', 'plan'],
});
```

#### `defineCustomGraph(customGraphType: Partial<CustomGraphType>): Promise<CustomGraphType | null>`

Defines a custom graph type in the analytics service.

- `customGraphType`: An object containing the properties of the custom graph type, including `eventTypeId`, `xProperty`, `yProperty`, `graphType`, and `graphTitle`.

##### Example

```javascript
const customGraphType = await analyticsManager.defineCustomGraph({
  eventTypeId: 'event123',
  xProperty: 'email',
  yProperty: 'plan',
  graphType: 'bar',
  graphTitle: 'User Signups',
});
```

In case of any errors during the process of defining custom event types or custom graph types, the methods return `null` and log an error message using the `logMessage` function provided.