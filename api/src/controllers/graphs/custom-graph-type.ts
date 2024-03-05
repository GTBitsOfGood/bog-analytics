import { createCustomGraphType, getCustomGraphTypes, deleteCustomGraphType } from "@/src/actions/custom-graph-type";
import { getProjectByClientKey } from "@/src/actions/project";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { CustomGraphType } from "@/src/utils/types";
import { Request } from "express";

const customGraphTypeRoute = APIWrapper({
    POST: {
        config: {
            requireClientToken: false,
            requireServerToken: true
        },
        handler: async (req: Request) => {
            const { eventTypeId, xProperty, yProperty, graphType } = req.body;
            if (!eventTypeId || !xProperty || !yProperty || !graphType) {
                throw new Error("You must specify an event type, x property, y property, and graph type to create a custom graph!")
            }
            const project = await getProjectByClientKey(req.headers.serverToken as string);

            if (!project) {
                throw new Error("Project does not exist for client token")
            }
            const customGraphType: Partial<CustomGraphType> = {
                projectId: project._id,
                eventTypeId,
                xProperty,
                yProperty,
                graphType,
                
            }
            if (req.body.caption !== undefined) {
                graphType.graphType = {
                    ...graphType.graphType,
                    caption: req.body.caption,
                };
            }

            const createdGraphType = await createCustomGraphType(customGraphType);
            return createdGraphType;
        },
    },
    DELETE: {
        config: {
            requireClientToken: false,
            requireServerToken: true
        },
        handler: async (req: Request) => {
            const { graphId} = req.body
            if (!graphId) {
                throw new Error("You must specify a graph to delete!")
            }

            let deletedGraph = await deleteCustomGraphType(graphId);
            return deletedGraph;
        },
    },
    GET: {
        config: {
            requireClientToken: false,
            requireServerToken: false
        },
        handler: async (req: Request) => {
            const { projectId, eventTypeId} = req.body
            if (!projectId || !eventTypeId) {
                throw new Error("You must specify a project and event type to get custom event types!")
            }
            //api wrapper will check that server token is valid
            let graphTypes = await getCustomGraphTypes(eventTypeId, projectId);
            return graphTypes;
        },
    },

});


export const customEvent = relogRequestHandler(customEventRoute);