import { logMessage } from "@/actions/logs";
import { urls } from "@/utils/urls";
import { HttpMethod } from "@/utils/types";
import { externalRequest } from "@/utils/requests";
import { createCustomEventType } from "@/actions/custom-event-type";
import { createCustomGraphType } from "@/actions/custom-graph-event";

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

    public async defineCustomEvent(category: string, subcategory: string, properties: string) {
        try {
            if (!this.serverApiKey) {
                throw new Error('Please authenticate with your server api key first using the authenticate method');
            }
            const event = await createCustomEventType(this.serverApiKey, category, subcategory, properties);
            return event;
            
        } catch {
            await logMessage(`
                Error: an error occurred when defining a custom event\n\`\`\`- Project Server API Key: ${this.serverApiKey}\n\`\`\`
            `)
            return null
        }
    }
    
    public async defineCustomGraph(eventTypeId: string, xProperty: string, yProperty: string, graphType: string) {
        try {
            if (!this.serverApiKey) {
                throw new Error('Please authenticate with your server api key first using the authenticate method');
            }
            const event = await createCustomGraphType(this.serverApiKey, eventTypeId, xProperty, yProperty, graphType);
            return event;

        } catch {
            await logMessage(`
                Error: an error occurred when defining a custom event\n\`\`\`- Project Server API Key: ${this.serverApiKey}\n\`\`\`
            `)
            return null
        }
    }


}
