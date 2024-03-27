/**
 * @swagger
 * /api/events/click-event:
 *   get:
 *     summary: Retrieve click events.
 *     description: Retrieves click events based on specified parameters.
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
 *           minimum: 1
 *           maximum: 100
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
 *                   example: "You do not have permissions to access this API route"
 */
