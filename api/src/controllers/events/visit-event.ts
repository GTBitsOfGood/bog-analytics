import { createVisitEvent, paginatedGetVisitEvents } from "@/src/actions/visit-event";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { VisitEvent } from "@/src/utils/types";
import { Request } from "express";


const visitEventRoute = APIWrapper({
    POST: {
        config: {
            requireToken: true,
        },
        handler: async (req: Request) => {
            const { pageUrl, userId, date } = req.body;

            if (!pageUrl || !userId || !date) {
                throw new Error("You must specify a project name to create a project!")
            }

            const event: Partial<VisitEvent> = {
                eventProperties: {
                    pageUrl,
                    userId,
                    date
                }
            }

            await createVisitEvent(event);
        },
    },
});

const visitEventPaginationRoute = APIWrapper({
    GET: {
        config: {
            requireToken: true,
        },
        handler: async (req: Request) => {
            const { afterTime, afterId, limit, projectName } = req.params;

            if (!afterId || !afterTime || !limit || !projectName) {
                throw new Error("You must specify a project name to create a project!")
            }

            return await paginatedGetVisitEvents(afterTime, afterId, parseInt(limit), projectName);
        },
    },
});

export const visitEvent = relogRequestHandler(visitEventRoute);
export const paginatedVisitEvents = relogRequestHandler(visitEventPaginationRoute)