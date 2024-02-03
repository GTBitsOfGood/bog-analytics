import { InternalRequestData, InternalResponseData } from "@/utils/types";

export async function externalRequest<T>({
    url,
    queryParams,
    method,
    body,
    apiKey
}: InternalRequestData): Promise<T> {
    const requestInfo: RequestInit = {
        method,
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "accesstoken": apiKey ?? ""
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
    const responseBody = (await response.json()) as InternalResponseData<T>;

    if (!responseBody) {
        throw new Error("Unable to connect to API.");
    } else if (!responseBody.success) {
        const errorMessage = responseBody.message;
        throw new Error(errorMessage);
    }

    return responseBody.payload as T;
}