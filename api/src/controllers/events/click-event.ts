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
});

const clickEventPaginationRoute = APIWrapper({
    GET: {
        config: {
            requireToken: true,
        },
        handler: async (req: Request) => {
            const { afterTime, afterId, limit, projectName } = req.params;

            if (!afterId || !afterTime || !limit || !projectName) {
                throw new Error("You must specify a project name to create a project!")
            }

            return await paginatedGetClickEvents(afterTime, afterId, parseInt(limit), projectName);
        },
    },
});

export const clickEvent = relogRequestHandler(clickEventRoute);
export const paginatedClickEvents = relogRequestHandler(clickEventPaginationRoute)