import { externalRequest } from "@/utils/requests"
import { InputEvent, HttpMethod } from "@/utils/types";
import { urls } from "@/utils/urls"

const inputEventUrl = urls.apiBaseUrl + urls.events.inputEvent;
export const createInputEvent = async (apiKey: string, objectId: string, userId: string, textValue: string): Promise<InputEvent> => {
    return externalRequest<InputEvent>({
        url: inputEventUrl,
        method: HttpMethod.POST,
        clientApiKey: apiKey,
        body: {
            objectId,
            userId,
            textValue
        }
    })
}