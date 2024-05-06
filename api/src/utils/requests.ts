import { ExternalRequestData, ExternalResponseData } from "@/src/utils/types";
import fetch, { RequestInit } from 'node-fetch';

export async function externalRequest<T>({
    url,
    queryParams,
    method,
    body,
}: ExternalRequestData): Promise<T> {
    const requestInfo: RequestInit = {
        method,
        // mode: "cors",
        // credentials: "omit",
        headers: {
            "Content-Type": "application/json",
        },
    };
    if (body) {
        requestInfo.body = JSON.stringify(body);
    }

    if (queryParams) {
        const urlSearchParams = new URLSearchParams(
            Object.entries(queryParams)
                .filter(([, value]) => value !== undefined && value !== null)
                .map(([key, value]) => [
                    key,
                    (value as string | number | boolean).toString(),
                ])
        );
        url = `${url}?${urlSearchParams.toString()}`;
    }

    const response = await fetch(url, requestInfo);
    const responseBody = (await response.json()) as ExternalResponseData<T>;

    if (!responseBody) {
        throw new Error("Unable to connect to API.");
    } else if (!responseBody.success) {
        const errorMessage = responseBody.message;
        throw new Error(errorMessage);
    }

    return responseBody.payload as T;
}
