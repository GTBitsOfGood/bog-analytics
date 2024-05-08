import { externalRequest } from "@/utils/requests"
import { CustomEventType, HttpMethod } from "@/utils/types";
import { urls } from "@/utils/urls"

export const createCustomEventType = async (apiBaseUrl: string, apiKey: string, category: string, subcategory: string, properties: string[]): Promise<CustomEventType> => {
    return externalRequest<CustomEventType>({
        url: apiBaseUrl + urls.events.customEventType,
        method: HttpMethod.POST,
        serverApiKey: apiKey,
        body: {
            category,
            subcategory,
            properties
        }
    })
}

export const deleteCustomEventType = async (apiBaseUrl: string, apiKey: string, category: string, subcategory: string): Promise<CustomEventType> => {
    return externalRequest<CustomEventType>({
        url: apiBaseUrl + urls.events.customEventType,
        method: HttpMethod.DELETE,
        serverApiKey: apiKey,
        body: {
            category,
            subcategory,
        }
    })
}


export const getCustomEventTypes = async (apiBaseUrl: string, projectName: string): Promise<CustomEventType[]> => {
    return externalRequest<CustomEventType[]>({
        url: apiBaseUrl + urls.events.customEventType,
        method: HttpMethod.GET,
        queryParams: {
            projectName
        }
    })
}