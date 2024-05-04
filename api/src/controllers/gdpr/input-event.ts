import { deleteInputEventsByUserId, getInputEventById, paginatedGetInputEventsByUser, updateInputEventById } from "@/src/actions/input-event";
import { getProjectByServerKey } from "@/src/actions/project";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { InputEvent, } from "@/src/utils/types";
import { Request } from "express";

// Realistically, these endpoints would only be used on the server side when we know a verified entity wants control over their analytics data
// So we require server token here instead of client token
const gdprInputEventRoute = APIWrapper({
    DELETE: {
        config: {
            requireServerToken: true,
        },
        handler: async (req: Request) => {
            const { userId } = req.body;
            if (!userId) {
                throw new Error("You must specify a user id to delete data for.")
            }
            const project = await getProjectByServerKey(req.headers.servertoken as string);
            if (!project) {
                throw new Error("Project with specified server token not found");
            }
            return await deleteInputEventsByUserId(project?._id.toString(), userId as string);
        },
    },
    GET: {
        config: {
            requireServerToken: true,
        },
        handler: async (req: Request) => {
            const { afterId, userId } = req.query;
            if (!userId) {
                throw new Error("You must specify a user id to get data for.")
            }

            const limit = req.query.limit ?? 10
            const project = await getProjectByServerKey(req.headers.servertoken as string);
            if (!project) {
                throw new Error("Project with specified server token not found");
            }
            const events: InputEvent[] = await paginatedGetInputEventsByUser(afterId as string, parseInt(limit as string), project._id.toString(), userId as string);
            return {
                events,
                afterId: events.length ? events[events.length - 1]._id : null
            }

        },
    },
    PATCH: {
        config: {
            requireServerToken: true,
        },
        handler: async (req: Request) => {
            // specify a new objectId because that is the only property that can be set for click events
            // Make sure userId is immutable to prevent impersonation
            const { eventId, objectId, textValue, userId } = req.body;
            if (!eventId || !(objectId || textValue) || !userId) {
                throw new Error("You must specify a user id, object id or text value, and event id to update an event.")
            }
            const event: InputEvent | null = await getInputEventById(eventId as string);

            if (!event) {
                throw new Error("No such event id exists for the specified event id");
            }

            if (event.eventProperties.userId !== userId) {
                throw new Error("This event does not belong to the specified user");
            }

            return await updateInputEventById(eventId as string, objectId as string, textValue as string)

        }
    }
});


export const gdprInputEvent = relogRequestHandler(gdprInputEventRoute);