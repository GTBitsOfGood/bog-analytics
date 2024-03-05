import { createVisitEvent, paginatedGetVisitEvents } from "@/src/actions/visit-event";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { VisitEvent } from "@/src/utils/types";
import { Request } from "express";
import { getProjectByClientKey } from "@/src/actions/project";


const visitEventRoute = APIWrapper({
    POST: {
        config: {
            requireClientToken: true,
        },
        handler: async (req: Request) => {
            const { pageUrl, userId, date } = req.body;

            if (!pageUrl || !userId || !date) {
                throw new Error("You must specify a project name to create a project!")
            }
            const project = await getProjectByClientKey(req.headers.clienttoken as string);

            if (!project) {
                throw new Error("Project does not exist for client token")
            }

            const event: Partial<VisitEvent> = {
                projectId: project._id,
                eventProperties: {
                    pageUrl,
                    userId,
                }
            }

            await createVisitEvent(event);
        },
    },
    GET: {
        config: {
            requireClientToken: false,
        },
        handler: async (req: Request) => {
            const { afterId, projectName } = req.query;
            const limit = req.query.limit ?? 10
            const afterTime = req.query.afterTime ? new Date(req.query.afterTime as string) : new Date(Date.now() - 60 * 60 * 24 * 30 * 1000)
            if (!projectName) {
                throw new Error("You must specify a project name to create a project!")
            }
            return await paginatedGetVisitEvents(afterTime, afterId as string, parseInt(limit as string), projectName as string);
        },
    },
});


export const visitEvent = relogRequestHandler(visitEventRoute);
