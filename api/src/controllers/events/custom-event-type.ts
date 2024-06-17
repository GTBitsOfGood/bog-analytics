import { createCustomEventType, getCustomEventTypesForProject, deleteCustomEventType, findEventTypeForProject } from "@/src/actions/custom-event-type";
import { getProjectIDByName } from "@/src/actions/project";
import { getProjectByServerKey } from "@/src/actions/project";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { CustomEventType } from "@/src/utils/types";
import { Request } from "express";

/**
 * @swagger
 * /api/events/custom-event-type:
 *   post:
 *     tags: 
 *       - Events API
 *     summary: Create a new custom event type.
 *     description: Creates a new custom event type based on specified parameters.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 description: The category of the custom event type.
 *               subcategory:
 *                 type: string
 *                 description: The subcategory of the custom event type.
 *               properties:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The properties of the custom event type.
 *             required:
 *               - category
 *               - subcategory
 *               - properties
 *     parameters:
 *       - in: header
 *         name: servertoken
 *         schema:
 *           type: string
 *         required: true
 *         description: Server token for authentication.
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 payload:
 *                   $ref: '#/components/schemas/CustomEventType'
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
 *                   example: "You must specify a category, subcategory, and properties to create a custom event type!"
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
const customEventTypeRoute = APIWrapper({
    POST: {
        config: {
            requireClientToken: false,
            requireServerToken: true
        },
        handler: async (req: Request) => {
            const { category, subcategory, properties } = req.body;
            if (!category || !subcategory || !properties) {
                throw new Error("You must specify a category, subcategory, and properties to create a custom event type!")
            }
            const project = await getProjectByServerKey(req.headers.servertoken as string);

            if (!project) {
                throw new Error("Project does not exist for client token")
            }
            const customEventType: Partial<CustomEventType> = {
                category: category,
                subcategory: subcategory,
                properties: properties,
                projectId: project._id
            }

            const preexistingEventType = await findEventTypeForProject(project._id, category, subcategory)
            if (preexistingEventType != null) {
                throw new Error("A custom event type with the same category and subcategory already exists")
            }

            const createdType = await createCustomEventType(customEventType);
            return createdType;
        },
    },
    /**
     * @swagger
     * /api/events/custom-event-type:
     *   get:
     *     tags: 
     *       - Events API
     *     summary: Retrieve custom event types.
     *     description: Retrieves custom event types for a specified project.
     *     parameters:
     *       - in: query
     *         name: projectName
     *         schema:
     *           type: string
     *         required: true
     *         description: The name of the project for which to retrieve custom event types.
     *       - in: header
     *         name: servertoken
     *         schema:
     *           type: string
     *         required: false
     *         description: Server token for authentication.
     *     responses:
     *       '200':
     *         description: Successful response.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/CustomEventType'
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
     *                   example: "You must specify a project to get custom event types!"
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
     *                   example: "Project does not exist"
     */
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
            const types = await getCustomEventTypesForProject(id.toString());
            return types;
        },
    },
    /**
     * @swagger
     * /api/events/custom-event-type:
     *   delete:
     *     tags: 
     *       - Events API
     *     summary: Delete a custom event type.
     *     description: Deletes a custom event type based on specified parameters.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               category:
     *                 type: string
     *                 description: The category of the custom event type to delete.
     *               subcategory:
     *                 type: string
     *                 description: The subcategory of the custom event type to delete.
     *             required:
     *               - category
     *               - subcategory
     *     parameters:
     *       - in: header
     *         name: servertoken
     *         schema:
     *           type: string
     *         required: true
     *         description: Server token for authentication.
     *     responses:
     *       '200':
     *         description: Successful response.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 payload:
     *                   type: object
     *                   properties:
     *                     message:
     *                       type: string
     *                       example: "Custom event type deleted successfully."
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
     *                   example: "You must specify a category and subcategory to delete custom event types!"
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
     *                   example: "Project does not exist"
     */
    DELETE: {
        config: {
            requireClientToken: false,
            requireServerToken: true
        },
        handler: async (req: Request) => {
            const { category, subcategory } = req.body
            if (!category || !subcategory) {
                throw new Error("You must specify a category and subcategory to delete custom event types!")
            }
            const project = await getProjectByServerKey(req.headers.servertoken as string);

            if (!project) {
                throw new Error("Project does not exist")
            }
            return await deleteCustomEventType(project._id.toString(), category, subcategory)
        },
    },
});

export const customEventType = relogRequestHandler(customEventTypeRoute);
