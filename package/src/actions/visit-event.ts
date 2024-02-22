import { externalRequest } from "@/utils/requests"
import { VisitEvent, HttpMethod } from "@/utils/types";
import { urls } from "@/utils/urls"

const visitEventUrl = urls.apiBaseUrl + urls.events.visitEvent;
export const createVisitEvent = async (apiKey: string, pageUrl: string, userId: string, date: Date): Promise<VisitEvent> => {
    return externalRequest<VisitEvent>({
        url: visitEventUrl,
        method: HttpMethod.POST,
        clientApiKey: apiKey,
        body: {
            pageUrl,
            userId,
            date
        }
    })
}