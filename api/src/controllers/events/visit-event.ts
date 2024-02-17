import { createVisitEvent } from "@/src/actions/visit-event";
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

export const visitEvent = relogRequestHandler(visitEventRoute);