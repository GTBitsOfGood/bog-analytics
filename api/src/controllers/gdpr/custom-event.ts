import { deleteCustomEventsByUserId, getCustomEventById, paginatedGetCustomEventsByUser, updateCustomEventById } from "@/src/actions/custom-event";
import { findEventTypeForProject } from "@/src/actions/custom-event-type";
import { getProjectByServerKey } from "@/src/actions/project";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { CustomEvent } from "@/src/utils/types";
import { Request } from "express";

// Realistically, these endpoints would only be used on the server side when we know a verified entity wants control over their analytics data
// So we require server token here instead of client token
const gdprCustomEventRoute = APIWrapper({
    DELETE: {
        config: {
            requireServerToken: true,
        },
        handler: async (req: Request) => {
            const { userId, userAttribute, eventCategory, eventSubcategory } = req.body;
            if (!userId || !userAttribute || !eventCategory || !eventSubcategory) {
                throw new Error("You must specify an event category, event subcategory, user id, and user attribute to delete data for.")
            }
            const project = await getProjectByServerKey(req.headers.servertoken as string);
            if (!project) {
                throw new Error("Project with specified server token not found");
            }
            const eventType = await findEventTypeForProject(project._id.toString(), eventCategory, eventSubcategory);
            if (!eventType) {
                throw new Error("Event type for specified category and subcategory does not exist");
            }

            if (!eventType.properties.includes(userAttribute)) {
                throw new Error("Specified user attribute is not a property of the event type");
            }
            return await deleteCustomEventsByUserId(project?._id.toString(), userId as string, eventType._id.toString() as string, userAttribute as string);
        },
    },
    GET: {
        config: {
            requireServerToken: true,
        },
        handler: async (req: Request) => {
            const { afterId, userId, userAttribute, eventCategory, eventSubcategory } = req.query;
            if (!userId || !userAttribute || !eventCategory || !eventSubcategory) {
                throw new Error("You must specify a user id, user attribute, event category, and event subcategory to get data for.")
            }

            const limit = req.query.limit ?? 10
            const project = await getProjectByServerKey(req.headers.servertoken as string);
            if (!project) {
                throw new Error("Project with specified server token not found");
            }
            const eventType = await findEventTypeForProject(project._id.toString(), eventCategory as string, eventSubcategory as string);
            if (!eventType) {
                throw new Error("Event type for specified category and subcategory does not exist");
            }

            const events: CustomEvent[] = await paginatedGetCustomEventsByUser(afterId as string, parseInt(limit as string), project._id.toString(), eventType._id.toString(), userAttribute as string, userId as string);
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
            const { eventId, userId, userAttribute, updatedAttributes } = req.body;
            if (!eventId || !userId || !userAttribute) {
                throw new Error("You must specify a user id, object id, user attribute, and event id to update an event.")
            }
            const event: CustomEvent | null = await getCustomEventById(eventId as string);

            if (!event) {
                throw new Error("No such event id exists for the specified event id");
            }

            const eventAttributes = Object.keys(event.properties)
            if (!eventAttributes.includes(userAttribute)) {
                throw new Error("Specified user attribute is not a property of the event type");
            }

            if ((event.properties as { [key: string]: string | number | boolean | undefined })[`${userAttribute as string}`] !== userId) {
                throw new Error("This event does not belong to the specified user");
            }

            if (Object.keys(updatedAttributes).includes(userAttribute)) {
                throw new Error("You cannot update the user attribute")
            }
            const updateAttributeKeys = Object.keys(updatedAttributes);
            const nonExistentKeys = updateAttributeKeys.filter(key => !event.properties.hasOwnProperty(key))

            if (nonExistentKeys.length > 0) {
                throw new Error("Updated attributes include keys that do not exist on the event type")
            }

            const updatedEvent = await updateCustomEventById(eventId as string, { ...event.properties, ...updatedAttributes } as object)
            return updatedEvent
        }
    }
});


export const gdprCustomEvent = relogRequestHandler(gdprCustomEventRoute);