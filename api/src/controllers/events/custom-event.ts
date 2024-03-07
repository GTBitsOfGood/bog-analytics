import { createCustomEvent, paginatedGetCustomEvents } from "@/src/actions/custom-event";
import { getCustomEventTypeID } from "@/src/actions/custom-event-type";
import { getProjectIDByName } from "@/src/actions/project";
import { getProjectByClientKey } from "@/src/actions/project";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { CustomEvent } from "@/src/utils/types";
import { Request } from "express";

const customEventRoute = APIWrapper({
    POST: {
        config: {
            requireClientToken: true,
            requireServerToken: false
        },
        handler: async (req: Request) => {
            const { eventTypeId, properties } = req.body;
            if (!eventTypeId || !properties) {
                throw new Error("You must specify a category and subcategory to create a custom event!")
            }
            const project = await getProjectByClientKey(req.headers.clienttoken as string);

            if (!project) {
                throw new Error("Project does not exist for client token")
            }

            const createdEvent = await createCustomEvent(project._id.toString(), eventTypeId, properties);

            if (!createdEvent) {
                throw new Error("Failed to create custom event");
            }
            return createdEvent;
        },
    },
    GET: {
        config: {
            requireClientToken: false,
            requireServerToken: false
        },
        handler: async (req: Request) => {
            const { projectName, category, subcategory } = req.query
            if (!projectName) {
                throw new Error("You must specify a project to get custom event types!")
            }
            const id = await getProjectIDByName(projectName as string);

            if (!id) {
                throw new Error("Project does not exist")
            }
            const eventType = await getCustomEventTypeID(id.toString(), category as string, subcategory as string);
            if (!eventType) {
                throw new Error("Event type does not exist");
            }

            const { afterId } = req.query;
            const limit = req.query.limit ?? 10
            const afterTime = req.query.afterTime ? new Date(req.query.afterTime as string) : new Date(Date.now() - 60 * 60 * 24 * 30 * 1000)
            if (!projectName) {
                throw new Error("You must specify a project name to create a project!")
            }
            const events = await paginatedGetCustomEvents(eventType.toString(), afterTime, afterId as string, parseInt(limit as string));
            return {
                events,
                afterId: events.length ? events[events.length - 1]._id : null
            }
        },
    },

});


export const customEvent = relogRequestHandler(customEventRoute);