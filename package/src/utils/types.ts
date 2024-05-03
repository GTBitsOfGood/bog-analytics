export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PATCH = "PATCH",
    PUT = "PUT",
    DELETE = "DELETE",
}

export interface ExternalRequestData {
    url: string;
    method: HttpMethod;
    body?: { [key: string]: unknown };
    queryParams?: { [key: string]: string | number | boolean | undefined };
    clientApiKey?: string;
    serverApiKey?: string;
}

export interface ExternalResponseData<T> {
    success: boolean;
    message?: string;
    payload?: T;
}

export interface BaseEvent {
    _id: string;
    category: string;
    subcategory: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface CustomEventType {
    _id?: string;
    category: string;
    subcategory: string;
    properties: string[]
    projectId: string;
}

export interface BaseEventWithoutCategory {
    _id: string;
    projectId: string;
    environment: EventEnvironment;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface CustomEvent extends BaseEventWithoutCategory {
    eventTypeId: string;
    properties: object;
}

export interface CustomGraphType {
    _id: string;
    eventTypeId: string;
    projectId: string;
    graphTitle: string;
    xProperty: string
    yProperty: string
    graphType: string
    caption?: string
}

export interface ClickEvent extends BaseEvent {
    eventProperties: ClickEventProperties
}

export interface ClickEventProperties {
    objectId: string;
    userId: string;
}

export interface VisitEvent extends BaseEvent {
    eventProperties: VisitEventProperties
}

export interface VisitEventProperties {
    pageUrl: string;
    userId: string;
}

export interface InputEvent extends BaseEvent {
    eventProperties: InputEventProperties
}

export interface InputEventProperties {
    objectId: string;
    userId: string;
    textValue: string;
}

export enum EventEnvironment {
    DEVELOPMENT = "development",
    STAGING = "staging",
    PRODUCTION = "production"
}

export interface Project {
    _id: string;
    clientApiKey: string;
    serverApiKey: string;
    projectName: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface GetEventsQueryParams {
    projectName: string;
    afterId: string | undefined;
    environment: EventEnvironment;
    limit?: number;
    afterTime?: string;
}

export interface GetCustomEventsQueryParams extends GetEventsQueryParams {
    category: string;
    subcategory: string;
}

