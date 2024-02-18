export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PATCH = "PATCH",
    PUT = "PUT",
    DELETE = "DELETE",
}

export interface InternalRequestData {
    url: string;
    method: HttpMethod;
    body?: { [key: string]: unknown };
    queryParams?: { [key: string]: string | number | boolean | undefined };
    clientApiKey?: string;
    serverApiKey?: string;
}

export interface InternalResponseData<T> {
    success: boolean;
    message?: string;
    payload?: T;
}

export interface BaseEvent {
    category: string;
    subcategory: string;
}

export interface ClickEvent extends BaseEvent {
    eventProperties: ClickEventProperties
}

export interface ClickEventProperties {
    objectId: string;
    userId: string;
}
