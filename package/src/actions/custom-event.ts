import { externalRequest } from "@/utils/requests"
import { CustomEvent, EventEnvironment, HttpMethod } from "@/utils/types";
import { urls } from "@/utils/urls"

const customEventUrl = urls.apiBaseUrl + urls.events.customEvent;
export const createCustomEvent = async (apiKey: string, eventTypeId: string, properties: object, environment: EventEnvironment): Promise<CustomEvent> => {
    return externalRequest<CustomEvent>({
        url: customEventUrl,
        method: HttpMethod.POST,
        clientApiKey: apiKey,
        body: {
            eventTypeId,
            properties,
            environment
        }
    })
}