import { externalRequest } from "@/utils/requests"
import { CustomEvent, EventEnvironment, GetCustomEventsQueryParams, HttpMethod } from "@/utils/types";
import { urls } from "@/utils/urls"

export const createCustomEvent = async (apiBaseUrl: string, apiKey: string, category: string, subcategory: string, properties: object, environment: EventEnvironment): Promise<CustomEvent> => {
    return externalRequest<CustomEvent>({
        url: apiBaseUrl + urls.events.customEvent,
        method: HttpMethod.POST,
        clientApiKey: apiKey,
        body: {
            properties,
            category,
            subcategory,
            environment
        }
    })
}

export const getPaginatedCustomEvents = async (apiBaseUrl: string, getEventParams: GetCustomEventsQueryParams) => {
    return externalRequest<{ events: CustomEvent[], afterId: string }>({
        url: apiBaseUrl + urls.events.customEvent,
        method: HttpMethod.GET,
        queryParams: {
            ...getEventParams
        }
    })
}