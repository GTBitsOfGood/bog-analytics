<div align="center"> 
<h1>Example Project — BoG Analytics Usage Examples</h1></div>


This example project demonstrates how to use the BoG Analytics API + npm package in a variety of common scenarios for logging events. It serves as a reference for developers at BoG looking to quickly understand and leverage BoG Analytics in their own projects. All the contents can be found in `src/app/page.tsx`

## Contents
### Setting Up the Analytics Logger

To start using `AnalyticsLogger` in your project:

#### 1. Create a new logger instance
Choose the environment you want to log to:

* EventEnvironment.DEVELOPMENT
* EventEnvironment.STAGING
* EventEnvironment.PRODUCTION

```
const analyticsLogger = new AnalyticsLogger({ environment: EventEnvironment.DEVELOPMENT }); // or STAGING / PRODUCTION
```

#### 2. Authenticate with your API key
After creating your project in the Bog Analytics Portal, you'll receive an API key. Use this key to authenticate your logger:

```
logger.authenticate("your-api-key-here");
```

#### 3. Start logging events

Once authenticated, you're ready to use any of the `AnalyticsLogger` methods, as showcased in this project.

### Log Click Events

There are three buttons on the app, each logging its own click events. At each button handler, there is a `logClickEvent()` call, which logs the event for us. An `objectID` is used to associate a click event with its source.

```
const handleButton1 = () => {
    logger.logClickEvent({
        objectId: 'button-1',
        userId: (Math.random() + 1).toString(36).substring(7), // random uuid
    })
    console.log('Button 1 pressed')
}
```

### Log Input Events

An input field is provided that logs an input event every time the user types something. On submit, there is a `logInputEvent()` call to log the input event. An `objectID` is used to associate an input event with its source.

```
const handleInputSubmit = () => {
    logger.logInputEvent({
        objectId: 'input-text-field',
        userId: (Math.random() + 1).toString(36).substring(7), // random uuid
        textValue: inputValue,
    })
    setInputValue("")
    console.log('Input Submitted')
}
```

### Log Visit Events

A visit event is automatically logged when the app loads to track page visits. `React.useEffect()` can be used to track visit events using `logVisitEvent()` on first load.

```
React.useEffect(() => {
    logger.logVisitEvent({
        userId: getBrowserName(navigator.userAgent),
        pageUrl: '/'
    });
}, [])
```

### Log Custom Events

A button is provided to represent a custom process. The package allows you to log completely custom events with arbitrary data. To do this, call `logCustomEvent()` and pass:
* `category`: The category of the custom event.
* `subcategory`: The subcategory of the custom event.
* `properties`: An object containing the properties of the custom event.

```
const handleCustomEventButton = async() => {
    await logger.logCustomEvent("custom event category", "custom event subcategory", {prop1: "properties of custom event"})
    console.log('Custom Event Button Pressed')
}
```

### Change Logging Environment

A dropdown is available to change the environment in which events are being logged to (e.g., development, production). Each environment needs it's unique `AnalyticsLogger` instance.

### Analytics Viewer

To view some recently logged events, click on the Print Logged Events button and check the logged events in the console. This function was created by using `Analytics Viewer`