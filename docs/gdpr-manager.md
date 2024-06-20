## GDPRManager

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

#### `deleteCustomEventsForUser(userId: string, userAttribute: string, eventCategory: string, eventSubcategory: string): Promise<null | CustomEvent[]>`

Deletes all custom events for a given user.

- `userId`: The ID of the user.
- `userAttribute`: The user attribute associated with the custom events.
- `eventCategory`: The category of the custom events.
- `eventSubcategory`: The subcategory of the custom events.

##### Example

```javascript
const deletedCustomEvents = await gdprManager.deleteCustomEventsForUser('user123', 'userAttr', 'user', 'signup');
```

#### `getUserClickEventsPaginated(queryParams: GetUserEventsQueryParams): Promise<null | PaginatedResult<ClickEvent>>`

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

#### `getUserVisitEventsPaginated(queryParams: GetUserEventsQueryParams): Promise<null | PaginatedResult<VisitEvent>>`

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

#### `getUserInputEventsPaginated(queryParams: GetUserEventsQueryParams): Promise<null | PaginatedResult<InputEvent>>`

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

#### `getUserCustomEventsPaginated(afterId: string, userId: string, userAttribute: string, eventCategory: string, eventSubcategory: string): Promise<null | PaginatedResult<CustomEvent>>`

Retrieves a paginated list of custom events for a given user.

- `afterId`: The ID of the event to start after.
- `userId`: The ID of the user.
- `userAttribute`: The user attribute associated with the custom events.
- `eventCategory`: The category of the custom events.
- `eventSubcategory`: The subcategory of the custom events.

##### Example

```javascript
const customEvents = await gdprManager.getUserCustomEventsPaginated('event456', 'user123', 'userAttr', 'user', 'signup');
```

#### `getAllUserCustomEvents(userId: string, userAttribute: string, eventCategory: string, eventSubcategory: string): Promise<null | CustomEvent[]>`

Retrieves all custom events for a given user.

- `userId`: The ID of the user.
- `userAttribute`: The user attribute associated with the custom events.
- `eventCategory`: The category of the custom events.
- `eventSubcategory`: The subcategory of the custom events.

##### Example

```javascript
const allCustomEvents = await gdprManager.getAllUserCustomEvents('user123', 'userAttr', 'user', 'signup');
```

#### `updateUserClickEvent(eventId: string, userId: string, objectId: string): Promise<null | ClickEvent>`

Updates a click event for a given user.

- `eventId`: The ID of the event.
- `userId`: The ID of the user.
- `objectId`: The ID of the object associated with the event.

##### Example

```javascript
const updatedClickEvent = await gdprManager.updateUserClickEvent('event123', 'user123', 'object456');
```

#### `updateUserVisitEvent(eventId: string, userId: string, pageUrl: string): Promise<null | VisitEvent>`

Updates a visit event for a given user.

- `eventId`: The ID of the event.
- `userId`: The ID of the user.
- `pageUrl`: The URL of the page associated with the event.

##### Example

```javascript
const updatedVisitEvent = await gdprManager.updateUserVisitEvent('event123', 'user123', 'https://example.com/page');
```

#### `updateUserInputEvent(eventId: string, userId: string, objectId?: string, textValue?: string): Promise<null | InputEvent>`

Updates an input event for a given user.

- `eventId`: The ID of the event.
- `userId`: The ID of the user.
- `objectId` (optional): The ID of the object associated with the event.
- `textValue` (optional): The text value associated with the event.

##### Example

```javascript
const updatedInputEvent = await gdprManager.updateUserInputEvent('event123', 'user123', 'object456', 'new text');
```

#### `updateUserCustomEvent(eventId: string, userId: string, userAttribute: string, updatedAttributes: object): Promise<null | CustomEvent>`

Updates a custom event for a given user.

- `eventId`: The ID of the event.
- `userId`: The ID of the user.
- `userAttribute`: The user attribute associated with the custom event.
- `updatedAttributes`: An object containing the updated attributes for the event.

##### Example

```javascript
const updatedCustomEvent = await gdprManager.updateUserCustomEvent('event123', 'user123', 'userAttr', { key: 'new value' });
```