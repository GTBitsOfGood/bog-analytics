import {
    Document, Types
} from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     BaseEvent:
 *       type: object
 *       properties:
 *         category:
 *           type: string
 *           description: The category of the event
 *         subcategory:
 *           type: string
 *           description: The subcategory of the event
 *         projectId:
 *           oneOf:
 *             - type: string
 *             - type: object
 *               properties:
 *                 $ref: '#/components/schemas/ObjectId'
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
 */
export interface BaseEvent extends Document {
    category: string;
    subcategory: string;
    projectId: string | Types.ObjectId;
    environment: EventEnvironment;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     BaseEventWithoutCategory:
 *       type: object
 *       properties:
 *         projectId:
 *           oneOf:
 *             - type: string
 *             - type: object
 *               properties:
 *                 $ref: '#/components/schemas/ObjectId'
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
 */
export interface BaseEventWithoutCategory extends Document {
    projectId: string | Types.ObjectId;
    environment: EventEnvironment;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     VisitEvent:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEvent'
 *         - type: object
 *           properties:
 *             eventProperties:
 *               $ref: '#/components/schemas/VisitEventProperties'
 */
export interface VisitEvent extends BaseEvent {
    eventProperties: VisitEventProperties
}

/**
 * @swagger
 * components:
 *   schemas:
 *     VisitEventProperties:
 *       type: object
 *       properties:
 *         pageUrl:
 *           type: string
 *           description: The URL of the page visited
 *         userId:
 *           type: string
 *           description: The ID of the user who triggered the visit event
 */
export interface VisitEventProperties {
    pageUrl: string;
    userId: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     InputEvent:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEvent'
 *         - type: object
 *           properties:
 *             eventProperties:
 *               $ref: '#/components/schemas/InputEventProperties'
 */
export interface InputEvent extends BaseEvent {
    eventProperties: InputEventProperties
}

/**
 * @swagger
 * components:
 *   schemas:
 *     InputEventProperties:
 *       type: object
 *       properties:
 *         objectId:
 *           type: string
 *           description: The ID of the object related to the input event
 *         userId:
 *           type: string
 *           description: The ID of the user who triggered the input event
 *         textValue:
 *           type: string
 *           description: The text value entered by the user
 */
export interface InputEventProperties {
    objectId: string;
    userId: string;
    textValue: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ClickEvent:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEvent'
 *         - type: object
 *           properties:
 *             eventProperties:
 *               $ref: '#/components/schemas/ClickEventProperties'
 */
export interface ClickEvent extends BaseEvent {
    eventProperties: ClickEventProperties
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ClickEventProperties:
 *       type: object
 *       properties:
 *         objectId:
 *           type: string
 *           description: The ID of the object related to the click event
 *         userId:
 *           type: string
 *           description: The ID of the user who triggered the click event
 */
export interface ClickEventProperties {
    objectId: string;
    userId: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         _id:
 *           oneOf:
 *             - type: string
 *             - type: object
 *               properties:
 *                 $ref: '#/components/schemas/ObjectId'
 *         clientApiKey:
 *           type: string
 *           description: The client API key for the project
 *         serverApiKey:
 *           type: string
 *           description: The server API key for the project
 *         projectName:
 *           type: string
 *           description: The name of the project
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the project was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the project was last updated
 */
export interface Project {
    _id: string | Types.ObjectId;
    clientApiKey: string;
    serverApiKey: string;
    projectName: string;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CustomEventType:
 *       type: object
 *       properties:
 *         _id:
 *           oneOf:
 *             - type: string
 *             - type: object
 *               properties:
 *                 $ref: '#/components/schemas/ObjectId'
 *         category:
 *           type: string
 *           description: The category of the custom event type
 *         subcategory:
 *           type: string
 *           description: The subcategory of the custom event type
 *         properties:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of properties for the custom event type
 *         projectId:
 *           oneOf:
 *             - type: string
 *             - type: object
 *               properties:
 *                 $ref: '#/components/schemas/ObjectId'
 *           description: The ID of the project related to the custom event type
 */
export interface CustomEventType {
    _id: string | Types.ObjectId;
    category: string;
    subcategory: string;
    properties: string[]
    projectId: string | Types.ObjectId;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CustomEvent:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEventWithoutCategory'
 *         - type: object
 *           properties:
 *             eventTypeId:
 *               oneOf:
 *                 - type: string
 *                 - type: object
 *                   properties:
 *                     $ref: '#/components/schemas/ObjectId'
 *               description: The ID of the custom event type
 *             properties:
 *               type: object
 *               description: The properties of the custom event
 */
export interface CustomEvent extends BaseEventWithoutCategory {
    eventTypeId: string | Types.ObjectId;
    properties: object;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CustomGraphType:
 *       type: object
 *       properties:
 *         _id:
 *           oneOf:
 *             - type: string
 *             - type: object
 *               properties:
 *                 $ref: '#/components/schemas/ObjectId'
 *         eventTypeId:
 *           oneOf:
 *             - type: string
 *             - type: object
 *               properties:
 *                 $ref: '#/components/schemas/ObjectId'
 *         projectId:
 *           oneOf:
 *             - type: string
 *             - type: object
 *               properties:
 *                 $ref: '#/components/schemas/ObjectId'
 *         graphTitle:
 *           type: string
 *           description: The title of the graph
 *         xProperty:
 *           type: string
 *           description: The property to be plotted on the X-axis
 *         yProperty:
 *           type: string
 *           description: The property to be plotted on the Y-axis
 *         graphType:
 *           type: string
 *           enum:
 *             - bar
 *             - scatter
 *             - line
 *           description: The type of the graph
 *         caption:
 *           type: string
 *           description: The caption for the graph
 */
export interface CustomGraphType {
    _id: string | Types.ObjectId;
    eventTypeId: string | Types.ObjectId;
    projectId: string | Types.ObjectId;
    graphTitle: string;
    xProperty: string;
    yProperty: string;
    graphType: string;
    caption?: string;
}

export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PATCH = "PATCH",
    PUT = "PUT",
    DELETE = "DELETE",
}

export interface InternalRequestData {
    url: string;
    method: HttpMethod;
    body?: { [key: string]: unknown };
    queryParams?: { [key: string]: string | number | boolean | undefined };
    authRequired?: boolean;
}

export interface InternalResponseData<T> {
    success: boolean;
    message?: string;
    payload?: T;
}


export interface ExternalRequestData {
    url: string;
    method: HttpMethod;
    body?: { [key: string]: unknown };
    queryParams?: { [key: string]: string | number | boolean | undefined };
}


export interface ExternalResponseData<T> {
    success: boolean;
    message?: string;
    payload?: T;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     EventCategories:
 *       type: string
 *       enum:
 *         - Interaction
 *         - Activity
 *       description: The categories of events
 */
export enum EventCategories {
    INTERACTION = "Interaction",
    ACTIVITY = "Activity",
}

/**
 * @swagger
 * components:
 *   schemas:
 *     EventSubcategories:
 *       type: string
 *       enum:
 *         - Click
 *         - Visit
 *         - Input
 *       description: The subcategories of events
 */
export enum EventSubcategories {
    CLICK = "Click",
    VISIT = "Visit",
    INPUT = "Input",
}

/**
 * @swagger
 * components:
 *   schemas:
 *     GraphTypes:
 *       type: string
 *       enum:
 *         - bar
 *         - scatter
 *         - line
 *       description: The types of graphs
 */
export enum GraphTypes {
    BAR = "bar",
    SCATTER = "scatter",
    LINE = "line"
}

/**
 * @swagger
 * components:
 *   schemas:
 *     EventEnvironment:
 *       type: string
 *       enum:
 *         - development
 *         - staging
 *         - production
 *       description: The environment in which the event occurred
 */
export enum EventEnvironment {
    DEVELOPMENT = "development",
    STAGING = "staging",
    PRODUCTION = "production"
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ObjectId:
 *       type: string
 *       description: A unique identifier for objects
 */
