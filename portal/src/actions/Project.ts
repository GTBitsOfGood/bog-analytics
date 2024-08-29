import { internalRequest } from "@/utils/requests"
import { HttpMethod } from "@/utils/types"
import { Project } from "bog-analytics"
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

export const updateProjectSettings = (projectName: string, privateData?: boolean, deletionPolicy?: number) => {
    return internalRequest<Project>({
        url: urls.baseUrl + urls.api.projectSettings,
        method: HttpMethod.PATCH,
        body: {
            projectName,
            deletionPolicy,
            privateData
        }
    })
}

export const getProjectSettings = (projectName: string) => {
    return internalRequest<Project>({
        url: urls.baseUrl + urls.api.projectSettings,
        method: HttpMethod.GET,
        queryParams: {
            projectName,
        }
    })
}