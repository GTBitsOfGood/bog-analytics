function getBaseApiURL() {
    if (process.env.NODE_ENV === "production") {
        return `https://portal.analytics.bitsofgood.org`;
    }
    return "http://localhost:3000";
}

function getBaseAnalyticsURL() {
    if (process.env.NODE_ENV === "production") {
        return `https://analytics.bitsofgood.org`;
    }
    return "http://localhost:3001";
}

export const urls = {
    analyticsUrl: getBaseAnalyticsURL(),
    baseUrl: getBaseApiURL(),
    api: {
        auth: {
            signup: "/api/auth/sign-up",
            signin: "/api/auth/sign-in",
            signout: "/api/auth/sign-out",
            session: "/api/auth/session",
            roles: "/api/auth/roles",
            userId: "/api/auth/user-id",
            verified: "/api/auth/verified",
            users: {
                verify: "/api/auth/verification/verify",
                unverify: "/api/auth/verification/unverify",
                promote: "/api/auth/roles/promote",
                demote: "/api/auth/roles/demote",
                delete: "/api/auth/account"
            }
        },
        project: "/api/projects",
        customEventTypes: "/api/events/custom-event-type",
        users: "/api/users"
    },
    client: {
        home: "/",
        dashboard: "/dashboard",
        signIn: "/sign-in",
        signUp: "/sign-up",
        project: "/project"
    },
    analyticsApi: {
        project: "/api/portal/project"
    }
}