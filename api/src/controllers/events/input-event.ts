import { createInputEvent, paginatedGetInputEvents } from "@/src/actions/input-event";
import { getProjectByClientKey } from "@/src/actions/project";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { EventEnvironment, InputEvent } from "@/src/utils/types";
import { Request } from "express";

/**
 * @swagger
 * /api/events/input-event:
 *   post:
 *     tags: 
 *       - Events API
 *     summary: Create a new input event.
 *     description: Creates a new input event based on specified parameters.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               objectId:
 *                 type: string
 *                 description: The ID of the object related to the input event.
 *               userId:
 *                 type: string
 *                 description: The ID of the user who triggered the input event.
 *               textValue:
 *                 type: string
 *                 description: The text value associated with the input event.
 *               environment:
 *                 type: string
 *                 enum: [development, staging, production]
 *                 description: The environment for which to create the event.
 *             required:
 *               - objectId
 *               - userId
 *               - textValue
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
 *                   $ref: '#/components/schemas/InputEvent'
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
 *                   example: "You must specify an objectId, userId, and textValue!"
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
const inputEventRoute = APIWrapper({
    POST: {
        config: {
            requireClientToken: true,
        },
        handler: async (req: Request) => {
            const { objectId, userId, textValue, environment } = req.body;

            if (!objectId || !userId || !textValue) {
                throw new Error("You must specify an objectId, userId, and textValue!")
            }

            const project = await getProjectByClientKey(req.headers.clienttoken as string);

            if (!project) {
                throw new Error("Project does not exist for client token")
            }

            const event: Partial<InputEvent> = {
                projectId: project._id,
                eventProperties: {
                    objectId,
                    userId,
                    textValue
                },
                environment
            }

            const createdEvent = await createInputEvent(event);
            return createdEvent;
        },
    },
    /**
     * @swagger
     * /api/events/input-event:
     *   get:
     *     tags: 
     *       - Events API
     *     summary: Retrieve input events.
     *     description: Retrieves input events based on specified parameters.
     *     parameters:
     *       - in: query
     *         name: projectName
     *         schema:
     *           type: string
     *         required: true
     *         description: The name of the project for which to retrieve events.
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
     *         name: clienttoken
     *         schema:
     *           type: string
     *         required: false
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
     *                   type: object
     *                   properties:
     *                     events:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/InputEvent'
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
     *                   example: "You do not have permissions to access this API route"
     */
    GET: {
        config: {
            requireClientToken: false,
        },
        handler: async (req: Request) => {
            const { projectName, environment } = req.query;
            const limit = req.query.limit ?? 10
            const afterId = req.query.afterId;
            const afterTime = req.query.afterTime ? new Date(req.query.afterTime as string) : new Date(Date.now() - 60 * 60 * 24 * 30 * 1000)
            if (!projectName) {
                throw new Error("You must specify a project name!")
            }
            const events: InputEvent[] = await paginatedGetInputEvents(afterTime, afterId as string, parseInt(limit as string), projectName as string, environment as EventEnvironment);
            return {
                events,
                afterId: events.length ? events[events.length - 1]._id : null
            }
        },
    },
});

export const inputEvent = relogRequestHandler(inputEventRoute);
