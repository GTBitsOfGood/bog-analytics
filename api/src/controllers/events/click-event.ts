import { createClickEvent, paginatedGetClickEvents } from "@/src/actions/click-event";
import { getProjectByClientKey, getProjectByName, getProjectByServerKey, validatePrivateData } from "@/src/actions/project";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { HttpError } from "@/src/utils/http-error";
import { ClickEvent, EventEnvironment } from "@/src/utils/types";
import { Request } from "express";

/**
 * @swagger
 * /api/events/click-event:
 *   post:
 *     tags: 
 *       - Events API
 *     summary: Create a new click event.
 *     description: Creates a new click event based on specified parameters.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               objectId:
 *                 type: string
 *                 description: The ID of the object related to the click event.
 *               userId:
 *                 type: string
 *                 description: The ID of the user who triggered the click event.
 *               environment:
 *                 type: string
 *                 enum: [development, staging, production]
 *                 description: The environment for which to create the event.
 *             required:
 *               - objectId
 *               - userId
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
 *                   $ref: '#/components/schemas/ClickEvent'
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
 *                   example: "You must specify an object id and user id to create a click event!"
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
const clickEventRoute = APIWrapper({
    POST: {
        config: {
            requireClientToken: true,
        },
        handler: async (req: Request) => {
            const { objectId, userId, environment } = req.body;
            if (!objectId || !userId) {
                throw new Error("You must specify an object id and user id to create a click event!")
            }
            const project = await getProjectByClientKey(req.headers.clienttoken as string);

            if (!project) {
                throw new Error("Project does not exist for client token")
            }
            const event: Partial<ClickEvent> = {
                projectId: project._id,
                eventProperties: {
                    objectId,
                    userId
                },
                environment
            }

            const createdEvent = await createClickEvent(event);
            return createdEvent;
        },
    },
    /**
     * @swagger
     * /api/events/click-event:
     *   get:
     *     tags: 
     *       - Events API
     *     summary: Retrieve click events.
     *     description: Retrieves click events based on specified parameters. If the project data is private, a valid server token is required to access the data.
     *     parameters:
     *       - in: query
     *         name: afterId
     *         schema:
     *           type: string
     *         description: The ID of the event after which to start retrieving events.
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
     *                         $ref: '#/components/schemas/ClickEvent'
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
     */
    GET: {
        config: {
            requireClientToken: false,
        },
        handler: async (req: Request) => {
            const { afterId, projectName, environment } = req.query;
            const limit = req.query.limit ?? 10
            const afterTime = req.query.afterTime ? new Date(req.query.afterTime as string) : new Date(Date.now() - 60 * 60 * 24 * 30 * 1000)
            if (!projectName) {
                throw new Error("You must specify a project name!")
            }

            if (!(await validatePrivateData(projectName as string, (req.headers.servertoken as string | undefined)))) {
                throw new HttpError("This project's data is private. You need a server token to view it", 403)
            }

            const events: ClickEvent[] = await paginatedGetClickEvents(afterTime, afterId as string, parseInt(limit as string), projectName as string, environment as EventEnvironment);
            return {
                events,
                afterId: events.length ? events[events.length - 1]._id : null
            }

        },
    },
});

export const clickEvent = relogRequestHandler(clickEventRoute);
