import { createCustomEventType, getCustomEventTypesForProject } from "@/src/actions/custom-event-type";
import { getProjectIDByName } from "@/src/actions/project";
import { getProjectByServerKey } from "@/src/actions/project";
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
    GET: {
        config: {
            requireClientToken: false,
            requireServerToken: false
        },
        handler: async (req: Request) => {
            const projectName = req.query.projectName
            if (!projectName) {
                throw new Error("You must specify a project to get custom event types!")
            }
            const id = await getProjectIDByName(projectName as string);

            if (!id) {
                throw new Error("Project does not exist")
            }
            const types = await getCustomEventTypesForProject(id);
            return types;
        },
    },

});


export const customEventType = relogRequestHandler(customEventTypeRoute);