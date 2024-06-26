import { deleteCustomEventsByUserId, getCustomEventById, paginatedGetCustomEventsByUser, updateCustomEventById } from "@/src/actions/custom-event";
import { findEventTypeForProject } from "@/src/actions/custom-event-type";
import { getProjectByServerKey } from "@/src/actions/project";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { CustomEvent } from "@/src/utils/types";
import { Request } from "express";

// Realistically, these endpoints would only be used on the server side when we know a verified entity wants control over their analytics data
// So we require server token here instead of client token

/**
 * @swagger
 * /api/gdpr/custom-event:
 *   delete:
 *     tags: 
 *       - GDPR API
 *     summary: Delete custom events by user ID.
 *     description: Deletes all custom events associated with a specific user ID and event type.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user whose custom events should be deleted.
 *               userAttribute:
 *                 type: string
 *                 description: The attribute of the user in the event type.
 *               category:
 *                 type: string
 *                 description: The category of the event.
 *               subcategory:
 *                 type: string
 *                 description: The subcategory of the event.
 *             required:
 *               - userId
 *               - userAttribute
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
 *                   example: "Custom events deleted successfully."
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
 *                   example: "You must specify an event category, event subcategory, user id, and user attribute to delete data for."
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
const gdprCustomEventRoute = APIWrapper({
    DELETE: {
        config: {
            requireServerToken: true,
        },
        handler: async (req: Request) => {
            const { userId, userAttribute, category, subcategory } = req.body;
            if (!userId || !userAttribute || !category || !subcategory) {
                throw new Error("You must specify an event category, event subcategory, user id, and user attribute to delete data for.");
            }
            const project = await getProjectByServerKey(req.headers.servertoken as string);
            if (!project) {
                throw new Error("Project with specified server token not found");
            }
            const eventType = await findEventTypeForProject(project._id.toString(), category, subcategory);
            if (!eventType) {
                throw new Error("Event type for specified category and subcategory does not exist");
            }

            if (!eventType.properties.includes(userAttribute)) {
                throw new Error("Specified user attribute is not a property of the event type");
            }
            return await deleteCustomEventsByUserId(project._id.toString(), userId as string, eventType._id.toString(), userAttribute as string);
        },
    },

    /**
     * @swagger
     * /api/gdpr/custom-event:
     *   get: 
     *     tags: 
     *       - GDPR API
     *     summary: Retrieve custom events by user ID.
     *     description: Retrieves custom events for a specific user ID.
     *     parameters:
     *       - in: query
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the user whose custom events should be retrieved.
     *       - in: query
     *         name: userAttribute
     *         schema:
     *           type: string
     *         required: true
     *         description: The attribute of the user in the event type.
     *       - in: query
     *         name: category
     *         schema:
     *           type: string
     *         required: true
     *         description: The category of the event.
     *       - in: query
     *         name: subcategory
     *         schema:
     *           type: string
     *         required: true
     *         description: The subcategory of the event.
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
     *                   example: "You must specify a user id, user attribute, event category, and event subcategory to get data for."
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
            const { afterId, userId, userAttribute, category, subcategory } = req.query;
            if (!userId || !userAttribute || !category || !subcategory) {
                throw new Error("You must specify a user id, user attribute, event category, and event subcategory to get data for.");
            }

            const limit = req.query.limit ?? 10;
            const project = await getProjectByServerKey(req.headers.servertoken as string);
            if (!project) {
                throw new Error("Project with specified server token not found");
            }
            const eventType = await findEventTypeForProject(project._id.toString(), category as string, subcategory as string);
            if (!eventType) {
                throw new Error("Event type for specified category and subcategory does not exist");
            }

            const events: CustomEvent[] = await paginatedGetCustomEventsByUser(afterId as string, parseInt(limit as string), project._id.toString(), eventType._id.toString(), userAttribute as string, userId as string);
            return {
                events,
                afterId: events.length ? events[events.length - 1]._id : null
            };
        },
    },

    /**
     * @swagger
     * /api/gdpr/custom-event:
     *   patch:
     *     tags: 
     *       - GDPR API
     *     summary: Update a custom event by ID.
     *     description: Updates a specific custom event by its ID, ensuring the user ID is immutable.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *
 *               eventId:
 *                 type: string
 *                 description: The ID of the event to update.
 *               userId:
 *                 type: string
 *                 description: The ID of the user who owns the event.
 *               userAttribute:
 *                 type: string
 *                 description: The attribute of the user in the event type.
 *               updatedAttributes:
 *                 type: object
 *                 description: The attributes to update in the event.
 *             required:
 *               - eventId
 *               - userId
 *               - userAttribute
 *               - updatedAttributes
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
 *                   example: "You must specify a user id, object id, user attribute, and event id to update an event."
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
            const { eventId, userId, userAttribute, updatedAttributes } = req.body;
            if (!eventId || !userId || !userAttribute || !updatedAttributes) {
                throw new Error("You must specify a user id, object id, user attribute, and event id to update an event.");
            }
            const event: CustomEvent | null = await getCustomEventById(eventId as string);

            if (!event) {
                throw new Error("No such event id exists for the specified event id");
            }

            const eventAttributes = Object.keys(event.properties);
            if (!eventAttributes.includes(userAttribute)) {
                throw new Error("Specified user attribute is not a property of the event type");
            }

            if ((event.properties as { [key: string]: string | number | boolean | undefined })[`${userAttribute as string}`] !== userId) {
                throw new Error("This event does not belong to the specified user");
            }

            if (Object.keys(updatedAttributes).includes(userAttribute)) {
                throw new Error("You cannot update the user attribute");
            }
            const updateAttributeKeys = Object.keys(updatedAttributes);
            const nonExistentKeys = updateAttributeKeys.filter(key => !event.properties.hasOwnProperty(key));

            if (nonExistentKeys.length > 0) {
                throw new Error("Updated attributes include keys that do not exist on the event type");
            }

            const updatedEvent = await updateCustomEventById(eventId as string, { ...event.properties, ...updatedAttributes } as object);
            return updatedEvent;
        }
    }
});

export const gdprCustomEvent = relogRequestHandler(gdprCustomEventRoute);
