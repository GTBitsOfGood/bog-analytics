
<div align="center"> 
<h1>Bits of Good Analytics NPM Package</h1></div>

</div> 

## Analytics Logger Module

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

## AnalyticsManager Module

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

## AnalyticsViewer Module

The `AnalyticsViewer` class is used to retrieve various types of events from an analytics service, including custom event types, custom graph types, click events, visit events, input events, and custom events. It provides methods for fetching these events in a paginated manner or retrieving all events at once.

### Constructor

```javascript
constructor({ apiBaseUrl, environment }: { apiBaseUrl?: string, environment?: EventEnvironment })
```

- `apiBaseUrl` (optional): The base URL of the analytics service. If not provided, it defaults to `"https://analytics.bitsofgood.org"`.
- `environment` (optional): The environment from which to retrieve events (e.g., development, production). If not provided, it defaults to `EventEnvironment.DEVELOPMENT`.

### Methods

#### `getCustomEventTypes(projectName: string): Promise<CustomEventType[] | null>`

Retrieves the custom event types for a given project.

- `projectName`: The name of the project.

##### Example

```javascript
const customEventTypes = await analyticsViewer.getCustomEventTypes('my-project');
```

#### `getCustomGraphTypesbyId(projectName: string, eventTypeId: string): Promise<CustomGraphType[] | null>`

Retrieves the custom graph types for a given project and event type ID.

- `projectName`: The name of the project.
- `eventTypeId`: The ID of the event type.

##### Example

```javascript
const customGraphTypes = await analyticsViewer.getCustomGraphTypesbyId('my-project', 'event123');
```

#### `getClickEventsPaginated(queryParams: GetEventsQueryParams): Promise<{ events: ClickEvent[], afterId: string } | null>`

Retrieves a paginated list of click events based on the provided query parameters.

- `queryParams`: An object containing query parameters for filtering and paginating the events.

##### Example

```javascript
const queryParams = {
  projectName: 'my-project',
  afterTime: new Date(),
  limit: 100,
};
const clickEvents = await analyticsViewer.getClickEventsPaginated(queryParams);
```

#### `getAllClickEvents(projectName: string, afterTime?: Date): Promise<ClickEvent[] | null>`

Retrieves all click events for a given project, optionally filtered by a start time.

- `projectName`: The name of the project.
- `afterTime` (optional): The start time to filter events.

##### Example

```javascript
const clickEvents = await analyticsViewer.getAllClickEvents('my-project', new Date('2023-04-01'));
```

#### `getVisitEventsPaginated(queryParams: GetEventsQueryParams): Promise<{ events: VisitEvent[], afterId: string } | null>`

Retrieves a paginated list of visit events based on the provided query parameters.

- `queryParams`: An object containing query parameters for filtering and paginating the events.

##### Example

```javascript
const queryParams = {
  projectName: 'my-project',
  afterTime: new Date(),
  limit: 100,
};
const visitEvents = await analyticsViewer.getVisitEventsPaginated(queryParams);
```

#### `getAllVisitEvents(projectName: string, afterTime?: Date): Promise<VisitEvent[] | null>`

Retrieves all visit events for a given project, optionally filtered by a start time.

- `projectName`: The name of the project.
- `afterTime` (optional): The start time to filter events.

##### Example

```javascript
const visitEvents = await analyticsViewer.getAllVisitEvents('my-project', new Date('2023-04-01'));
```

#### `getInputEventsPaginated(queryParams: GetEventsQueryParams): Promise<{ events: InputEvent[], afterId: string } | null>`

Retrieves a paginated list of input events based on the provided query parameters.

- `queryParams`: An object containing query parameters for filtering and paginating the events.

##### Example

```javascript
const queryParams = {
  projectName: 'my-project',
  afterTime: new Date(),
  limit: 100,
};
const inputEvents = await analyticsViewer.getInputEventsPaginated(queryParams);
```

#### `getAllInputEvents(projectName: string, afterTime?: Date): Promise<InputEvent[] | null>`

Retrieves all input events for a given project, optionally filtered by a start time.

- `projectName`: The name of the project.
- `afterTime` (optional): The start time to filter events.

##### Example

```javascript
const inputEvents = await analyticsViewer.getAllInputEvents('my-project', new Date('2023-04-01'));
```

#### `getCustomEventsPaginated(queryParams: GetCustomEventsQueryParams): Promise<{ events: CustomEvent[], afterId: string } | null>`

Retrieves a paginated list of custom events based on the provided query parameters.

- `queryParams`: An object containing query parameters for filtering and paginating the events, including `category` and `subcategory`.

##### Example

```javascript
const queryParams = {
  projectName: 'my-project',
  afterTime: new Date(),
  limit: 100,
  category: 'user',
  subcategory: 'signup',
};
const customEvents = await analyticsViewer.getCustomEventsPaginated(queryParams);
```

#### `getAllCustomEvents(projectName: string, category: string, subcategory: string, afterTime?: Date): Promise<CustomEvent[] | null>`

Retrieves all custom events for a given project, category, and subcategory, optionally filtered by a start time.

- `projectName`: The name of the project.
- `category`: The category of the custom events.
- `subcategory`: The subcategory of the custom events.
- `afterTime` (optional): The start time to filter events.

##### Example

```javascript
const customEvents = await analyticsViewer.getAllCustomEvents('my-project', 'user', 'signup', new Date('2023-04-01'));
```

In case of any errors during the retrieval of events, the methods return `null` and log an error message using the `logMessage` function provided.

## GDPRManager Module

The `GDPRManager` class provides methods to manage GDPR-compliant data operations for various event types. It includes methods for deleting, retrieving, and updating click, visit, input, and custom events for a specific user.

### Constructor

```javascript
constructor({ apiBaseUrl }: { apiBaseUrl?: string })
```

- `apiBaseUrl` (optional): The base URL of the analytics service. Defaults to `"https://analytics.bitsofgood.org"`.

### Methods

#### `authenticate(serverApiKey: string): Promise<void>`

Authenticates the manager with the server API key.

- `serverApiKey`: The server API key.

##### Example

```javascript
await gdprManager.authenticate('your-server-api-key');
```

#### `deleteClickEventsForUser(userId: string): Promise<null | ClickEvent[]>`

Deletes all click events for a given user.

- `userId`: The ID of the user.

##### Example

```javascript
const deletedClickEvents = await gdprManager.deleteClickEventsForUser('user123');
```

#### `deleteVisitEventsForUser(userId: string): Promise<null | VisitEvent[]>`

Deletes all visit events for a given user.

- `userId`: The ID of the user.

##### Example

```javascript
const deletedVisitEvents = await gdprManager.deleteVisitEventsForUser('user123');
```

#### `deleteInputEventsForUser(userId: string): Promise<null | InputEvent[]>`

Deletes all input events for a given user.

- `userId`: The ID of the user.

##### Example

```javascript
const deletedInputEvents = await gdprManager.deleteInputEventsForUser('user123');
```

#### `deleteCustomEventsForUser({ userId, userAttribute, category, subcategory }: { userId: string, userAttribute: string, category: string, subcategory: string }): Promise<null | CustomEvent[]>`

Deletes all custom events for a given user.

- `userId`: The ID of the user.
- `userAttribute`: The user attribute associated with the custom events.
- `category`: The category of the custom events.
- `subcategory`: The subcategory of the custom events.

##### Example

```javascript
const deletedCustomEvents = await gdprManager.deleteCustomEventsForUser({ userId: 'user123', userAttribute: 'userAttr', category: 'user', subcategory: 'signup' });
```

#### `getUserClickEventsPaginated(queryParams: GetUserEventsQueryParams): Promise<{ events: ClickEvent[], afterId: string } | null>`

Retrieves a paginated list of click events for a given user.

- `queryParams`: An object containing query parameters for filtering and paginating the events.

##### Example

```javascript
const queryParams = {
  userId: 'user123',
  afterId: 'event456',
  limit: 100,
};
const clickEvents = await gdprManager.getUserClickEventsPaginated(queryParams);
```

#### `getAllUserClickEvents(userId: string): Promise<null | ClickEvent[]>`

Retrieves all click events for a given user.

- `userId`: The ID of the user.

##### Example

```javascript
const allClickEvents = await gdprManager.getAllUserClickEvents('user123');
```

#### `getUserVisitEventsPaginated(queryParams: GetUserEventsQueryParams): Promise<{ events: VisitEvent[], afterId: string } | null>`

Retrieves a paginated list of visit events for a given user.

- `queryParams`: An object containing query parameters for filtering and paginating the events.

##### Example

```javascript
const queryParams = {
  userId: 'user123',
  afterId: 'event456',
  limit: 100,
};
const visitEvents = await gdprManager.getUserVisitEventsPaginated(queryParams);
```

#### `getAllUserVisitEvents(userId: string): Promise<null | VisitEvent[]>`

Retrieves all visit events for a given user.

- `userId`: The ID of the user.

##### Example

```javascript
const allVisitEvents = await gdprManager.getAllUserVisitEvents('user123');
```

#### `getUserInputEventsPaginated(queryParams: GetUserEventsQueryParams): Promise<{ events: InputEvent[], afterId: string } | null>`

Retrieves a paginated list of input events for a given user.

- `queryParams`: An object containing query parameters for filtering and paginating the events.

##### Example

```javascript
const queryParams = {
  userId: 'user123',
  afterId: 'event456',
  limit: 100,
};
const inputEvents = await gdprManager.getUserInputEventsPaginated(queryParams);
```

#### `getAllUserInputEvents(userId: string): Promise<null | InputEvent[]>`

Retrieves all input events for a given user.

- `userId`: The ID of the user.

##### Example

```javascript
const allInputEvents = await gdprManager.getAllUserInputEvents('user123');
```

#### `getUserCustomEventsPaginated(queryParams: GetUserCustomEventsQueryParams): Promise<{ events: CustomEvent[], afterId: string } | null>`

Retrieves a paginated list of custom events for a given user.

- `queryParams`: An object containing query parameters for filtering and paginating the events.

##### Example

```javascript
const queryParams = {
  userId: 'user123',
  userAttribute: 'userAttr',
  category: 'user',
  subcategory: 'signup',
  afterId: 'event456',
  limit: 100,
};
const customEvents = await gdprManager.getUserCustomEventsPaginated(queryParams);
```

#### `getAllUserCustomEvents({ userId, userAttribute, category, subcategory }: { userId: string, userAttribute: string, category: string, subcategory: string }): Promise<null | CustomEvent[]>`

Retrieves all custom events for a given user.

- `userId`: The ID of the user.
- `userAttribute`: The user attribute associated with the custom events.
- `category`: The category of the custom events.
- `subcategory`: The subcategory of the custom events.

##### Example

```javascript
const allCustomEvents = await gdprManager.getAllUserCustomEvents({ userId: 'user123', userAttribute: 'userAttr', category: 'user', subcategory: 'signup' });
```

#### `updateUserClickEvent({ eventId, userId, objectId }: { eventId: string, userId: string, objectId: string }): Promise<null | ClickEvent>`

Updates a click event for a given user.

- `eventId`: The ID of the event.
- `userId`: The ID of the user.
- `objectId`: The ID of the object associated with the event.

##### Example

```javascript
const updatedClickEvent = await gdprManager.updateUserClickEvent({ eventId: 'event123', userId: 'user123', objectId: 'object456' });
```

#### `updateUserVisitEvent({ eventId, userId, pageUrl }: { eventId: string, userId: string, pageUrl: string }): Promise<null | VisitEvent>`

Updates a visit event for a given user.

- `eventId`: The ID of the event.
- `userId`: The ID of the user.
- `pageUrl`: The URL of the page associated with the event.

##### Example

```javascript
const updatedVisitEvent = await gdprManager.updateUserVisitEvent({ eventId: 'event123', userId: 'user123', pageUrl: 'https://example.com/page' });
```

#### `updateUserInputEvent({ eventId, userId, objectId, textValue }: { eventId: string, userId: string, objectId?: string, textValue?: string }): Promise<null | InputEvent>`

Updates an input event for a given user.

- `eventId`: The ID of the event.
- `userId`: The ID of the user.
- `objectId` (optional): The ID of the object associated with the event.
- `textValue` (optional): The text value associated with the event.

##### Example

```javascript
const updatedInputEvent = await gdprManager.updateUserInputEvent({ eventId: 'event123', userId: 'user123', objectId: 'object456', textValue: 'new text' });
```

#### `updateUserCustomEvent({ eventId, userId, userAttribute, updatedAttributes }: { eventId: string, userId: string, userAttribute: string, updatedAttributes: object }): Promise<null | CustomEvent>`

Updates a custom event for a given user.

- `eventId`: The ID of the event.
- `userId`: The ID of the user.
- `userAttribute`: The user attribute associated with the event.
- `updatedAttributes`: The updated attributes for the custom event.

##### Example

```javascript
const updatedCustomEvent = await gdprManager.updateUserCustomEvent({ eventId: 'event123', userId: 'user123', userAttribute: 'userAttr', updatedAttributes: { key: 'value' } });
```
