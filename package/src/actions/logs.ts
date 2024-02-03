import { externalRequest } from "@/utils/requests"
import { ClickEvent, HttpMethod } from "@/utils/types";
import { urls } from "@/utils/urls"

const logUrl = urls.loggerBaseUrl + urls.logMessage;
export const logMessage = async (message: string): Promise<void> => {
    try {
        return externalRequest({
            url: logUrl,
            method: HttpMethod.POST,
            body: {
                message
            }
        })

    } catch {
        console.log(message)
    }
}