import { externalRequest } from "@/utils/requests"
import { HttpMethod, Project } from "@/utils/types"
import { urls } from "@/utils/urls"
import { generatePortalToken } from "server/mongodb/actions/Auth"

export const createProject = async (projectName: string) => {
    return externalRequest<Project>({
        url: urls.analyticsUrl + urls.analyticsApi.project,
        method: HttpMethod.POST,
        portalToken: generatePortalToken(),
        body: {
            projectName
        }
    })
}

export const getProjects = async () => {
    return externalRequest<Project[]>({
        url: urls.analyticsUrl + urls.analyticsApi.project,
        method: HttpMethod.GET,
        portalToken: generatePortalToken(),
    })
}

export const deleteProject = async (projectName: string) => {
    return externalRequest<Project>({
        url: urls.analyticsUrl + urls.analyticsApi.project,
        method: HttpMethod.DELETE,
        portalToken: generatePortalToken(),
        body: {
            projectName
        }
    })
}