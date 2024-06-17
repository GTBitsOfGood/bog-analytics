import { getProjectByServerKey } from "@/src/actions/project";
import { updateVisitEventById, getVisitEventById, deleteVisitEventsByUserId, paginatedGetVisitEventsByUser } from "@/src/actions/visit-event";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { VisitEvent } from "@/src/utils/types";
import { Request } from "express";

// Realistically, these endpoints would only be used on the server side when we know a verified entity wants control over their analytics data
// So we require server token here instead of client token

/**
 * @swagger
 * /api/gdpr/visit-event:
 *   delete:
 *     summary: Delete visit events by user ID
 *     description: Delete all visit events associated with a specific user ID.
 *     tags:
 *       - GDPR API
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user whose events are to be deleted.
 *             required:
 *               - userId
 *     parameters:
 *       - in: header
 *         name: servertoken
 *         schema:
 *           type: string
 *         required: true
 *         description: Server token for authentication.
 *     responses:
 *       '200':
 *         description: Events deleted successfully.
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
 *                   example: "You must specify a user id to delete data for."
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
 *                   example: "Project with specified server token not found"
 */
const gdprVisitEventRoute = APIWrapper({
    DELETE: {
        config: {
            requireServerToken: true,
        },
        handler: async (req: Request) => {
            const { userId } = req.body;
            if (!userId) {
                throw new Error("You must specify a user id to delete data for.")
            }
            const project = await getProjectByServerKey(req.headers.servertoken as string);
            if (!project) {
                throw new Error("Project with specified server token not found");
            }
            return await deleteVisitEventsByUserId(project?._id.toString(), userId as string);
        },
    },

    /**
     * @swagger
     * /api/gdpr/visit-event:
     *   get:
     *     summary: Get visit events by user ID
     *     description: Retrieve paginated visit events associated with a specific user ID.
     *     tags:
     *       - GDPR API
     *     parameters:
     *       - in: query
     *         name: afterId
     *         schema:
     *           type: string
     *         description: The ID of the last event retrieved in the previous request.
     *       - in: query
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the user whose events are to be retrieved.
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 10
     *         description: The maximum number of events to retrieve.
     *       - in: header
     *         name: servertoken
     *         schema:
     *           type: string
     *         required: true
     *         description: Server token for authentication.
     *     responses:
     *       '200':
     *         description: Events retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 events:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/VisitEvent'
     *                 afterId:
     *                   type: string
     *                   description: The ID of the last event retrieved.
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
     *                   example: "You must specify a user id to get data for."
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
     *                   example: "Project with specified server token not found"
     */
    GET: {
        config: {
            requireServerToken: true,
        },
        handler: async (req: Request) => {
            const { afterId, userId } = req.query;
            if (!userId) {
                throw new Error("You must specify a user id to get data for.")
            }

            const limit = req.query.limit ?? 10;
            const project = await getProjectByServerKey(req.headers.servertoken as string);
            if (!project) {
                throw new Error("Project with specified server token not found");
            }
            const events: VisitEvent[] = await paginatedGetVisitEventsByUser(afterId as string, parseInt(limit as string), project._id.toString(), userId as string);
            return {
                events,
                afterId: events.length ? events[events.length - 1]._id : null
            };
        },
    },

    /**
     * @swagger
     * /api/gdpr/visit-event:
     *   patch:
     *     summary: Update a visit event by event ID
     *     description: Update the specified properties of a visit event.
     *     tags:
     *       - GDPR API
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               eventId:
     *                 type: string
     *                 description: The ID of the event to update.
     *               userId:
     *                 type: string
     *                 description: The ID of the user who owns the event.
     *               pageUrl:
     *                 type: string
     *                 description: The new page URL to set.
     *             required:
     *               - eventId
     *               - userId
     *               - pageUrl
     *     parameters:
     *       - in: header
     *         name: servertoken
     *         schema:
     *           type: string
     *         required: true
     *         description: Server token for authentication.
     *     responses:
     *       '200':
     *         description: Event updated successfully.
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
     *                   example: "You must specify a user id, page url, and event id to update an event."
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
     *                   example: "Project with specified server token not found"
     */
    PATCH: {
        config: {
            requireServerToken: true,
        },
        handler: async (req: Request) => {
            const { eventId, pageUrl, userId } = req.body;
            if (!eventId || !pageUrl || !userId) {
                throw new Error("You must specify a user id, page url, and event id to update an event.")
            }
            const event: VisitEvent | null = await getVisitEventById(eventId as string);

            if (!event) {
                throw new Error
                    ("No such event id exists for the specified event id");
            }

            if (event.eventProperties.userId !== userId) {
                throw new Error("This event does not belong to the specified user");
            }

            return await updateVisitEventById(eventId as string, pageUrl as string);
        },
    },
});

export const gdprVisitEvent = relogRequestHandler(gdprVisitEventRoute);
