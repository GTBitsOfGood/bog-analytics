import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import {
    HttpMethod,
    Role,
} from "src/utils/types";
import { APIWrapperType } from "@/utils/types"
import { getUser } from "server/auth";
import { User } from "lucia";

interface RouteConfig {
    requireToken?: boolean;
    roles?: Array<Role>;
    handleResponse?: boolean; // handleResponse if the route handles setting status code and body
    requireEmailVerified?: boolean;
}

interface Route<T> {
    config?: RouteConfig;
    handler: (
        req: NextRequest,
    ) => Promise<T>;
}


function APIWrapper(
    routeHandlers: Partial<Record<HttpMethod, Route<unknown>>>
): APIWrapperType {
    return async (req: NextRequest) => {
        const method = req.method;
        const route = routeHandlers[method as HttpMethod];

        if (!method || !route) {
            const errorMessage = method
                ? `Request method ${method} is invalid.`
                : "Missing request method.";

            return NextResponse.json({
                success: false,
                message: errorMessage,
            }, { status: 200 });
        }

        const { config, handler } = route;

        try {
            // Handle user access token + roles restrictions
            if (config?.requireToken) {
                const user: User | null = await getUser();

                if (!user) {
                    return NextResponse.json({
                        success: false,
                        message: "You do not have permissions to access this API route",
                    }, { status: 400 });
                }

                if (config.roles) {
                    if (
                        config.roles.length !== 0 &&
                        !config.roles.some((role) => user?.roles?.includes(role))
                    ) {
                        return NextResponse.json({
                            success: false,
                            message: "You do not have permissions to access this API route",
                        }, { status: 400 });
                    }
                }
            }
            const data = await handler(req);

            if (config?.handleResponse) {
                return;
            }

            return NextResponse.json({ success: true, payload: data }, { status: 200 });
        } catch (e) {
            if (e instanceof mongoose.Error) {
                console.log(e.message)
                return NextResponse.json({
                    success: false,
                    message: `An Internal Server error occurred: ${e.message}`,
                }, { status: 500 });
            }

            const error = e as Error;
            return NextResponse.json({ success: false, message: error.message }, { status: 400 });
        }
    };
}

export default APIWrapper;
