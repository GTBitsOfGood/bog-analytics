import { createClickEvent } from "@/actions/click-event";
import { logMessage } from "@/actions/logs";
import { createVisitEvent } from "@/actions/visit-event";
import { formatErrorMessage } from "@/utils/error";
import { ClickEvent, VisitEvent } from "@/utils/types";

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
            await logMessage(formatErrorMessage(
                "an error occurred when registering an input event",
                {
                    clientApiKey: this.clientApiKey as string,
                    objectId,
                    userId
                }
            ))
            return null
        }
    }

    public async logVisitEvent(pageUrl: string, userId: string, date: Date): Promise<VisitEvent | null> {
        try {
            if (!this.clientApiKey) {
                throw new Error('Please authenticate first with your client api key using the authenticate method');
            }

            // Client side API Key
            const event = await createVisitEvent(this.clientApiKey, pageUrl, userId, date);
            return event;

        } catch {
            await logMessage(formatErrorMessage(
                "an error occurred when registering an input event",
                {
                    clientApiKey: this.clientApiKey as string,
                    pageUrl,
                    userId, date: date.toString()
                }
            ))
            return null
        }
    }

    public async logInputEvent(objectId: string, userId: string): Promise<void> {
        if (!this.clientApiKey) {
            throw new Error('Please authenticate first using the authenticate method');
        }
    }

    public async logCustomEvent(): Promise<void> {

    }


}
