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
    private apiBaseUrl?: string; // used for unittesting puposes
    private disabled?: boolean;

    constructor({ apiBaseUrl, environment, disabled }: { apiBaseUrl?: string, environment?: EventEnvironment, disabled?: boolean }) {
        this.apiBaseUrl = apiBaseUrl ?? "https://analytics.bitsofgood.org"
        this.environment = environment ?? EventEnvironment.DEVELOPMENT;
        this.disabled = disabled ?? false;
    }
    public async authenticate(clientApiKey: string): Promise<void> {
        this.clientApiKey = clientApiKey;
    }

    public disable() {
        this.disabled = true;
    }

    public enable() {
        this.disabled = false;
    }


    public async logClickEvent(clickEvent: ClickEventProperties): Promise<ClickEvent | null> {
        if (this.disabled) {
            return null;
        }
        const { objectId, userId } = clickEvent;

        try {
            if (!this.clientApiKey) {
                throw new Error('Please authenticate first with your client api key using the authenticate method');
            }

            if (!objectId || !userId) {
                throw new Error('Please specify an objectId and userId')
            }

            // Client side API Key
            const event = await createClickEvent(this.apiBaseUrl as string, this.clientApiKey, objectId as string, userId as string, this.environment as EventEnvironment);
            return event;

        } catch {
            await logMessage(formatErrorMessage(
                "an error occurred when registering an click event",
                {
                    clientApiKey: this.clientApiKey as string,
                    objectId: objectId as string,
                    userId: userId as string,
                }
            ))
            return null
        }
    }

    public async logVisitEvent(visitEvent: VisitEventProperties): Promise<VisitEvent | null> {
        if (this.disabled) {
            return null;
        }
        const { pageUrl, userId } = visitEvent;
        try {
            if (!this.clientApiKey) {
                throw new Error('Please authenticate first with your client api key using the authenticate method');
            }

            if (!pageUrl || !userId) {
                throw new Error('Please specify a userId and pageUrl')
            }


            // Client side API Key
            const event = await createVisitEvent(this.apiBaseUrl as string, this.clientApiKey, pageUrl as string, userId as string, this.environment as EventEnvironment);
            return event;

        } catch {
            await logMessage(formatErrorMessage(
                "an error occurred when registering an visit event",
                {
                    clientApiKey: this.clientApiKey as string,
                    pageUrl: pageUrl as string,
                    userId: userId as string
                }
            ))
            return null
        }
    }

    public async logInputEvent(inputEvent: InputEventProperties): Promise<InputEvent | null> {
        if (this.disabled) {
            return null;
        }
        const { objectId, userId, textValue } = inputEvent;

        try {
            if (!this.clientApiKey) {
                throw new Error('Please authenticate first using the authenticate method');
            }

            if (!objectId || !userId || !textValue) {
                throw new Error('Please specify an objectId, userId, and textValue')
            }

            // Client side API Key
            const event = await createInputEvent(this.apiBaseUrl as string, this.clientApiKey, objectId as string, userId as string, textValue as string, this.environment as EventEnvironment);
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

    public async logCustomEvent(category: string, subcategory: string, properties: object): Promise<CustomEvent | null> {
        if (this.disabled) {
            return null;
        }
        try {
            if (!this.clientApiKey) {
                throw new Error('Please authenticate first with your client api key using the authenticate method');
            }

            if (!properties) {
                throw new Error('Please specify properties')
            }

            // Client side API Key
            const event = await createCustomEvent(this.apiBaseUrl as string, this.clientApiKey, category as string, subcategory as string, properties as object, this.environment as EventEnvironment);
            return event;
        } catch {
            await logMessage(formatErrorMessage(
                "an error occurred when registering this custom event",
                {
                    clientApiKey: this.clientApiKey as string,
                    category,
                    subcategory,
                    ...properties
                }
            ))
            return null
        }
    }
}
