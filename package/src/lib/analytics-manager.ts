import { logMessage } from "@/actions/logs";


// Class to be used server side
export default class AnalyticsManager {
    private serverApiKey?: string;

    constructor() {
        if (isBrowser()) {
            throw new Error("Analytics manager cannot be used client side!")
        }
    }

    public async authenticate(serverApiKey: string): Promise<void> {
        this.serverApiKey = serverApiKey
    }

    public async defineCustomEvent() {
        try {
            if (!this.serverApiKey) {
                throw new Error('Please authenticate with your server api key first using the authenticate method');
            }

        } catch {
            await logMessage(`
                Error: an error occurred when defining a custom event\n\`\`\`- Project Server API Key: ${this.serverApiKey}\n\`\`\`
            `)
            return null
        }
    }

    public async defineCustomGraph() {
        try {
            if (!this.serverApiKey) {
                throw new Error('Please authenticate with your server api key first using the authenticate method');
            }

        } catch {
            await logMessage(`
                Error: an error occurred when defining a custom event\n\`\`\`- Project Server API Key: ${this.serverApiKey}\n\`\`\`
            `)
            return null
        }
    }


}
