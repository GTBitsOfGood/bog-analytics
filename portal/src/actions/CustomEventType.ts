import { internalRequest } from "@/utils/requests"
import { HttpMethod, CustomEventType } from "@/utils/types"
import { urls } from "@/utils/urls"

export const getCustomEventTypesByProject = (projectId: string) => {
    return internalRequest<CustomEventType[]>({
        url: urls.baseUrl + urls.api.customEventTypes,
        method: HttpMethod.GET,
        queryParams: {
            projectId
        }
    })

}