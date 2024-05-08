import { internalRequest } from "@/utils/requests";
import { HttpMethod, Role } from "@/utils/types";
import { urls } from "@/utils/urls";

const signUpUrl = urls.baseUrl + urls.api.auth.signup;
const signInUrl = urls.baseUrl + urls.api.auth.signin;
const signOutUrl = urls.baseUrl + urls.api.auth.signout;
const sessionUrl = urls.baseUrl + urls.api.auth.session;
const userIdUrl = urls.baseUrl + urls.api.auth.userId;
const rolesUrl = urls.baseUrl + urls.api.auth.roles;
const verifiedUrl = urls.baseUrl + urls.api.auth.verified;

export const createAccount = async (
    email: string,
    password: string,
) => {
    return internalRequest<string>({
        url: signUpUrl,
        method: HttpMethod.POST,
        body: {
            email,
            password,
        },
    });
};

export const loginToAccount = async (
    email: string,
    password: string,
) => {
    return internalRequest<string>({
        url: signInUrl,
        method: HttpMethod.POST,
        body: {
            email,
            password,
        },
    });
};

export const signOutFromAccount = async () => {
    return internalRequest({
        url: signOutUrl,
        method: HttpMethod.POST,
    });
};

export const getSession = async () => {
    return internalRequest<boolean>({
        url: sessionUrl,
        method: HttpMethod.GET,
    });
};

export const getUserId = async () => {
    return internalRequest<string | null>({
        url: userIdUrl,
        method: HttpMethod.GET,
    });

}

export const getVerificationStatus = async () => {
    return internalRequest<boolean | null>({
        url: verifiedUrl,
        method: HttpMethod.GET,
    });

}



export const getRoles = async () => {
    return internalRequest<Role[]>({
        url: rolesUrl,
        method: HttpMethod.GET,
    })
}