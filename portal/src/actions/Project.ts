import { internalRequest } from "@/utils/requests"
import { HttpMethod, Project } from "@/utils/types"
import { urls } from "@/utils/urls"

export const getProjects = () => {
    return internalRequest<Project[]>({
        url: urls.baseUrl + urls.api.project,
        method: HttpMethod.GET,
    })
}

export const createProject = (projectName: string) => {
    return internalRequest<Project>({
        url: urls.baseUrl + urls.api.project,
        method: HttpMethod.POST,
        body: {
            projectName
        }
    })
}

export const deleteProject = (projectName: string) => {
    return internalRequest<Project>({
        url: urls.baseUrl + urls.api.project,
        method: HttpMethod.DELETE,
        body: {
            projectName
        }
    })
}