import { externalRequest } from "@/utils/requests"
import { CustomEventType, HttpMethod } from "@/utils/types";
import { urls } from "@/utils/urls"

const customEventTypeUrl = urls.apiBaseUrl + urls.events.customEventType;
export const createCustomEventType = async (apiKey: string, category: string, subcategory: string, properties: string[]): Promise<CustomEventType> => {
    return externalRequest<CustomEventType>({
        url: customEventTypeUrl,
        method: HttpMethod.POST,
        serverApiKey: apiKey,
        body: {
            category,
            subcategory,
            properties
        }
    })
}

export const getCustomEventTypes = async (projectName: string): Promise<CustomEventType[]> => {
    return externalRequest<CustomEventType[]>({
        url: customEventTypeUrl,
        method: HttpMethod.GET,
        queryParams: {
            projectName
        }
    })
}