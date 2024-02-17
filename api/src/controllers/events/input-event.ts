import { createInputEvent, paginatedGetInputEvents } from "@/src/actions/input-event";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { InputEvent } from "@/src/utils/types";
import { Request } from "express";


const inputEventRoute = APIWrapper({
    POST: {
        config: {
            requireToken: true,
        },
        handler: async (req: Request) => {
            const { objectId, userId, textValue } = req.body;

            if (!objectId || !userId || !textValue) {
                throw new Error("You must specify a project name to create a project!")
            }

            const event: Partial<InputEvent> = {
                eventProperties: {
                    objectId,
                    userId,
                    textValue
                }
            }

            await createInputEvent(event);
        },
    },
});

const inputEventPaginationRoute = APIWrapper({
    GET: {
        config: {
            requireToken: true,
        },
        handler: async (req: Request) => {
            const { afterTime, afterId, limit, projectName } = req.params;

            if (!afterId || !afterTime || !limit || !projectName) {
                throw new Error("You must specify a project name to create a project!")
            }

            return await paginatedGetInputEvents(afterTime, afterId, parseInt(limit), projectName);
        },
    },
});

export const inputEvent = relogRequestHandler(inputEventRoute);
export const paginatedInputEvents = relogRequestHandler(inputEventPaginationRoute);