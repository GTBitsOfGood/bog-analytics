import { externalRequest } from "@/utils/requests"
import { InputEvent, HttpMethod, EventEnvironment, GetEventsQueryParams } from "@/utils/types";
import { urls } from "@/utils/urls"

export const createInputEvent = async (apiBaseUrl: string, apiKey: string, objectId: string, userId: string, textValue: string, environment: EventEnvironment): Promise<InputEvent> => {
    return externalRequest<InputEvent>({
        url: apiBaseUrl + urls.events.inputEvent,
        method: HttpMethod.POST,
        clientApiKey: apiKey,
        body: {
            objectId,
            userId,
            textValue,
            environment
        }
    })
}

export const getPaginatedInputEvents = async (apiBaseUrl: string, getEventParams: GetEventsQueryParams, serverApiKey?: string) => {
    return externalRequest<{ events: InputEvent[], afterId: string }>({
        url: apiBaseUrl + urls.events.inputEvent,
        method: HttpMethod.GET,
        serverApiKey: serverApiKey,
        queryParams: {
            ...getEventParams
        }
    })
}