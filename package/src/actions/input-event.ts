import { externalRequest } from "@/utils/requests"
import { InputEvent, HttpMethod, EventEnvironment } from "@/utils/types";
import { urls } from "@/utils/urls"

const inputEventUrl = urls.apiBaseUrl + urls.events.inputEvent;
export const createInputEvent = async (apiKey: string, objectId: string, userId: string, textValue: string, environment: EventEnvironment): Promise<InputEvent> => {
    return externalRequest<InputEvent>({
        url: inputEventUrl,
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