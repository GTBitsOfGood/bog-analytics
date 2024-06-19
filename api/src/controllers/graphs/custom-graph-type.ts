import { createCustomGraphType, getCustomGraphTypes, deleteCustomGraphType } from "@/src/actions/custom-graph-type";
import { getProjectByServerKey, getProjectIDByName } from "@/src/actions/project";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { CustomGraphType } from "@/src/utils/types";
import { Request } from "express";

/**
 * @swagger
 * /api/graphs/custom-graph-type:
 *   post:
 *     summary: Create a custom graph type
 *     description: Create a custom graph type with specified properties.
 *     tags: 
 *       - Graphs API
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventTypeId:
 *                 type: string
 *                 description: The ID of the event type.
 *               xProperty:
 *                 type: string
 *                 description: The X property of the graph.
 *               yProperty:
 *                 type: string
 *                 description: The Y property of the graph.
 *               graphType:
 *                 type: string
 *                 description: The type of the graph.
 *               graphTitle:
 *                 type: string
 *                 description: The title of the graph.
 *               caption:
 *                 type: string
 *                 description: The caption of the graph.
 *             required:
 *               - eventTypeId
 *               - xProperty
 *               - yProperty
 *               - graphType
 *               - graphTitle
 *     parameters:
 *       - in: header
 *         name: servertoken
 *         schema:
 *           type: string
 *         required: true
 *         description: Server token for authentication.
 *     responses:
 *       '200':
 *         description: Custom graph type created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomGraphType'
 *       '400':
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "You must specify an event type, x property, y property, and graph type to create a custom graph!"
 *       '403':
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Project does not exist for client token"
 */
const customGraphTypeRoute = APIWrapper({
    POST: {
        config: {
            requireClientToken: false,
            requireServerToken: true
        },
        handler: async (req: Request) => {
            const { eventTypeId, xProperty, yProperty, graphType, graphTitle } = req.body;
            if (!eventTypeId || !xProperty || !yProperty || !graphType || !graphTitle) {
                throw new Error("You must specify an event type, x property, y property, and graph type to create a custom graph!")
            }
            const project = await getProjectByServerKey(req.headers.servertoken as string);

            if (!project) {
                throw new Error("Project does not exist for client token")
            }
            const customGraphType: Partial<CustomGraphType> = {
                projectId: project._id,
                eventTypeId,
                xProperty,
                yProperty,
                graphType,
                graphTitle,
                ...(req.body.caption !== undefined && { caption: req.body.caption })
            };
            const createdGraphType = await createCustomGraphType(customGraphType);
            if (!createdGraphType) {
                throw new Error("Failed to create a custom graph");
            }
            return createdGraphType;
        },
    },

    /**
     * @swagger
     * /api/graphs/custom-graph-type:
     *   delete:
     *     summary: Delete a custom graph type
     *     description: Delete a custom graph type by graph ID.
     *     tags: 
     *       - Graphs API
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               graphId:
     *                 type: string
     *                 description: The ID of the graph to delete.
     *             required:
     *               - graphId
     *     parameters:
     *       - in: header
     *         name: servertoken
     *         schema:
     *           type: string
     *         required: true
     *         description: Server token for authentication.
     *     responses:
     *       '200':
 *         description: Custom graph type deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       '400':
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "You must specify a graph to delete!"
 *       '403':
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Project does not exist for client token"
 */
    DELETE: {
        config: {
            requireClientToken: false,
            requireServerToken: true
        },
        handler: async (req: Request) => {
            const { graphId } = req.body
            if (!graphId) {
                throw new Error("You must specify a graph to delete!")
            }
            const project = await getProjectByServerKey(req.headers.servertoken as string);
            if (project == null) {
                return null;
            }
            let deletedGraph = await deleteCustomGraphType(graphId, project?._id as string);
            return deletedGraph;
        },
    },

    /**
     * @swagger
     * /api/graphs/custom-graph-type:
     *   get:
     *     summary: Get custom graph types
     *     description: Retrieve custom graph types by project name and event type ID.
     *     tags: 
     *       - Graphs API
     *     parameters:
     *       - in: query
     *         name: projectName
     *         schema:
     *           type: string
     *         required: true
     *         description: The name of the project.
     *       - in: query
     *         name: eventTypeId
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the event type.
     *     responses:
     *       '200':
 *         description: Custom graph types retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CustomGraphType'
 *       '400':
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "You must specify a project and event type to get custom event types!"
 */
    GET: {
        config: {
            requireClientToken: false,
            requireServerToken: false
        },
        handler: async (req: Request) => {
            const { projectName, eventTypeId } = req.query;
            const projectId = await getProjectIDByName(projectName as string);

            if (!projectId || !eventTypeId) {
                throw new Error("You must specify a project and event type to get custom event types!")
            }
            let graphTypes = await getCustomGraphTypes(eventTypeId as string, projectId as string);
            return graphTypes;
        },
    },
});

export const customGraphType = relogRequestHandler(customGraphTypeRoute);
