import { externalRequest } from "@/utils/requests"
import { ClickEvent, HttpMethod } from "@/utils/types";
import { urls } from "@/utils/urls"

const clickEventUrl = urls.apiBaseUrl + urls.events.clickEvent;
export const createClickEvent = async (apiKey: string, objectId: string, userId: string): Promise<ClickEvent> => {
    return externalRequest<ClickEvent>({
        url: clickEventUrl,
        method: HttpMethod.POST,
        clientApiKey: apiKey,
        body: {
            objectId,
            userId
        }
    })
}