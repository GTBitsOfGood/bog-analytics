import { createClickEvent } from "@/actions/click-event";
import { logMessage } from "@/actions/logs";
import { ClickEvent } from "@/utils/types";

// Class to be used client side
export default class AnalyticsLogger {
    private apiKey?: string;

    public async authenticate(apiKey: string): Promise<void> {
        this.apiKey = apiKey
    }

    public async logClickEvent(objectId: string, userId: string): Promise<ClickEvent | null> {
        try {
            if (!this.apiKey) {
                throw new Error('Please authenticate first using the authenticate method');
            }

            // Client side API Key
            const event = await createClickEvent(this.apiKey, objectId, userId);
            return event;

        } catch {
            await logMessage(`
                Error: an error occurred when registering a click event\n\`\`\`- Project API Key: ${this.apiKey}\n- Object Id: ${objectId}\n- User Id: ${userId}\`\`\`
            `)
            return null
        }
    }

    public logVisitEvent(objectId: string, userId: string): void {
        if (!this.apiKey) {
            throw new Error('Please authenticate first using the authenticate method');
        }

        // Perform click logging logic with apiKey, objectId, userId
        console.log(`Click logged for objectId: ${objectId} by userId: ${userId}`);
    }

    public logInputEvent(objectId: string, userId: string): void {
        if (!this.apiKey) {
            throw new Error('Please authenticate first using the authenticate method');
        }

        // Perform click logging logic with apiKey, objectId, userId
        console.log(`Click logged for objectId: ${objectId} by userId: ${userId}`);
    }


}
