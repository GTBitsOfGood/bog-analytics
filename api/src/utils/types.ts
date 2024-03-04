import {
    Document, Types
} from 'mongoose';


export interface BaseEvent extends Document {
    category: string;
    subcategory: string;
    projectId: string | Types.ObjectId;
}

export interface VisitEvent extends BaseEvent {
    eventProperties: VisitEventProperties
}

export interface VisitEventProperties {
    pageUrl: string;
    userId: string;
    date: Date;
}
export interface InputEvent extends BaseEvent {
    eventProperties: InputEventProperties
}

export interface InputEventProperties {
    objectId: string;
    userId: string;
    textValue: string;
}
export interface ClickEvent extends BaseEvent {
    eventProperties: ClickEventProperties
}

export interface ClickEventProperties {
    objectId: string;
    userId: string;
}

export interface Project {
    _id: string | Types.ObjectId;
    clientApiKey: string;
    serverApiKey: string;
    projectName: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CustomEventType {
    _id: string | Types.ObjectId;
    category: string;
    subcategory: string;
    properties: string[]
    projectId: string | Types.ObjectId;
}

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
    authRequired?: boolean;
}

export interface InternalResponseData<T> {
    success: boolean;
    message?: string;
    payload?: T;
}

export enum EventCategories {
    INTERACTION = "Interaction",
    ACTIVITY = "Activity",
}

export enum EventSubcategories {
    CLICK = "Click",
    VISIT = "Visit",
    INPUT = "Input",
}