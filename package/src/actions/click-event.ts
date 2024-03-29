import { externalRequest } from "@/utils/requests"
import { ClickEvent, EventEnvironment, HttpMethod } from "@/utils/types";
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