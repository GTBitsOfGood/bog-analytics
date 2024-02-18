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
            return await paginatedGetVisitEvents(afterTime, afterId, parseInt(limit), projectName);
        },
    },
});


export const visitEvent = relogRequestHandler(visitEventRoute);
