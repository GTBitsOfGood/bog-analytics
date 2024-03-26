import { createClickEvent } from "@/actions/click-event";
import { logMessage } from "@/actions/logs";
import { createVisitEvent } from "@/actions/visit-event";
import { formatErrorMessage } from "@/utils/error";
import { ClickEvent, VisitEvent, InputEvent, CustomEvent, ClickEventProperties, EventEnvironment, VisitEventProperties, InputEventProperties } from "@/utils/types";
import { createInputEvent } from "@/actions/input-event";
import { createCustomEvent } from "@/actions/custom-event";

// Class to be used client side
export default class AnalyticsLogger {
    private clientApiKey?: string;
    private environment?: EventEnvironment;

    public async authenticate(clientApiKey: string, envrionment?: EventEnvironment): Promise<void> {
        this.clientApiKey = clientApiKey;
        this.environment = envrionment ?? EventEnvironment.DEVELOPMENT;
    }

    public async logClickEvent(clickEvent: Partial<ClickEventProperties>): Promise<ClickEvent | null> {
        const { objectId, userId } = clickEvent;

        try {
            if (!this.clientApiKey) {
                throw new Error('Please authenticate first with your client api key using the authenticate method');
            }


            // Client side API Key
            const event = await createClickEvent(this.clientApiKey, objectId as string, userId as string, this.environment as EventEnvironment);
            return event;

        } catch {
            await logMessage(formatErrorMessage(
                "an error occurred when registering an input event",
                {
                    clientApiKey: this.clientApiKey as string,
                    objectId: objectId as string,
                    userId: userId as string,
                }
            ))
            return null
        }
    }

    public async logVisitEvent(visitEvent: Partial<VisitEventProperties>): Promise<VisitEvent | null> {
        const { pageUrl, userId } = visitEvent;
        try {
            if (!this.clientApiKey) {
                throw new Error('Please authenticate first with your client api key using the authenticate method');
            }

            // Client side API Key
            const event = await createVisitEvent(this.clientApiKey, pageUrl as string, userId as string, this.environment as EventEnvironment);
            return event;

        } catch {
            await logMessage(formatErrorMessage(
                "an error occurred when registering an input event",
                {
                    clientApiKey: this.clientApiKey as string,
                    pageUrl: pageUrl as string,
                    userId: userId as string
                }
            ))
            return null
        }
    }

    public async logInputEvent(inputEvent: Partial<InputEventProperties>): Promise<InputEvent | null> {
        const { objectId, userId, textValue } = inputEvent;

        try {
            if (!this.clientApiKey) {
                throw new Error('Please authenticate first using the authenticate method');
            }
            // Client side API Key
            const event = await createInputEvent(this.clientApiKey, objectId as string, userId as string, textValue as string, this.environment as EventEnvironment);
            return event;

        } catch {
            await logMessage(formatErrorMessage(
                "an error occurred when registering an input event",
                {
                    clientApiKey: this.clientApiKey as string,
                    objectId: objectId as string,
                    userId: userId as string,
                    textValue: textValue as string
                }
            ))
            return null
        }
    }

    public async logCustomEvent(customEvent: Partial<CustomEvent>): Promise<CustomEvent | null> {
        const { eventTypeId, properties } = customEvent;
        try {
            if (!this.clientApiKey) {
                throw new Error('Please authenticate first with your client api key using the authenticate method');
            }

            // Client side API Key
            const event = await createCustomEvent(this.clientApiKey, eventTypeId as string, properties as object, this.environment as EventEnvironment);
            return event;
        } catch {
            await logMessage(formatErrorMessage(
                "an error occurred when registering this custom event",
                {
                    clientApiKey: this.clientApiKey as string,
                    eventTypeId: eventTypeId as string,
                    ...properties
                }
            ))
            return null
        }
    }
}
