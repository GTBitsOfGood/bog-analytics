import { createCustomEvent, paginatedGetCustomEvents } from "@/src/actions/custom-event";
import { getCustomEventTypeID, findEventTypeForProjectByID, getCustomEventType } from "@/src/actions/custom-event-type";
import { getProjectIDByName, validatePrivateData } from "@/src/actions/project";
import { getProjectByClientKey } from "@/src/actions/project";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { CustomEvent, EventEnvironment } from "@/src/utils/types";
import { Request } from "express";

/**
 * @swagger
 * /api/events/custom-event:
 *   post:
 *     tags: 
 *       - Events API
 *     summary: Create a new custom event.
 *     description: Creates a new custom event based on specified parameters.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 description: The category of the custom event.
 *               subcategory:
 *                 type: string
 *                 description: The subcategory of the custom event.
 *               properties:
 *                 type: object
 *                 description: The properties associated with the custom event.
 *               environment:
 *                 type: string
 *                 enum: [development, staging, production]
 *                 description: The environment for which to create the event.
 *             required:
 *               - category
 *               - subcategory
 *               - properties
 *     parameters:
 *       - in: header
 *         name: clienttoken
 *         schema:
 *           type: string
 *         required: true
 *         description: Client token for authentication.
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
 *                   $ref: '#/components/schemas/CustomEvent'
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
 *                   example: "You must specify a category, subcategory, and properties to create a custom event!"
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
const customEventRoute = APIWrapper({
    POST: {
        config: {
            requireClientToken: true,
            requireServerToken: false
        },
        handler: async (req: Request) => {
            const { category, subcategory, properties, environment } = req.body;
            if (!category || !subcategory || !properties) {
                throw new Error("You must specify a category, subcategory, and properties to create a custom event!")
            }
            const project = await getProjectByClientKey(req.headers.clienttoken as string);
            if (!project) {
                throw new Error("Project does not exist for client token")
            }

            const eventType = await getCustomEventType(project._id.toString(), category, subcategory);
            if (!eventType) {
                throw new Error("Event type does not exist");
            }
            const event: Partial<CustomEvent> = {
                projectId: project._id,
                properties,
                eventTypeId: eventType._id,
                environment
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
                if (!has) {
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
    /**
     * @swagger
     * /api/events/custom-event:
     *   get:
     *     tags: 
     *       - Events API
     *     summary: Retrieve custom events.
     *     description: Retrieves custom events based on specified parameters. If the project data is private, a valid server token is required to access the data.
     *     parameters:
     *       - in: query
     *         name: projectName
     *         schema:
     *           type: string
     *         required: true
     *         description: The name of the project for which to retrieve events.
     *       - in: query
     *         name: category
     *         schema:
     *           type: string
     *         description: The category of the custom event.
     *       - in: query
     *         name: subcategory
     *         schema:
     *           type: string
     *         description: The subcategory of the custom event.
     *       - in: query
     *         name: environment
     *         schema:
     *           type: string
     *           enum: [development, staging, production]
     *         description: The environment for which to retrieve events.
     *       - in: query
     *         name: afterId
     *         schema:
     *           type: string
     *         description: The ID of the event after which to start retrieving events.
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *         description: The maximum number of events to retrieve. Defaults to 10.
     *       - in: query
     *         name: afterTime
     *         schema:
     *           type: string
     *           format: date-time
     *         description: The timestamp after which to start retrieving events.
     *       - in: header
     *         name: servertoken
     *         schema:
     *           type: string
     *         required: false
     *         description: Server token required for accessing private project data.
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
     *                     events:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/CustomEvent'
     *                       example: []
     *                     afterId:
     *                       type: string
     *                       nullable: true
     *                       example: "609cdd81c167df001c9548d6"
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
     *                   example: "You must specify a project name!"
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
     *                   example: "This project's data is private. You need a server token to view it."
     *       '404':
     *         description: Not Found.
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
     *                   example: "Project or event type does not exist."
     */
    GET: {
        config: {
            requireClientToken: false,
            requireServerToken: false
        },
        handler: async (req: Request) => {
            const { projectName, category, subcategory, environment } = req.query;
            if (!projectName) {
                throw new Error("You must specify a project name!")
            }
            const id = await getProjectIDByName(projectName as string);

            if (!id) {
                throw new Error("Project does not exist")
            }
            const eventType = await getCustomEventTypeID(id.toString(), category as string, subcategory as string);
            if (!eventType) {
                throw new Error("Event type does not exist");
            }

            if (!(await validatePrivateData(projectName as string, (req.headers.servertoken as string | undefined)))) {
                throw new Error("This project's data is private. You need a server token to view it")
            }

            const { afterId } = req.query;
            const limit = req.query.limit ?? 10
            const afterTime = req.query.afterTime ? new Date(req.query.afterTime as string) : new Date(Date.now() - 60 * 60 * 24 * 30 * 1000)
            const events = await paginatedGetCustomEvents(eventType.toString(), afterTime, afterId as string, parseInt(limit as string), environment as EventEnvironment);
            return {
                events,
                afterId: events.length ? events[events.length - 1]._id : null
            }
        },
    },

});

export const customEvent = relogRequestHandler(customEventRoute);
