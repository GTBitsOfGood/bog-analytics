import { externalRequest } from "@/utils/requests"
import { VisitEvent, HttpMethod, EventEnvironment, GetEventsQueryParams } from "@/utils/types";
import { urls } from "@/utils/urls"

export const createVisitEvent = async (apiBaseUrl: string, apiKey: string, pageUrl: string, userId: string, environment: EventEnvironment): Promise<VisitEvent> => {
    return externalRequest<VisitEvent>({
        url: apiBaseUrl + urls.events.visitEvent,
        method: HttpMethod.POST,
        clientApiKey: apiKey,
        body: {
            pageUrl,
            userId,
            environment
        }
    })
}

export const getPaginatedVisitEvents = async (apiBaseUrl: string, getEventParams: GetEventsQueryParams, serverApiKey?: string) => {
    return externalRequest<{ events: VisitEvent[], afterId: string }>({
        url: apiBaseUrl + urls.events.visitEvent,
        serverApiKey: serverApiKey,
        method: HttpMethod.GET,
        queryParams: {
            ...getEventParams
        }
    })
}