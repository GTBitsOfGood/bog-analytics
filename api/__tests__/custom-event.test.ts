import { afterAll, beforeAll, describe, expect, test, afterEach } from '@jest/globals';
import request, { Test } from "supertest";
import { api } from "@/netlify/functions/api";
import { CustomEvent, Project } from '@/src/utils/types';
import { deleteProjectById } from '@/src/actions/project';
import { Server, IncomingMessage, ServerResponse, get } from 'http';
import TestAgent from 'supertest/lib/agent';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { deleteAllCustomEventTypes, getCustomEventType, getCustomEventTypeID, getCustomEventTypesForProject, } from '@/src/actions/custom-event-type';
import { getCustomEventsByProjectId, getCustomEventsByEventTypeId, deleteCustomEvents } from '@/src/actions/custom-event';
import { CustomEventType } from '@/src/utils/types';

let manyTypesProject: Project | null = null;
let colorProject: Project | null = null;
let unchangedProject: Project | null = null;
let privateTestProject: Project | null = null;
let manyColorType: CustomEventType | null = null;
let manyDimType: CustomEventType | null = null;
let oneColorType: CustomEventType | null = null;


let server: Server<typeof IncomingMessage, typeof ServerResponse>;
let agent: TestAgent<Test>;
let mongoMemoryInstance: MongoMemoryServer;
beforeAll(async () => {
    mongoMemoryInstance = await MongoMemoryServer.create();
    process.env.DATABASE_URL = mongoMemoryInstance.getUri();
    server = api.listen(3002)
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

        const responsePrivate = await agent.post("/api/project").send({ projectName: "private jest project", privateData: true })
        expect(responsePrivate.status).toBe(200)

        privateTestProject = responsePrivate.body.payload;
        const colorEventTypeResponsePrivate = await agent
            .post("/api/events/custom-event-type")
            .set("servertoken", privateTestProject?.serverApiKey as string)
            .send(eventTypeColorProperties);
        expect(colorEventTypeResponsePrivate.status).toBe(200);
        const dimEventTypeResponsePrivate = await agent
            .post("/api/events/custom-event-type")
            .set("servertoken", privateTestProject?.serverApiKey as string)
            .send(eventTypeDimProperties);
        expect(dimEventTypeResponsePrivate.status).toBe(200);
        const eventTypesPrivate = await getCustomEventTypesForProject(privateTestProject?._id as string);
        expect(eventTypesPrivate.length).toEqual(2);
    })
    afterAll(async () => {
        await deleteProjectById(manyTypesProject?._id as string);
        await deleteProjectById(colorProject?._id as string);
        await deleteProjectById(unchangedProject?._id as string);
        await deleteAllCustomEventTypes();
    });
    const eventDimProperties = {
        properties: {
            length: 10,
            width: 20,
            height: 30
        }
    }
    const eventColorProperties = {
        properties: {
            color: 0,
            pixels: 100,
            opacity: 0.5
        }
    }
    describe("POST /api/events/custom-event", () => {


        afterEach(async () => {
            // Clean up custom event types events
            await deleteCustomEvents();
        })
        test("Create new custom event with a valid client token", async () => {
            const response = await agent
                .post("/api/events/custom-event")
                .set("clienttoken", manyTypesProject?.clientApiKey as string)
                .send({
                    category: manyColorType?.category,
                    subcategory: manyColorType?.subcategory,
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
                    category: manyColorType?.category,
                    subcategory: manyColorType?.subcategory,
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
                    category: manyColorType?.category,
                    subcategory: manyColorType?.subcategory,
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
                    category: manyColorType?.category,
                    subcategory: manyColorType?.subcategory,
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
                    category: manyColorType?.category,
                    subcategory: manyColorType?.subcategory,
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
                    category: manyColorType?.category,
                    subcategory: manyColorType?.subcategory,
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
                    category: oneColorType?.category,
                    subcategory: oneColorType?.subcategory,
                    properties: eventColorProperties.properties
                });
            expect(response.status).toBe(200);

            const events = await getCustomEventsByEventTypeId(oneColorType?._id as string);
            expect(events.length).toEqual(0);
            const events2 = await getCustomEventsByEventTypeId(manyColorType?._id as string);
            expect(events2.length).toEqual(1);
        });
        test("Create multiple custom events for one project", async () => {
            const response = await agent
                .post("/api/events/custom-event")
                .set("clienttoken", manyTypesProject?.clientApiKey as string)
                .send({
                    category: manyDimType?.category,
                    subcategory: manyDimType?.subcategory,
                    properties: eventDimProperties.properties
                });
            expect(response.status).toBe(200);

            const events = await getCustomEventsByEventTypeId(manyDimType?._id as string);
            expect(events.length).toEqual(1);

            const dimResponse = await agent
                .post("/api/events/custom-event")
                .set("clienttoken", manyTypesProject?.clientApiKey as string)
                .send({
                    category: manyColorType?.category,
                    subcategory: manyColorType?.subcategory,
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
                    category: manyColorType?.category,
                    subcategory: manyColorType?.subcategory,
                    properties: eventDimProperties.properties
                });
            expect(response.status).toBe(400);

            const events = await getCustomEventsByEventTypeId(manyColorType?._id as string);
            expect(events.length).toEqual(0);

            const colorResponse = await agent
                .post("/api/events/custom-event")
                .set("clienttoken", manyTypesProject?.clientApiKey as string)
                .send({
                    category: manyColorType?.category,
                    subcategory: manyColorType?.subcategory,
                    properties: eventColorProperties.properties
                });
            expect(colorResponse.status).toBe(200);
            const colorEvents = await getCustomEventsByEventTypeId(manyColorType?._id as string);
            expect(colorEvents.length).toEqual(1);
        });
    });
    describe("GET /api/events/custom-event", () => {
        afterEach(async () => {
            await deleteCustomEvents();
        });

        test("Get pagination with zero events", async () => {
            const response = await agent
                .get("/api/events/custom-event")
                .query({ projectName: manyTypesProject?.projectName, category: "Image", subcategory: "Visuals" })
            expect(response.status).toBe(200);
            const events = response.body.payload.events;
            const afterId = response.body.payload.afterId;
            expect(events.length).toEqual(0);
            expect(afterId).toBeNull();

        });

        test("Get pagination with one event", async () => {
            const response = await agent
                .post("/api/events/custom-event")
                .set("clienttoken", manyTypesProject?.clientApiKey as string)
                .send({
                    category: manyColorType?.category,
                    subcategory: manyColorType?.subcategory,
                    properties: eventColorProperties.properties
                });
            expect(response.status).toBe(200);
            const event = response.body.payload;

            const getResponse = await agent
                .get("/api/events/custom-event")
                .query({ projectName: manyTypesProject?.projectName, category: "Image", subcategory: "Visuals" })
            expect(getResponse.status).toBe(200);
            const events = getResponse.body.payload.events;
            const afterId = getResponse.body.payload.afterId;
            expect(events.length).toEqual(1);
            expect(afterId).toEqual(event._id);
            expect(events[0]).toEqual(event);
        });
        test("Get pagination with mismatched categories", async () => {
            const response = await agent
                .post("/api/events/custom-event")
                .set("clienttoken", manyTypesProject?.clientApiKey as string)
                .send({
                    category: manyColorType?.category,
                    subcategory: manyColorType?.subcategory,
                    properties: eventColorProperties.properties
                });
            expect(response.status).toBe(200);
            const event = response.body.payload;

            const getResponse = await agent
                .get("/api/events/custom-event")
                .query({ projectName: manyTypesProject?.projectName, category: "Interaction", subcategory: "Resize" })
            expect(getResponse.status).toBe(200);
            const events = getResponse.body.payload.events;
            const afterId = getResponse.body.payload.afterId;
            expect(events.length).toEqual(0);
        });
        test("Normal pagination with 15 event and 5 limit", async () => {
            //populate 15 events
            let batches: CustomEvent[] = [];
            for (let i = 0; i < 15; i++) {
                let eventColorProperties = {
                    properties: {
                        color: i,
                        pixels: 100,
                        opacity: 0.5
                    }
                }
                const response = await agent
                    .post("/api/events/custom-event")
                    .set("clienttoken", manyTypesProject?.clientApiKey as string)
                    .send({
                        category: manyColorType?.category,
                        subcategory: manyColorType?.subcategory,
                        properties: eventColorProperties.properties
                    });
                expect(response.status).toBe(200);
                const event = response.body.payload;
                batches.push(event);
            }

            let afterId = null;
            for (let i = 0; i < 3; i++) {
                const getResponse = await agent
                    .get("/api/events/custom-event")
                    .query({ projectName: manyTypesProject?.projectName, category: "Image", subcategory: "Visuals", limit: 5, afterId })
                expect(getResponse.status).toBe(200);
                const events = getResponse.body.payload.events;
                afterId = getResponse.body.payload.afterId;
                expect(events.length).toEqual(5);
                for (let j = 0; j < 5; j++) {
                    expect(events[j]).toEqual(batches[i * 5 + j]);
                }
                expect(afterId).toEqual(batches[i * 5 + 4]._id);

            }
        });
        test("Pagination with 15 event and 4 limit", async () => {
            //populate 15 events
            let batches: CustomEvent[] = [];
            for (let i = 0; i < 15; i++) {
                let eventColorProperties = {
                    properties: {
                        color: i,
                        pixels: 100,
                        opacity: 0.5
                    },
                    category: manyColorType?.category,
                    subcategory: manyColorType?.subcategory,
                }
                const response = await agent
                    .post("/api/events/custom-event")
                    .set("clienttoken", manyTypesProject?.clientApiKey as string)
                    .send(eventColorProperties);
                expect(response.status).toBe(200);
                const event = response.body.payload;
                batches.push(event);
            }

            let afterId = null;
            let id = null;
            for (let i = 0; i < 3; i++) {
                afterId = id;
                const resp = await agent
                    .get("/api/events/custom-event")
                    .query({ limit: 4, afterId, projectName: manyTypesProject?.projectName, category: "Image", subcategory: "Visuals", environment: "development" })
                expect(resp.status).toBe(200);
                const events = resp.body.payload.events;
                id = resp.body.payload.afterId;
                let length = Math.min(4, 15 - i * 4)
                expect(events.length).toEqual(length);
                expect(id).toEqual(batches[i * 4 + length - 1]._id);
                for (let j = 0; j < length; j++) {
                    expect(events[j]).toEqual(batches[i * 4 + j]);
                }
            }
        });
        test("Pagination with after time greater than all times", async () => {
            //populate 15 events
            let batches: CustomEvent[] = [];
            for (let i = 0; i < 15; i++) {
                let eventColorProperties = {
                    properties: {
                        color: i,
                        pixels: 100,
                        opacity: 0.5
                    },
                    category: manyColorType?.category,
                    subcategory: manyColorType?.subcategory,
                }
                const response = await agent
                    .post("/api/events/custom-event")
                    .set("clienttoken", manyTypesProject?.clientApiKey as string)
                    .send(eventColorProperties);
                expect(response.status).toBe(200);
                const event = response.body.payload;
                batches.push(event);
            }

            let afterId = null;
            const getResponse = await agent
                .get("/api/events/custom-event")
                .query({
                    limit: 4, afterId, projectName: manyTypesProject?.projectName, category: "Interaction", subcategory: "Resize",
                })
            expect(getResponse.status).toBe(200);
            const events = getResponse.body.payload.events;
            afterId = getResponse.body.payload.afterId;
            expect(events.length).toEqual(0);
            expect(afterId).toBeNull();
        });

        test("Get events of private project without server key", async () => {
            const response = await agent
                .post("/api/events/custom-event")
                .set("clienttoken", privateTestProject?.clientApiKey as string)
                .send({
                    category: manyColorType?.category,
                    subcategory: manyColorType?.subcategory,
                    properties: eventColorProperties.properties
                });
            expect(response.status).toBe(200);

            const getResponse = await agent
                .get("/api/events/custom-event")
                .query({ projectName: privateTestProject?.projectName })

            expect(getResponse.status).toBe(400);
        })

        test("Get events of private project with server key", async () => {
            const response = await agent
                .post("/api/events/custom-event")
                .set("clienttoken", privateTestProject?.clientApiKey as string)
                .send({
                    category: manyColorType?.category,
                    subcategory: manyColorType?.subcategory,
                    properties: eventColorProperties.properties
                });
            expect(response.status).toBe(200);

            const getResponse = await agent
                .get("/api/events/custom-event")
                .query({
                    projectName: privateTestProject?.projectName,
                    category: manyColorType?.category,
                    subcategory: manyColorType?.subcategory,
                })
                .set("servertoken", privateTestProject?.serverApiKey as string)

            expect(getResponse.status).toBe(200);
        })

    });
});
