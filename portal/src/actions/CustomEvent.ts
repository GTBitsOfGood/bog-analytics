import { internalRequest } from "@/utils/requests"
import { HttpMethod } from "@/utils/types"
import { urls } from "@/utils/urls"
import { EventEnvironment } from "bog-analytics"

export const getCustomEventCount = (category: string, subcategory: string, afterDate: Date, environment: EventEnvironment, projectId: string) => {
    return internalRequest<number>({
        url: urls.baseUrl + urls.api.customEvents.count,
        method: HttpMethod.GET,
        queryParams: {
            category, subcategory, afterDate: afterDate.toString(), projectId, environment
        },
    })

}