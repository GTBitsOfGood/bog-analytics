import { createClickEvent, paginatedGetClickEvents } from "@/src/actions/click-event";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { ClickEvent } from "@/src/utils/types";
import { Request } from "express";


const clickEventRoute = APIWrapper({
    POST: {
        config: {
            requireToken: true,
        },
        handler: async (req: Request) => {
            const { objectId, userId, } = req.body;

            if (!objectId || !userId) {
                throw new Error("You must specify a project name to create a project!")
            }

            const event: Partial<ClickEvent> = {
                eventProperties: {
                    objectId,
                    userId
                }
            }

            await createClickEvent(event);
        },
    },
    GET: {
        config: {
            requireToken: false,
        },
        handler: async (req: Request) => {
            const { afterId, projectName } = req.params;
            const limit = req.params.limit ?? 10
            const afterTime = req.params.afterTime ?? new Date(Date.now() - 60 * 60 * 24 * 30 * 1000)
            if (!projectName) {
                throw new Error("You must specify a project name to create a project!")
            }
            return await paginatedGetClickEvents(afterTime, afterId, parseInt(limit), projectName);
        },
    },
});


export const clickEvent = relogRequestHandler(clickEventRoute);