import { Icon, IconProps } from "@tabler/icons-react";
import { CorsRequest } from "cors";
import { Types } from "mongoose";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import react, { ReactElement } from "react";

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PATCH = "PATCH",
    PUT = "PUT",
    DELETE = "DELETE",
}

export interface InternalRequest extends NextApiRequest {
    body: { [key: string]: unknown };
}

export interface InternalRequestData {
    url: string;
    method: HttpMethod;
    body?: { [key: string]: unknown };
    queryParams?: { [key: string]: string | number | boolean | undefined };
}

export interface InternalResponseData<T> {
    success: boolean;
    message?: string;
    payload?: T;

}

export interface ExternalRequestData {
    url: string;
    method: HttpMethod;
    body?: { [key: string]: unknown };
    queryParams?: { [key: string]: string | number | boolean | undefined };
    portalToken?: string
}

export interface ExternalResponseData<T> {
    success: boolean;
    message?: string;
    payload?: T;
}

export type APIWrapperResponse = Promise<NextResponse<{ success: boolean; message: string; }> | NextResponse<{ success: boolean; payload: unknown; }> | undefined>;
export type APIWrapperType = (req: NextRequest) => APIWrapperResponse;

export interface Session {
    _id: string;
    user_id: string;
    expires_at: Date;
}

export enum ProviderTypes {
    EMAIL_PASSWORD = "emailpass"
}

export interface InternalUser {
    _id: string;
    email: string;
    roles: Role[];
    verified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Session {
    _id: string;
    user_id: string;
    active_expires: number;
    idle_expires: number;
}


export enum Role {
    MEMBER = "Member",
    ADMIN = "Admin",
}

export enum ScreenURLs {
    HOME = "",
    DASHBOARD = "dashboard",
    SIGN_IN = "sign-in",
    SIGN_UP = "sign-up"
}

export interface TabConfiguration {
    name: string;
    id: string;
    icon: react.ForwardRefExoticComponent<Omit<IconProps, "ref"> & react.RefAttributes<Icon>>;
}

export interface Project {
    _id: string | Types.ObjectId;
    clientApiKey: string;
    serverApiKey: string;
    projectName: string;
    createdAt?: Date;
    updatedAt?: Date;
}