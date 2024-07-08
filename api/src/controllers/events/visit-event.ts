import { createVisitEvent, paginatedGetVisitEvents } from "@/src/actions/visit-event";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { EventEnvironment, VisitEvent } from "@/src/utils/types";
import { Request } from "express";
import { getProjectByClientKey } from "@/src/actions/project";

/**
 * @swagger
 * /api/events/visit-event:
 *   post:
 *     tags: 
 *       - Events API
 *     summary: Create a new visit event.
 *     description: Creates a new visit event based on specified parameters.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageUrl:
 *                 type: string
 *                 description: The URL of the page visited.
 *               userId:
 *                 type: string
 *                 description: The ID of the user who visited the page.
 *               environment:
 *                 type: string
 *                 enum: [development, staging, production]
 *                 description: The environment for which to create the event.
 *             required:
 *               - pageUrl
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
 *                   $ref: '#/components/schemas/VisitEvent'
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
 *                   example: "You must specify a pageUrl and userId!"
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
const visitEventRoute = APIWrapper({
    POST: {
        config: {
            requireClientToken: true,
        },
        handler: async (req: Request) => {
            const { pageUrl, userId, environment } = req.body;

            if (!pageUrl || !userId) {
                throw new Error("You must specify a pageUrl and userId!")
            }
            const project = await getProjectByClientKey(req.headers.clienttoken as string);

            if (!project) {
                throw new Error("Project does not exist for client token")
            }

            const event: Partial<VisitEvent> = {
                projectId: project._id,
                eventProperties: {
                    pageUrl,
                    userId,
                },
                environment
            }

            const createdEvent = await createVisitEvent(event);
            return createdEvent;
        },
    },
    /**
     * @swagger
     * /api/events/visit-event:
     *   get:
     *     tags: 
     *       - Events API
     *     summary: Retrieve visit events.
     *     description: Retrieves visit events based on specified parameters.
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
     *                         $ref: '#/components/schemas/VisitEvent'
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
            const afterId = req.query.afterId as string;
            const afterTime = req.query.afterTime ? new Date(req.query.afterTime as string) : new Date(Date.now() - 60 * 60 * 24 * 30 * 1000)
            if (!projectName) {
                throw new Error("You must specify a project name!")
            }
            const events: VisitEvent[] = await paginatedGetVisitEvents(afterTime, afterId, parseInt(limit as string), projectName as string, environment as EventEnvironment);
            return {
                events,
                afterId: events.length ? events[events.length - 1]._id : null
            }
        },
    },
});

export const visitEvent = relogRequestHandler(visitEventRoute);
