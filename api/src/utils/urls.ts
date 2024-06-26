function getPortalUrl() {
    return process.env.DEPLOY_CONTEXT === "production" ? "https://portal.analytics.bitsofgood.org" : "http://localhost:3000"
}

export const urls = {
    portalUrl: getPortalUrl(),
    validate: {
        token: "/api/auth/validate-token"
    }
}