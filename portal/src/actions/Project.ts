import { externalRequest } from "@/utils/requests"
import { HttpMethod, Project } from "@/utils/types"
import { urls } from "@/utils/urls"

export const getProjects = () => {
    return externalRequest<Project[]>({
        url: urls.baseUrl + urls.api.project,
        method: HttpMethod.GET,
    })
}