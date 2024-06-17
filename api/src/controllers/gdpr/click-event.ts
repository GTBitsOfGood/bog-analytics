import { deleteClickEventsByUserId, getClickEventById, paginatedGetClickEventsByUser, updateClickEventById } from "@/src/actions/click-event";
import { getProjectByServerKey } from "@/src/actions/project";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { ClickEvent } from "@/src/utils/types";
import { Request } from "express";

/**
 * @swagger
 * /api/gdpr/click-event:
 *   delete:
 *     tags: 
 *       - GDPR API
 *     summary: Delete click events by user ID.
 *     description: Deletes all click events associated with a specific user ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user whose click events should be deleted.
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
 *         description: Successful deletion.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Click events deleted successfully."
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
const gdprClickEventRoute = APIWrapper({
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
            return await deleteClickEventsByUserId(project?._id.toString(), userId as string);
        },
    },

    /**
     * @swagger
     * /api/gdpr/click-event:
     *   get:
     *     tags: 
     *       - GDPR API
     *     summary: Retrieve click events by user ID.
     *     description: Retrieves click events for a specific user ID.
     *     parameters:
     *       - in: query
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the user whose click events should be retrieved.
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

            const limit = req.query.limit ?? 10
            const project = await getProjectByServerKey(req.headers.servertoken as string);
            if (!project) {
                throw new Error("Project with specified server token not found");
            }
            const events: ClickEvent[] = await paginatedGetClickEventsByUser(afterId as string, parseInt(limit as string), project._id.toString(), userId as string);
            return {
                events,
                afterId: events.length ? events[events.length - 1]._id : null
            }

        },
    },

    /**
     * @swagger
     * /api/gdpr/click-event:
     *   patch:
     *     tags: 
     *       - GDPR API
     *     summary: Update a click event by ID.
     *     description: Updates a specific click event by its ID, ensuring the user ID is immutable.
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
     *               objectId:
     *                 type: string
     *                 description: The new object ID for the event.
     *               userId:
     *                 type: string
     *                 description: The ID of the user who owns the event.
     *             required:
     *               - eventId
     *               - objectId
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
     *         description: Successful update.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: "Click event updated successfully."
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
     *                   example: "You must specify a user id, object id, and event id to update an event."
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
     *                   example: "This event does not belong to the specified user"
     */
    PATCH: {
        config: {
            requireServerToken: true,
        },
        handler: async (req: Request) => {
            const { eventId, objectId, userId } = req.body;
            if (!eventId || objectId === null || objectId === undefined || !userId) {
                throw new Error("You must specify a user id, object id, and event id to update an event.")
            }
            const event: ClickEvent | null = await getClickEventById(eventId as string);

            if (!event) {
                throw new Error("No such event id exists for the specified event id");
            }

            if (event.eventProperties.userId !== userId) {
                throw new Error("This event does not belong to the specified user");
            }

            return await updateClickEventById(eventId as string, objectId as string);
        },
    }
});

export const gdprClickEvent = relogRequestHandler(gdprClickEventRoute);
