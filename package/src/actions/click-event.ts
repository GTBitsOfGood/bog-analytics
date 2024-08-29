import { externalRequest } from "@/utils/requests"
import { ClickEvent, EventEnvironment, GetEventsQueryParams, HttpMethod } from "@/utils/types";
import { urls } from "@/utils/urls"

export const createClickEvent = async (apiBaseUrl: string, apiKey: string, objectId: string, userId: string, environment: EventEnvironment): Promise<ClickEvent> => {
    return externalRequest<ClickEvent>({
        url: apiBaseUrl + urls.events.clickEvent,
        method: HttpMethod.POST,
        clientApiKey: apiKey,
        body: {
            objectId,
            userId,
            environment
        }
    })
}

export const getPaginatedClickEvents = async (apiBaseUrl: string, getEventParams: GetEventsQueryParams, serverApiKey?: string) => {
    return externalRequest<{ events: ClickEvent[], afterId: string }>({
        url: apiBaseUrl + urls.events.clickEvent,
        serverApiKey: serverApiKey,
        method: HttpMethod.GET,
        queryParams: {
            ...getEventParams
        }
    })
}