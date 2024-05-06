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
        },
        project: "/api/projects"
    },
    client: {
        home: "/",
        dashboard: "/dashboard",
        signIn: "/sign-in",
        signUp: "/sign-up"
    },
    analyticsApi: {
        project: "/api/portal/project"
    }
}