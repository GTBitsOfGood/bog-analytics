import { externalRequest } from "@/utils/requests"
import { CustomGraphType, HttpMethod } from "@/utils/types";
import { urls } from "@/utils/urls"

export const customGraphTypeUrl = urls.apiBaseUrl + urls.events.customGraphType;
export const createCustomGraphType = async (apiKey: string, eventTypeId: string, xProperty: string, yProperty: string, graphType: string): Promise<CustomGraphType> => {
    return externalRequest<CustomGraphType>({
        url: customGraphTypeUrl,
        method: HttpMethod.POST,
        serverApiKey: apiKey,
        body: {
            eventTypeId,
            xProperty,
            yProperty,
            graphType
        }
    })
}

export const getCustomGraphTypes = async (projectName: string, eventTypeId: string): Promise<CustomGraphType[]> => {
    return externalRequest<CustomGraphType[]>({
        url: customGraphTypeUrl,
        method: HttpMethod.GET,
        queryParams: {
            projectName,
            eventTypeId
        }
    })
}