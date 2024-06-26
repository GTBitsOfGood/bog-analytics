import { internalRequest } from "@/utils/requests"
import { HttpMethod } from "@/utils/types"
import { urls } from "@/utils/urls"
import { CustomEventType } from "bog-analytics"

export const getCustomEventTypesByProject = (projectId: string) => {
    return internalRequest<CustomEventType[]>({
        url: urls.baseUrl + urls.api.customEventTypes,
        method: HttpMethod.GET,
        queryParams: {
            projectId
        }
    })

}

export const createCustomEventType = (projectId: string, category: string, subcategory: string, properties: string[]) => {
    return internalRequest<CustomEventType[]>({
        url: urls.baseUrl + urls.api.customEventTypes,
        method: HttpMethod.POST,
        body: {
            projectId,
            category, subcategory, properties
        }
    })

}


export const deleteCustomEventType = (projectId: string, category: string, subcategory: string) => {
    return internalRequest<CustomEventType[]>({
        url: urls.baseUrl + urls.api.customEventTypes,
        method: HttpMethod.DELETE,
        body: {
            projectId,
            category, subcategory
        }
    })

}