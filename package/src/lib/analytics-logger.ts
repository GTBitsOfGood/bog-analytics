import { createClickEvent } from "@/actions/click-event";
import { logMessage } from "@/actions/logs";
import { ClickEvent } from "@/utils/types";

// Class to be used client side
export default class AnalyticsLogger {
    private clientApiKey?: string;

    public async authenticate(clientApiKey: string): Promise<void> {
        this.clientApiKey = clientApiKey
    }

    public async logClickEvent(objectId: string, userId: string): Promise<ClickEvent | null> {
        try {
            if (!this.clientApiKey) {
                throw new Error('Please authenticate first with your client api key using the authenticate method');
            }

            // Client side API Key
            const event = await createClickEvent(this.clientApiKey, objectId, userId);
            return event;

        } catch {
            await logMessage(`
                Error: an error occurred when registering a click event\n\`\`\`- Project Client API Key: ${this.clientApiKey}\n- Object Id: ${objectId}\n- User Id: ${userId}\`\`\`
            `)
            return null
        }
    }

    public logVisitEvent(objectId: string, userId: string): void {
        if (!this.clientApiKey) {
            throw new Error('Please authenticate first using the authenticate method');
        }

        // Perform click logging logic with clientApiKey, objectId, userId
        console.log(`Click logged for objectId: ${objectId} by userId: ${userId}`);
    }

    public logInputEvent(objectId: string, userId: string): void {
        if (!this.clientApiKey) {
            throw new Error('Please authenticate first using the authenticate method');
        }

        // Perform click logging logic with clientApiKey, objectId, userId
        console.log(`Click logged for objectId: ${objectId} by userId: ${userId}`);
    }


}
