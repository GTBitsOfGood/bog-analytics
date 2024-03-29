import { createClickEvent, paginatedGetClickEvents } from "@/src/actions/click-event";
import { getProjectByClientKey } from "@/src/actions/project";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { ClickEvent, EventEnvironment } from "@/src/utils/types";
import { Request } from "express";

const clickEventRoute = APIWrapper({
    POST: {
        config: {
            requireClientToken: true,
        },
        handler: async (req: Request) => {
            const { objectId, userId, environment } = req.body;
            if (!objectId || !userId) {
                throw new Error("You must specify an object id and user id to create a click event!")
            }
            const project = await getProjectByClientKey(req.headers.clienttoken as string);

            if (!project) {
                throw new Error("Project does not exist for client token")
            }
            const event: Partial<ClickEvent> = {
                projectId: project._id,
                eventProperties: {
                    objectId,
                    userId
                },
                environment
            }

            const createdEvent = await createClickEvent(event);
            return createdEvent;
        },
    },
    GET: {
        config: {
            requireClientToken: false,
        },
        handler: async (req: Request) => {
            const { afterId, projectName, environment } = req.query;
            const limit = req.query.limit ?? 10
            const afterTime = req.query.afterTime ? new Date(req.query.afterTime as string) : new Date(Date.now() - 60 * 60 * 24 * 30 * 1000)
            if (!projectName) {
                throw new Error("You must specify a project name!")
            }
            const events: ClickEvent[] = await paginatedGetClickEvents(afterTime, afterId as string, parseInt(limit as string), projectName as string, environment as EventEnvironment);
            return {
                events,
                afterId: events.length ? events[events.length - 1]._id : null
            }

        },
    },
});


export const clickEvent = relogRequestHandler(clickEventRoute);