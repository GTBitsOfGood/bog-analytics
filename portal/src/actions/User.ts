import { internalRequest } from "@/utils/requests"
import { HttpMethod, InternalUser } from "@/utils/types"
import { urls } from "@/utils/urls"

export const getUsers = () => {
    return internalRequest<InternalUser[]>({
        url: urls.baseUrl + urls.api.users,
        method: HttpMethod.GET,
    })
}

export const verifyUser = (email: string) => {
    return internalRequest<InternalUser>({
        url: urls.baseUrl + urls.api.auth.users.verify,
        method: HttpMethod.POST,
        body: {
            email
        }
    })
}

export const unverifyUser = (email: string) => {
    return internalRequest<InternalUser>({
        url: urls.baseUrl + urls.api.auth.users.unverify,
        method: HttpMethod.POST,
        body: {
            email
        }
    })
}

export const promoteUser = (email: string) => {
    return internalRequest<InternalUser>({
        url: urls.baseUrl + urls.api.auth.users.promote,
        method: HttpMethod.POST,
        body: {
            email
        }
    })
}

export const demoteUser = (email: string) => {
    return internalRequest<InternalUser>({
        url: urls.baseUrl + urls.api.auth.users.demote,
        method: HttpMethod.POST,
        body: {
            email
        }
    })
}

export const deleteUser = (email: string) => {
    return internalRequest<InternalUser>({
        url: urls.baseUrl + urls.api.auth.users.delete,
        method: HttpMethod.DELETE,
        body: {
            email
        }
    })
}


