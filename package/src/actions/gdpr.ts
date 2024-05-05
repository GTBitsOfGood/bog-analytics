import { externalRequest } from "@/utils/requests"
import { ClickEvent, GetUserEventsQueryParams, HttpMethod, VisitEvent } from "@/utils/types";
import { urls } from "@/utils/urls"


export const gdprDeleteClickEvents = async (apiBaseUrl: string, apiKey: string, userId: string): Promise<ClickEvent[]> => {
    return externalRequest<ClickEvent[]>({
        url: apiBaseUrl + urls.gdpr.clickEvent,
        method: HttpMethod.DELETE,
        serverApiKey: apiKey,
        body: {
            userId
        }
    })
}

export const gdprDeleteVisitEvents = async (apiBaseUrl: string, apiKey: string, userId: string): Promise<VisitEvent[]> => {
    return externalRequest<VisitEvent[]>({
        url: apiBaseUrl + urls.gdpr.visitEvent,
        method: HttpMethod.DELETE,
        serverApiKey: apiKey,
        body: {
            userId
        }
    })
}

export const gdprDeleteInputEvents = async (apiBaseUrl: string, apiKey: string, userId: string): Promise<InputEvent[]> => {
    return externalRequest<InputEvent[]>({
        url: apiBaseUrl + urls.gdpr.inputEvent,
        method: HttpMethod.DELETE,
        serverApiKey: apiKey,
        body: {
            userId
        }
    })
}

export const gdprDeleteCustomEvents = async (apiBaseUrl: string, apiKey: string, userId: string, userAttribute: string, eventCategory: string, eventSubcategory: string): Promise<CustomEvent[]> => {
    return externalRequest<CustomEvent[]>({
        url: apiBaseUrl + urls.gdpr.customEvent,
        method: HttpMethod.DELETE,
        serverApiKey: apiKey,
        body: {
            userId,
            userAttribute,
            eventCategory,
            eventSubcategory
        }
    })
}

export const gdprPaginatedUserClickEvents = async (apiBaseUrl: string, apiKey: string, getEventParams: GetUserEventsQueryParams) => {
    return externalRequest<{ events: ClickEvent[], afterId: string }>({
        url: apiBaseUrl + urls.gdpr.clickEvent,
        serverApiKey: apiKey,
        method: HttpMethod.GET,
        queryParams: {
            ...getEventParams
        }
    })
}

export const gdprPaginatedUserVisitEvents = async (apiBaseUrl: string, apiKey: string, getEventParams: GetUserEventsQueryParams) => {
    return externalRequest<{ events: VisitEvent[], afterId: string }>({
        url: apiBaseUrl + urls.gdpr.visitEvent,
        serverApiKey: apiKey,
        method: HttpMethod.GET,
        queryParams: {
            ...getEventParams
        }
    })
}

export const gdprPaginatedUserInputEvents = async (apiBaseUrl: string, apiKey: string, getEventParams: GetUserEventsQueryParams) => {
    return externalRequest<{ events: InputEvent[], afterId: string }>({
        url: apiBaseUrl + urls.gdpr.inputEvent,
        serverApiKey: apiKey,
        method: HttpMethod.GET,
        queryParams: {
            ...getEventParams
        }
    })
}

export const gdprPaginatedUserCustomEvents = async (apiBaseUrl: string, apiKey: string, afterId: string | undefined, userId: string, userAttribute: string, eventCategory: string, eventSubcategory: string) => {
    return externalRequest<{ events: CustomEvent[], afterId: string }>({
        url: apiBaseUrl + urls.gdpr.customEvent,
        serverApiKey: apiKey,
        method: HttpMethod.GET,
        queryParams: {
            afterId, userId, userAttribute, eventCategory, eventSubcategory
        }
    })
}


export const gdprUpdateClickEvent = async (apiBaseUrl: string, apiKey: string, eventId: string, userId: string, objectId: string): Promise<ClickEvent> => {
    return externalRequest<ClickEvent>({
        url: apiBaseUrl + urls.gdpr.clickEvent,
        method: HttpMethod.PATCH,
        serverApiKey: apiKey,
        body: {
            userId,
            eventId,
            objectId
        }
    })
}

export const gdprUpdateVisitEvent = async (apiBaseUrl: string, apiKey: string, eventId: string, userId: string, pageUrl: string): Promise<VisitEvent> => {
    return externalRequest<VisitEvent>({
        url: apiBaseUrl + urls.gdpr.visitEvent,
        method: HttpMethod.PATCH,
        serverApiKey: apiKey,
        body: {
            userId,
            eventId,
            pageUrl
        }
    })
}

export const gdprUpdateInputEvent = async (apiBaseUrl: string, apiKey: string, eventId: string, userId: string, objectId?: string, textValue?: string): Promise<InputEvent> => {
    return externalRequest<InputEvent>({
        url: apiBaseUrl + urls.gdpr.inputEvent,
        method: HttpMethod.PATCH,
        serverApiKey: apiKey,
        body: {
            userId,
            eventId,
            ...(objectId && { objectId: objectId as string, }),
            ...(textValue && { textValue: textValue as string })
        }
    })
}

export const gdprUpdateCustomEvent = async (apiBaseUrl: string, apiKey: string, eventId: string, userId: string, userAttribute: string, updatedAttributes: object): Promise<CustomEvent> => {
    return externalRequest<CustomEvent>({
        url: apiBaseUrl + urls.gdpr.customEvent,
        method: HttpMethod.PATCH,
        serverApiKey: apiKey,
        body: {
            userId,
            eventId,
            userAttribute,
            updatedAttributes
        }
    })
}