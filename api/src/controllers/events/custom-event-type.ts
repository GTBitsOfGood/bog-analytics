import { createCustomEventType } from "@/src/actions/custom-event-type";
import { getProjectByClientKey, getProjectByServerKey } from "@/src/actions/project";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { CustomEventType } from "@/src/utils/types";
import { Request } from "express";

const customEventTypeRoute = APIWrapper({
    POST: {
        config: {
            requireClientToken: true,
            requireServerToken: true
        },
        handler: async (req: Request) => {
            const { category, subcategory, properties } = req.body;
            if (!category || !subcategory) {
                throw new Error("You must specify a category and subcategory to create a custom event type!")
            }
            const project = await getProjectByServerKey(req.headers.servertoken as string);

            if (!project) {
                throw new Error("Project does not exist for client token")
            }
            const customEventType: Partial<CustomEventType> = {
                category: category,
                subcategory: subcategory,
                properties: properties,
                projectId: project._id,
            }
            const createdType = await createCustomEventType(customEventType);
            return createdType;
        },
    },

});


export const customEventType = relogRequestHandler(customEventTypeRoute);