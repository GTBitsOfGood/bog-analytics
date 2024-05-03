## AnalyticsViewer

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

#### `getClickEventsPaginated(queryParams: GetEventsQueryParams): Promise<PaginatedResult<ClickEvent> | null>`

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

#### `getVisitEventsPaginated(queryParams: GetEventsQueryParams): Promise<PaginatedResult<VisitEvent> | null>`

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

#### `getInputEventsPaginated(queryParams: GetEventsQueryParams): Promise<PaginatedResult<InputEvent> | null>`

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

#### `getCustomEventsPaginated(queryParams: GetCustomEventsQueryParams): Promise<PaginatedResult<CustomEvent> | null>`

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