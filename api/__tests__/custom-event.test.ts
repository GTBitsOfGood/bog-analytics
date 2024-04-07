import { afterAll, beforeAll, describe, expect, test, afterEach } from '@jest/globals';
import request, { Test } from "supertest";
import { api } from "@/netlify/functions/api";
import { Project } from '@/src/utils/types';
import { deleteProjectById } from '@/src/actions/project';
import { Server, IncomingMessage, ServerResponse, get } from 'http';
import TestAgent from 'supertest/lib/agent';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { deleteAllCustomEventTypes, getCustomEventType, getCustomEventTypeID, getCustomEventTypesForProject, } from '@/src/actions/custom-event-type';
import exp from 'constants';
import { getCustomEventsByProjectId, getCustomEventsByEventTypeId, deleteCustomEvents } from '@/src/actions/custom-event';
import { CustomEventType } from '@/src/utils/types';

let manyTypesProject: Project | null = null;
let colorProject: Project | null = null;
let unchangedProject: Project | null = null;
let manyColorType: CustomEventType | null = null;
let manyDimType: CustomEventType | null = null;
let oneColorType: CustomEventType | null = null;


let server: Server<typeof IncomingMessage, typeof ServerResponse>;
let agent: TestAgent<Test>;
let mongoMemoryInstance: MongoMemoryServer;
beforeAll(async () => {
    mongoMemoryInstance = await MongoMemoryServer.create();
    process.env.DATABASE_URL = mongoMemoryInstance.getUri();
    server = api.listen(944)
    agent = request.agent(server)
})

afterAll(async () => {
    await mongoMemoryInstance.stop()
    server.close()
})

describe("/api/events/custom-event", () => {
    beforeAll(async () => {
        const eventTypeDimProperties = {
            category: "Interaction",
            subcategory: "Resize",
            properties: ["length", "width", "height"]
        }
        const eventTypeColorProperties = {

            category: "Image",
            subcategory: "Visuals",
            properties: ["color", "pixels", "opacity"]
        }
        //project with color and dimension custom event types
        const response = await agent.post("/api/project").send({ projectName: "many types project" })
        expect(response.status).toBe(200)
        manyTypesProject = response.body.payload;
        const colorEventTypeResponse = await agent
            .post("/api/events/custom-event-type")
            .set("servertoken", manyTypesProject?.serverApiKey as string)
            .send(eventTypeColorProperties);
        expect(colorEventTypeResponse.status).toBe(200);
        const dimEventTypeResponse = await agent
            .post("/api/events/custom-event-type")
            .set("servertoken", manyTypesProject?.serverApiKey as string)
            .send(eventTypeDimProperties);
        expect(dimEventTypeResponse.status).toBe(200);
        const eventTypes = await getCustomEventTypesForProject(manyTypesProject?._id as string);
        expect(eventTypes.length).toEqual(2);

        manyColorType = colorEventTypeResponse.body.payload;
        manyDimType = dimEventTypeResponse.body.payload;
        //project with no custom event types
        const response2 = await agent.post("/api/project").send({ projectName: "unchanged project" })
        unchangedProject = response2.body.payload;
        expect(response2.status).toBe(200);
        const eventTypes2 = await getCustomEventTypesForProject(unchangedProject?._id as string);
        expect(eventTypes2.length).toEqual(0);

        //project with only color custom event type
        const response3 = await agent.post("/api/project").send({ projectName: "color project" })
        colorProject = response3.body.payload;
        const colorResponse = await agent
            .post("/api/events/custom-event-type")
            .set("servertoken", colorProject?.serverApiKey as string)
            .send(eventTypeColorProperties);
        expect(colorResponse.status).toBe(200);
        const eventTypes3 = await getCustomEventTypesForProject(colorProject?._id as string);
        expect(eventTypes3.length).toEqual(1);
        oneColorType = colorResponse.body.payload;

    })
    afterAll(async () => {
        await deleteProjectById(manyTypesProject?._id as string);
        await deleteProjectById(colorProject?._id as string);
        await deleteProjectById(unchangedProject?._id as string);
        await deleteAllCustomEventTypes();
    });

    describe("POST /api/events/custom-event", () => {

        const eventDimProperties = {
            properties: {
                length: 10,
                width: 20,
                height: 30
            }
        }
        const invalidDimProperties = {
            properties: {
                length: 10
            }
        }
        const eventColorProperties = {
            properties: {
                color: 0,
                pixels: 100,
                opacity: 0.5
            }
        }
        const invalidColorProperties = {
            properties: {
                color: "red",
                pixels: 100
            }

        }

        afterEach(async () => {
            // Clean up custom event types events
            await deleteCustomEvents();
        })
        test("Create new custom event2 with a valid client token", async () => {
            const response = await agent
                .post("/api/events/custom-event")
                .set("clienttoken", manyTypesProject?.clientApiKey as string)
                .send({
                    eventTypeId: manyColorType?._id,
                    properties: eventColorProperties.properties
                });
            expect(response.status).toBe(200);

            const events = await getCustomEventsByEventTypeId(manyColorType?._id as string);
            expect(events.length).toEqual(1);

            const events2 = await getCustomEventsByProjectId(manyTypesProject?._id as string);
            expect(events2.length).toEqual(1);

            const events3 = await getCustomEventsByProjectId(unchangedProject?._id as string);
            expect(events3.length).toEqual(0);
            const events4 = await getCustomEventsByProjectId(colorProject?._id as string);
            expect(events4.length).toEqual(0);
        });
        test("Create new custom event with a valid client token", async () => {
            const response = await agent
                .post("/api/events/custom-event")
                .set("clienttoken", manyTypesProject?.clientApiKey as string)
                .send({
                    eventTypeId: manyColorType?._id,
                    properties: eventColorProperties.properties
                });
            expect(response.status).toBe(200);

            const events = await getCustomEventsByEventTypeId(manyColorType?._id as string);
            expect(events.length).toEqual(1);

            const events2 = await getCustomEventsByProjectId(manyTypesProject?._id as string);
            expect(events2.length).toEqual(1);

            const events3 = await getCustomEventsByProjectId(unchangedProject?._id as string);
            expect(events3.length).toEqual(0);
            const events4 = await getCustomEventsByProjectId(colorProject?._id as string);
            expect(events4.length).toEqual(0);
        });
        test("Create new custom event type with invalid client token", async () => {
            const response = await agent
                .post("/api/events/custom-event")
                .set("clienttoken", "invalid client token")
                .send({
                    eventTypeId: manyColorType?._id,
                    properties: eventColorProperties.properties
                });
            expect(response.status).toBe(403);

            const events = await getCustomEventsByEventTypeId(manyColorType?._id as string);
            expect(events.length).toEqual(0);
        });
        test("Create new custom event type with a server token", async () => {
            const response = await agent
                .post("/api/events/custom-event")
                .set("servertoken", manyTypesProject?.serverApiKey as string)
                .send({
                    eventTypeId: manyColorType?._id,
                    properties: eventColorProperties.properties
                });
            expect(response.status).toBe(403);

            const events = await getCustomEventsByEventTypeId(manyColorType?._id as string);
            expect(events.length).toEqual(0);
        });
        test("Create custom events with different type properties", async () => {
            const response = await agent
                .post("/api/events/custom-event")
                .set("clienttoken", manyTypesProject?.clientApiKey as string)
                .send({
                    eventTypeId: manyColorType?._id,
                    properties: eventDimProperties.properties
                });
            expect(response.status).toBe(400);

            const events = await getCustomEventsByEventTypeId(manyColorType?._id as string);
            expect(events.length).toEqual(0);
        });
        test("Create custom events with invalid properties", async () => {
            const response = await agent
                .post("/api/events/custom-event")
                .set("clienttoken", manyTypesProject?.clientApiKey as string)
                .send({
                    eventTypeId: manyColorType?._id,
                });
            expect(response.status).toBe(400);

            const events = await getCustomEventsByEventTypeId(manyColorType?._id as string);
            expect(events.length).toEqual(0);
        });
        test("Create custom events for event types in different projects", async () => {
            const response = await agent
                .post("/api/events/custom-event")
                .set("clienttoken", manyTypesProject?.clientApiKey as string)
                .send({
                    eventTypeId: oneColorType?._id,
                    properties: eventColorProperties.properties
                });
            expect(response.status).toBe(400);

            const events = await getCustomEventsByEventTypeId(oneColorType?._id as string);
            expect(events.length).toEqual(0);
            const events2 = await getCustomEventsByEventTypeId(manyColorType?._id as string);
            expect(events2.length).toEqual(0);
        });
        test("Create multiple custom events for one project", async () => {
            const response = await agent
                .post("/api/events/custom-event")
                .set("clienttoken", manyTypesProject?.clientApiKey as string)
                .send({
                    eventTypeId: manyDimType?._id,
                    properties: eventDimProperties.properties
                });
            expect(response.status).toBe(200);

            const events = await getCustomEventsByEventTypeId(manyDimType?._id as string);
            expect(events.length).toEqual(1);

            const dimResponse = await agent
                .post("/api/events/custom-event")
                .set("clienttoken", manyTypesProject?.clientApiKey as string)
                .send({
                    eventTypeId: manyColorType?._id,
                    properties: eventColorProperties.properties
                });
            expect(dimResponse.status).toBe(200)
            const dimEvents = await getCustomEventsByEventTypeId(manyDimType?._id as string);
            expect(dimEvents.length).toEqual(1);
            const events2 = await getCustomEventsByProjectId(manyTypesProject?._id as string);
            expect(events2.length).toEqual(2);

            const events3 = await getCustomEventsByProjectId(unchangedProject?._id as string);
            expect(events3.length).toEqual(0);
            const events4 = await getCustomEventsByProjectId(colorProject?._id as string);
            expect(events4.length).toEqual(0);
        });
        test("Create custom events with invalid and valid properties", async () => {
            const response = await agent
                .post("/api/events/custom-event")
                .set("clienttoken", manyTypesProject?.clientApiKey as string)
                .send({
                    eventTypeId: manyColorType?._id,
                    properties: eventDimProperties.properties
                });
            expect(response.status).toBe(400);

            const events = await getCustomEventsByEventTypeId(manyColorType?._id as string);
            expect(events.length).toEqual(0);

            const colorResponse = await agent
                .post("/api/events/custom-event")
                .set("clienttoken", manyTypesProject?.clientApiKey as string)
                .send({
                    eventTypeId: manyColorType?._id,
                    properties: eventColorProperties.properties
                });
            expect(colorResponse.status).toBe(200);
            const colorEvents = await getCustomEventsByEventTypeId(manyColorType?._id as string);
            expect(colorEvents.length).toEqual(1);
        });
    });
});
