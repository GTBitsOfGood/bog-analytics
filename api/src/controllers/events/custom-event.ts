import { createCustomEvent, paginatedGetCustomEvents } from "@/src/actions/custom-event";
import { getCustomEventTypeID, findEventTypeForProjectByID } from "@/src/actions/custom-event-type";
import { getProjectIDByName } from "@/src/actions/project";
import { getProjectByClientKey } from "@/src/actions/project";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { CustomEvent, EventEnvironment } from "@/src/utils/types";
import { Request } from "express";

const customEventRoute = APIWrapper({
    POST: {
        config: {
            requireClientToken: true,
            requireServerToken: false
        },
        handler: async (req: Request) => {
            const { eventTypeId, properties, environment } = req.body;
            if (!eventTypeId || !properties) {
                throw new Error("You must specify a category and subcategory to create a custom event!")
            }
            const project = await getProjectByClientKey(req.headers.clienttoken as string);
            if (!project) {
                throw new Error("Project does not exist for client token")
            }
            const event: Partial<CustomEvent> = {
                projectId: project._id,
                properties,
                eventTypeId,
                environment
            }
            const eventType = await findEventTypeForProjectByID(project._id.toString(), eventTypeId);
            if (!eventType) {
                throw new Error("Event type does not exist");
            }

            const typeProperties = eventType.properties;
            if (Object.keys(typeProperties).length !== Object.keys((event?.properties as Record<string, string | number | Date>)).length) {
                throw new Error("Event properties do not match event type properties")
            }
            for (const key in event?.properties) {
                let has = false;
                for (let i = 0; i < typeProperties.length; i++) {
                    let value = typeProperties[i]
                    if (value == key) {
                        has = true;
                        break;
                    }
                }
                if (has == false) {
                    throw new Error("Event properties do not match event type properties")
                }
            }
            const createdEvent = await createCustomEvent(event);

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
            const { projectName, category, subcategory, environment } = req.query
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
                throw new Error("You must specify a project name!")
            }
            const events = await paginatedGetCustomEvents(eventType.toString(), afterTime, afterId as string, parseInt(limit as string), environment as EventEnvironment);
            return {
                events,
                afterId: events.length ? events[events.length - 1]._id : null
            }
        },
    },

});


export const customEvent = relogRequestHandler(customEventRoute);