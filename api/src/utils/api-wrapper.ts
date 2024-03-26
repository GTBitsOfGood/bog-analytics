import mongoose from "mongoose";
import {
    HttpMethod,
} from "@/src/utils/types";
import { Request, RequestHandler, Response } from "express"; import { getProjectByClientKey, getProjectByServerKey } from "@/src/actions/project";

interface RouteConfig {
    requireClientToken?: boolean;
    requireServerToken?: boolean;
    handleResponse?: boolean; // handleResponse if the route handles setting status code and body
    developmentRoute?: boolean // for routes we want for development purposes only 
}

interface Route<T> {
    config?: RouteConfig;
    handler: (
        req: Request,
        res: Response
    ) => Promise<T>;
}

function APIWrapper(
    routeHandlers: Partial<Record<HttpMethod, Route<unknown>>>
): RequestHandler {
    return async (req: Request, res: Response) => {
        const method = req.method;
        const route = routeHandlers[method as HttpMethod];

        if (!method || !route) {
            const errorMessage = method
                ? `Request method ${method} is invalid.`
                : "Missing request method.";

            return res.status(400).json({
                success: false,
                message: errorMessage,
            });
        }

        const { config, handler } = route;

        if (config?.developmentRoute && process.env.NODE_ENV === "production") {
            return res.status(403).json({
                success: false,
                message: "You do not have permissions to access this API route",
            });
        }
        try {
            // Handle user access token + roles restrictions
            if (config?.requireClientToken) {
                const project = await getProjectByClientKey(req.headers.clienttoken as string)
                if (!project) {
                    return res.status(403).json({
                        success: false,
                        message: "You do not have permissions to access this API route",
                    });
                }
            }

            if (config?.requireServerToken) {
                const project = await getProjectByServerKey(req.headers.servertoken as string)
                if (!project) {
                    return res.status(403).json({
                        success: false,
                        message: "You do not have permissions to access this API route",
                    });
                }
            }


            const data = await handler(req, res);
            if (config?.handleResponse) {
                return;
            }
            return res.status(200).json({ success: true, payload: data });
        } catch (e) {
            if (e instanceof mongoose.Error) {
                return res.status(500).json({
                    success: false,
                    message: `An Internal Server error occurred: ${e.message}`,
                });
            }

            const error = e as Error;
            return res.status(400).json({ success: false, message: error.message });
        }
    };
}

export default APIWrapper;
