import { externalRequest } from "@/utils/requests"
import { CustomEvent, EventEnvironment, HttpMethod } from "@/utils/types";
import { urls } from "@/utils/urls"

export const createCustomEvent = async (apiBaseUrl: string, apiKey: string, eventTypeId: string, properties: object, environment: EventEnvironment): Promise<CustomEvent> => {
    return externalRequest<CustomEvent>({
        url: apiBaseUrl + urls.events.customEvent,
        method: HttpMethod.POST,
        clientApiKey: apiKey,
        body: {
            eventTypeId,
            properties,
            environment
        }
    })
}