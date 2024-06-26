function getBaseUrl() {
    return process.env.NODE_ENV === "production" ? "https://analytics.bitsofgood.org" : "http://127.0.0.1:3001"
}

export const urls = {
    apiBaseUrl: getBaseUrl(),
    loggerBaseUrl: "https://bit-bot-five.vercel.app",
    logMessage: "/bog/analytics-log",
    auth: "/api/auth",
    project: "/api/project",
    events: {
        clickEvent: "/api/events/click-event",
        visitEvent: "/api/events/visit-event",
        inputEvent: "/api/events/input-event",
        customEvent: "/api/events/custom-event",
        customEventType: "/api/events/custom-event-type",
        customGraphType: "/api/graphs/custom-graph-type"
    },
    gdpr: {
        clickEvent: "/api/gdpr/click-event",
        visitEvent: "/api/gdpr/visit-event",
        inputEvent: "/api/gdpr/input-event",
        customEvent: "/api/gdpr/custom-event",
    }
}