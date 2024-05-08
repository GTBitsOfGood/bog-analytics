import { logMessage } from "@/actions/logs";
import { createCustomEventType, deleteCustomEventType } from "@/actions/custom-event-type";
import { createCustomGraphType } from "@/actions/custom-graph-type";
import { CustomEventType, CustomGraphType } from "@/utils/types";
import { isBrowser } from "@/utils/env";
import { formatErrorMessage } from "@/utils/error";

// Class to be used server side
export default class AnalyticsManager {
    private serverApiKey?: string;
    private apiBaseUrl?: string;

    constructor({ apiBaseUrl }: { apiBaseUrl?: string }) {
        if (isBrowser()) {
            throw new Error("Analytics manager cannot be used client side!")
        }

        this.apiBaseUrl = apiBaseUrl ?? "https://analytics.bitsofgood.org"
    }

    public async authenticate(serverApiKey: string): Promise<void> {
        this.serverApiKey = serverApiKey
    }

    public async defineCustomEvent(customEventType: Partial<CustomEventType>) {
        const { category, subcategory, properties } = customEventType;
        try {
            if (!this.serverApiKey) {
                throw new Error('Please authenticate with your server api key first using the authenticate method');
            }
            const event = await createCustomEventType(this.apiBaseUrl as string, this.serverApiKey, category as string, subcategory as string, properties as string[]);
            return event;

        } catch {
            await logMessage(formatErrorMessage(`an error occurred when defining a custom event\`\`\`,`, { category, subcategory, properties }))
            return null
        }
    }

    public async deleteCustomEventType(category: string, subcategory: string) {
        try {
            if (!this.serverApiKey) {
                throw new Error('Please authenticate with your server api key first using the authenticate method');
            }
            const event = await deleteCustomEventType(this.apiBaseUrl as string, this.serverApiKey, category as string, subcategory as string);
            return event;

        } catch {
            await logMessage(formatErrorMessage(`
                an error occurred when deleting a custom event type\`\`\`
            `, { category, subcategory }))
            return null
        }
    }


    public async defineCustomGraph(customGraphType: Partial<CustomGraphType>) {
        const { eventTypeId, xProperty, yProperty, graphType, graphTitle, caption } = customGraphType;
        try {
            if (!this.serverApiKey) {
                throw new Error('Please authenticate with your server api key first using the authenticate method');
            }
            const event = await createCustomGraphType(this.apiBaseUrl as string, this.serverApiKey, eventTypeId as string, xProperty as string, yProperty as string, graphType as string, graphTitle as string, caption as string);
            return event;

        } catch {
            await logMessage(formatErrorMessage(`
                an error occurred when defining a custom event\`\`\`
            `, { eventTypeId, xProperty, yProperty, graphType, graphTitle, caption }))
            return null
        }
    }


}
