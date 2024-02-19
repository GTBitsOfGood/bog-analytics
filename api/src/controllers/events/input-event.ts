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
                throw new Error("You must specify a project name to create a project!")
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
            const { afterId, projectName } = req.params;
            const limit = req.params.limit ?? 10
            const afterTime = req.params.afterTime ?? new Date(Date.now() - 60 * 60 * 24 * 30 * 1000)
            if (!projectName) {
                throw new Error("You must specify a project name to create a project!")
            }
            return await paginatedGetInputEvents(afterTime, afterId, parseInt(limit), projectName);
        },
    },
});


export const inputEvent = relogRequestHandler(inputEventRoute);