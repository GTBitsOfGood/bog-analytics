import { externalRequest } from "@/utils/requests"
import { HttpMethod } from "@/utils/types"
import { Project } from "bog-analytics"
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

export const getProject = async (projectId: string) => {
    return externalRequest<Project>({
        url: urls.analyticsUrl + urls.analyticsApi.project,
        method: HttpMethod.GET,
        portalToken: generatePortalToken(),
        queryParams: {
            projectId
        }
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

export const updateProject = async (projectName: string, privateData?: boolean, deletionPolicy?: number) => {
    return externalRequest<Project>({
        url: urls.analyticsUrl + urls.analyticsApi.project,
        method: HttpMethod.PATCH,
        portalToken: generatePortalToken(),
        body: {
            projectName,
            privateData,
            deletionPolicy
        }
    })
}