import { externalRequest } from "@/utils/requests"
import { HttpMethod } from "@/utils/types"
import { urls } from "@/utils/urls"
import { generatePortalToken } from "./Auth"
import { EventEnvironment } from "bog-analytics"

export const getCustomEventCount = async (category: string, subcategory: string, afterDate: Date, environment: EventEnvironment, projectId: string) => {
    return externalRequest<number>({
        url: urls.analyticsUrl + urls.analyticsApi.customEvents.count,
        method: HttpMethod.GET,
        queryParams: {
            category, subcategory, afterDate: afterDate.toString(), projectId, environment
        },
        portalToken: generatePortalToken(),
    })
}
