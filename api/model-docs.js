/**
 * @swagger
 * components:
 *   schemas:
 *     ClickEvent:
 *       type: object
 *       properties:
 *         eventProperties:
 *           $ref: '#/components/schemas/ClickEventProperties'
 *         category:
 *           type: string
 *           description: The category of the event
 *         subcategory:
 *           type: string
 *           description: The subcategory of the event
 *         projectId:
 *           type: string
 *           description: The ID of the project related to the event
 *         environment:
 *           $ref: '#/components/schemas/EventEnvironment'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the event was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the event was last updated
 *     ClickEventProperties:
 *       type: object
 *       properties:
 *         objectId:
 *           type: string
 *           description: The ID of the object related to the click event
 *         userId:
 *           type: string
 *           description: The ID of the user who triggered the click event
 *     EventEnvironment:
 *       type: string
 *       enum:
 *         - development
 *         - staging
 *         - production
 */
