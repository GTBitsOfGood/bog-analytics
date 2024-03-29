import { externalRequest } from "@/utils/requests"
import { CustomGraphType, HttpMethod } from "@/utils/types";
import { urls } from "@/utils/urls"

export const createCustomGraphType = async (apiBaseUrl: string, apiKey: string, eventTypeId: string, xProperty: string, yProperty: string, graphType: string, graphTitle: string): Promise<CustomGraphType> => {
    return externalRequest<CustomGraphType>({
        url: apiBaseUrl + urls.events.customGraphType,
        method: HttpMethod.POST,
        serverApiKey: apiKey,
        body: {
            eventTypeId,
            xProperty,
            yProperty,
            graphType,
            graphTitle
        }
    })
}

export const getCustomGraphTypes = async (apiBaseUrl: string, projectName: string, eventTypeId: string): Promise<CustomGraphType[]> => {
    return externalRequest<CustomGraphType[]>({
        url: apiBaseUrl + urls.events.customGraphType,
        method: HttpMethod.GET,
        queryParams: {
            projectName,
            eventTypeId
        }
    })
}