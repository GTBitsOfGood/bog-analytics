import { createClickEvent, paginatedGetClickEvents } from "@/src/actions/click-event";
import { getProjectByClientKey } from "@/src/actions/project";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { ClickEvent, EventCategories, EventSubcategories } from "@/src/utils/types";
import { Request } from "express";

const clickEventRoute = APIWrapper({
    POST: {
        config: {
            requireClientToken: true,
        },
        handler: async (req: Request) => {
            const { objectId, userId } = req.body;
            if (!objectId || !userId) {
                throw new Error("You must specify an object id and user id to create a click event!")
            }
            const project = await getProjectByClientKey(req.headers.clienttoken as string);

            if (!project) {
                throw new Error("Project does not exist for client token")
            }
            const event: Partial<ClickEvent> = {
                projectId: project._id,
                category: EventCategories.INTERACTION,
                subcategory: EventSubcategories.CLICK,
                eventProperties: {
                    objectId,
                    userId
                }
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
            const { afterId, projectName } = req.params;
            const limit = req.params.limit ?? 10
            const afterTime = req.params.afterTime ?? new Date(Date.now() - 60 * 60 * 24 * 30 * 1000)
            if (!projectName) {
                throw new Error("You must specify a project name to create a project!")
            }
            return await paginatedGetClickEvents(afterTime, afterId, parseInt(limit), projectName);
        },
    },
});


export const clickEvent = relogRequestHandler(clickEventRoute);