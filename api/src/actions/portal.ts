import { externalRequest } from "@/src/utils/requests"
import { urls } from "@/src/utils/urls"
import { HttpMethod } from "../utils/types"

export const validatePortalToken = async (portalToken: string) => {
    return externalRequest<boolean>({
        url: urls.portalUrl + urls.validate.token,
        method: HttpMethod.POST,
        body: {
            portalToken
        }
    })
}