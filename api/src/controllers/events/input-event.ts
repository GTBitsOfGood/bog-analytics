import { createInputEvent, paginatedGetInputEvents } from "@/src/actions/input-event";
import { getProjectByClientKey } from "@/src/actions/project";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { InputEvent } from "@/src/utils/types";
import { Request } from "express";


const inputEventRoute = APIWrapper({
    POST: {
        config: {
            requireClientToken: true,
        },
        handler: async (req: Request) => {
            const { objectId, userId, textValue } = req.body;

            if (!objectId || !userId || !textValue) {
                throw new Error("You must specify an objectId, userId, and textValue!")
            }

            const project = await getProjectByClientKey(req.headers.clienttoken as string);

            if (!project) {
                throw new Error("Project does not exist for client token")
            }

            const event: Partial<InputEvent> = {
                projectId: project._id,
                eventProperties: {
                    objectId,
                    userId,
                    textValue
                }
            }

            await createInputEvent(event);
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
                throw new Error("You must specify a project name!")
            }
            const events: InputEvent[] = await paginatedGetInputEvents(afterTime, afterId as string, parseInt(limit as string), projectName as string);
            return {
                events,
                afterId: events.length ? events[events.length - 1]._id : null
            }
        },
    },
});


export const inputEvent = relogRequestHandler(inputEventRoute);