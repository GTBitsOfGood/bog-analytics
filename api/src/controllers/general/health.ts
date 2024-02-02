import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";

const healthRoute = APIWrapper({
    GET: {
        config: {
            requireToken: false,
        },
        handler: async () => {
            return {
                Hello: "World",
                Version: 1.0,
            };
        },
    },
});

export const health = relogRequestHandler(healthRoute);