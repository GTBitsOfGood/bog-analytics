import {
    Document
} from 'mongoose';
import { Request } from 'express';

export interface BaseEvent extends Document {
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

export interface Project {
    apiKey: string;
    projectName: string;
    createdAt?: Date;
    updatedAt?: Date;
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

