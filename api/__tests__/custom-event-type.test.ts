import { afterAll, beforeAll, describe, expect, test, afterEach } from '@jest/globals';
import request, { Test } from "supertest";
import { api } from "@/netlify/functions/api";
import { CustomEventType, Project } from '@/src/utils/types';
import { deleteProjectById } from '@/src/actions/project';
import { Server, IncomingMessage, ServerResponse, get } from 'http';
import TestAgent from 'supertest/lib/agent';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { deleteAllCustomEventTypes, getCustomEventType, getCustomEventTypeID, getCustomEventTypesForProject, } from '@/src/actions/custom-event-type';
import { getCustomEventsByEventTypeId } from '@/src/actions/custom-event';
import { getCustomGraphTypes } from '@/src/actions/custom-graph-type';

let testProject: Project | null = null;
let unchangedProject: Project | null = null;
let server: Server<typeof IncomingMessage, typeof ServerResponse>;
let agent: TestAgent<Test>;
let mongoMemoryInstance: MongoMemoryServer;
beforeAll(async () => {
    mongoMemoryInstance = await MongoMemoryServer.create();
    process.env.DATABASE_URL = mongoMemoryInstance.getUri();
    server = api.listen(3001)
    agent = request.agent(server)
})

afterAll(async () => {
    await mongoMemoryInstance.stop()
    server.close()
})

describe("/api/events/custom-event-type", () => {
    beforeAll(async () => {
        const response = await agent.post("/api/project").send({ projectName: "jest project" })
        expect(response.status).toBe(200)
        testProject = response.body.payload;

        const response2 = await agent.post("/api/project").send({ projectName: "unchange project" })
        expect(response.status).toBe(200)
        unchangedProject = response2.body.payload;
    })
    afterAll(async () => {
        await deleteProjectById(testProject?._id as string);
        await deleteProjectById(unchangedProject?._id as string);

    });
    const invalidProperties = {
        category: "exampleCategory",
        subcategory: "exampleSubcategory",
        // properties: ["length", "width", "height"],
    };

    const validProperties = {
        category: "exampleCategory",
        subcategory: "exampleSubcategory",
        properties: ["length", "width", "height"]
    }
    describe("POST /api/events/custom-event-type", () => {

        afterEach(async () => {
            // Clean up custom event types events
            await deleteAllCustomEventTypes();
        })

        test("Create new custom event type with a valid server token", async () => {
            const response = await agent
                .post("/api/events/custom-event-type")
                .set("servertoken", testProject?.serverApiKey as string)
                .send(validProperties);
            expect(response.status).toBe(200);

            const events = await getCustomEventTypesForProject(testProject?._id as string);
            expect(events.length).toEqual(1);

        });
        test("Create new custom event type with invalid server token", async () => {
            const response = await agent
                .post("/api/events/custom-event-type")
                .set("servertoken", "invalid server token")
                .send(validProperties);
            expect(response.status).toBe(403);

            const events = await getCustomEventTypesForProject(testProject?._id as string);
            expect(events.length).toEqual(0);

        });
        test("Create new custom event type with a client token", async () => {
            const response = await agent
                .post("/api/events/custom-event-type")
                .set("clienttoken", testProject?.clientApiKey as string)
                .send(validProperties);
            expect(response.status).toBe(403);

            const events = await getCustomEventTypesForProject(testProject?._id as string);
            expect(events.length).toEqual(0);

        });

        test("Create new custom event type with an invalid client token", async () => {
            const response = await agent
                .post("/api/events/custom-event-type")
                .set("clienttoken", "invalid client token")
                .send(validProperties);
            expect(response.status).toBe(403);


            const events = await getCustomEventTypesForProject(testProject?._id as string);
            expect(events.length).toEqual(0);
        });
        test("Create custom event types with invalid properties", async () => {
            const response = await agent
                .post("/api/events/custom-event-type")
                .set("servertoken", testProject?.serverApiKey as string)
                .send(invalidProperties);
            expect(response.status).toBe(400);


            const events = await getCustomEventTypesForProject(testProject?._id as string);
            expect(events.length).toEqual(0);
        });
        test("Create multiple custom even types events with different properties", async () => {
            const response = await agent
                .post("/api/events/custom-event-type")
                .set("servertoken", testProject?.serverApiKey as string)
                .send(validProperties);
            expect(response.status).toBe(200);


            const events = await getCustomEventTypesForProject(testProject?._id as string);
            expect(events.length).toEqual(1);

            let properties2 = {
                category: "category2",
                subcategory: "subcategory2",
                properties: ["color", "pixels"]
            }

            const response2 = await agent
                .post("/api/events/custom-event-type")
                .set("servertoken", testProject?.serverApiKey as string)
                .send(properties2);
            expect(response2.status).toBe(200);

            const events2 = await getCustomEventTypesForProject(testProject?._id as string);
            expect(events2.length).toEqual(2);

            const unchangeProjectTypes = await getCustomEventTypesForProject(unchangedProject?._id as string);
            expect(unchangeProjectTypes.length).toEqual(0);

        });
        test("Create custom event types with preexisting properties", async () => {
            const response = await agent
                .post("/api/events/custom-event-type")
                .set("servertoken", testProject?.serverApiKey as string)
                .send(validProperties);
            expect(response.status).toBe(200);


            const events = await getCustomEventTypesForProject(testProject?._id as string);
            expect(events.length).toEqual(1);


            const response2 = await agent
                .post("/api/events/custom-event-type")
                .set("servertoken", testProject?.serverApiKey as string)
                .send(validProperties);
            expect(response2.status).toBe(400);

            const events2 = await getCustomEventTypesForProject(testProject?._id as string);
            expect(events2.length).toEqual(1);


        });
        test("Create custom event types with invalid and valid properties", async () => {
            const response2 = await agent
                .post("/api/events/custom-event-type")
                .set("servertoken", testProject?.serverApiKey as string)
                .send(invalidProperties);
            expect(response2.status).toBe(400);

            const events = await getCustomEventTypesForProject(testProject?._id as string);
            expect(events.length).toEqual(0);


            const response = await agent
                .post("/api/events/custom-event-type")
                .set("servertoken", testProject?.serverApiKey as string)
                .send(validProperties);
            expect(response.status).toBe(200);


            const events2 = await getCustomEventTypesForProject(testProject?._id as string);
            expect(events2.length).toEqual(1);
            const events3 = await getCustomEventTypesForProject(unchangedProject?._id as string);
            expect(events3.length).toEqual(0);
        });
        test("Create custom event types for a project without changing other projects", async () => {
            const response = await agent
                .post("/api/events/custom-event-type")
                .set("servertoken", testProject?.serverApiKey as string)
                .send(validProperties);
            expect(response.status).toBe(200);


            const testProjectEvents = await getCustomEventTypesForProject(testProject?._id as string);
            expect(testProjectEvents.length).toEqual(1);
            const events3 = await getCustomEventTypesForProject(unchangedProject?._id as string);
            expect(events3.length).toEqual(0);
        });
    });

    describe("GET /api/events/custom-event-type", () => {
        afterEach(async () => {
            await deleteAllCustomEventTypes();
        });


        test("Get with zero types", async () => {
            const response = await agent
                .get("/api/events/custom-event-type")
                .query({ projectName: testProject?.projectName })
            expect(response.status).toBe(200);
            const events = response.body.payload;
            expect(events.length).toEqual(0);

        });
        test("Get with one type", async () => {
            const validProperties = {
                category: "exampleCategory",
                subcategory: "exampleSubcategory",
                properties: ["length", "width", "height"]
            }
            const response = await agent
                .post("/api/events/custom-event-type")
                .set("servertoken", testProject?.serverApiKey as string)
                .send(validProperties);
            expect(response.status).toBe(200);
            const event = response.body.payload;


            const getResponse = await agent
                .get("/api/events/custom-event-type")
                .query({ projectName: testProject?.projectName })
            expect(getResponse.status).toBe(200);
            const types = getResponse.body.payload;
            expect(types.length).toEqual(1);
            expect(types[0]).toEqual(event);
        });
        test("Normal get with 15 types and 5 limit", async () => {
            //populate 15 events
            let batches: CustomEventType[] = [];
            for (let i = 0; i < 15; i++) {
                const validProperties = {
                    category: "exampleCategory" + i,
                    subcategory: "exampleSubcategory",
                    properties: ["length", "width", "height"]
                }
                const response = await agent
                    .post("/api/events/custom-event-type")
                    .set("servertoken", testProject?.serverApiKey as string)
                    .send(validProperties);
                const event = response.body.payload;
                batches.push(event);
            }

            let afterId = null;
            const getResponse = await agent
                .get("/api/events/custom-event-type")
                .query({ projectName: testProject?.projectName })
            expect(getResponse.status).toBe(200);
            const events = getResponse.body.payload;
            expect(events.length).toEqual(15);
            for (let j = 0; j < 15; j++) {
                expect(events[j]).toEqual(batches[j]);
            }
        });

    });
    describe("DELETE /api/events/custom-event-type", () => {
        afterEach(async () => {
            await deleteAllCustomEventTypes();
        });
        test("Delete custom event types with invalid server token", async () => {
            const response = await agent
                .post("/api/events/custom-event-type")
                .set("servertoken", testProject?.serverApiKey as string)
                .send({ ...validProperties });
            expect(response.status).toBe(200);

            const del = await agent
                .delete("/api/events/custom-event-type")
                .set("servertoken", "invalid server token")
                .send({ ...validProperties });
            expect(del.status).toBe(403);

            const events = await getCustomEventTypesForProject(testProject?._id as string);
            expect(events.length).toEqual(1);

        });
        test("Delete custom event type with valid server token", async () => {
            const response = await agent
                .post("/api/events/custom-event-type")
                .set("servertoken", testProject?.serverApiKey as string)
                .send({ category: "category", subcategory: "sub", properties: ["length", "width", "height"] });
            expect(response.status).toBe(200);
            const types = await getCustomEventTypesForProject(testProject?._id as string);
            expect(types.length).toEqual(1);

            const del = await agent
                .delete("/api/events/custom-event-type")
                .set("servertoken", testProject?.serverApiKey as string)
                .send({ category: "category", subcategory: "sub" });
            expect(del.status).toBe(200);

            const events = await getCustomEventTypesForProject(testProject?._id as string);
            expect(events.length).toEqual(0);

        });

        test("Delete custom event types with invalid properties", async () => {
            const response = await agent
                .post("/api/events/custom-event-type")
                .set("servertoken", testProject?.serverApiKey as string)
                .send({ ...validProperties });
            expect(response.status).toBe(200);

            const response2 = await agent
                .post("/api/events/custom-event-type")
                .set("servertoken", testProject?.serverApiKey as string)
                .send(invalidProperties);
            expect(response2.status).toBe(400);


            const events = await getCustomEventTypesForProject(testProject?._id as string);
            expect(events.length).toEqual(1);
        });
        test("Delete custom events associated with a type", async () => {
            const response = await agent
                .post("/api/events/custom-event-type")
                .set("servertoken", testProject?.serverApiKey as string)
                .send(validProperties);
            expect(response.status).toBe(200);
            const type = response.body.payload;

            const eventResponse = await agent
                .post("/api/events/custom-event")
                .set("clienttoken", testProject?.clientApiKey as string)
                .send({
                    eventTypeId: type?._id,
                    properties: {
                        length: 10, width: 20, height: 30
                    }
                });
            expect(eventResponse.status).toBe(200);

            const types = await getCustomEventTypesForProject(testProject?._id as string);
            expect(types.length).toEqual(1);

            const events = await getCustomEventsByEventTypeId(type?._id as string);
            expect(events.length).toEqual(1);

            const del = await agent
                .delete("/api/events/custom-event-type")
                .set("servertoken", testProject?.serverApiKey as string)
                .send({ ...validProperties });
            expect(del.status).toBe(200);

            const delEvents = await getCustomEventTypesForProject(testProject?._id as string);
            expect(delEvents.length).toEqual(0);

        });
        test("Delete custom graphs associated with a type", async () => {
            const response = await agent
                .post("/api/events/custom-event-type")
                .set("servertoken", testProject?.serverApiKey as string)
                .send(validProperties);
            expect(response.status).toBe(200);
            const type = response.body.payload;

            const eventResponse = await agent
                .post("/api/graphs/custom-graph-type")
                .set("servertoken", testProject?.serverApiKey as string)
                .send({
                    graphTitle: "Captioned Graph",
                    xProperty: "time",
                    yProperty: "viewers",
                    graphType: "bar",
                    eventTypeId: type?._id
                });
            expect(eventResponse.status).toBe(200);

            const types = await getCustomEventTypesForProject(testProject?._id as string);
            expect(types.length).toEqual(1);

            const events = await getCustomGraphTypes(type?._id as string, testProject?._id as string);
            expect(events.length).toEqual(1);

            const del = await agent
                .delete("/api/events/custom-event-type")
                .set("servertoken", testProject?.serverApiKey as string)
                .send({ ...validProperties });
            expect(del.status).toBe(200);

            const delEvents = await getCustomEventTypesForProject(testProject?._id as string);
            expect(delEvents.length).toEqual(0);

        });

        test("Delete custom event types for a project without changing other projects", async () => {
            const response = await agent
                .post("/api/events/custom-event-type")
                .set("servertoken", testProject?.serverApiKey as string)
                .send(validProperties);
            expect(response.status).toBe(200);
            const response2 = await agent
                .post("/api/events/custom-event-type")
                .set("servertoken", unchangedProject?.serverApiKey as string)
                .send(validProperties);
            expect(response.status).toBe(200);

            const testProjectEvents = await getCustomEventTypesForProject(testProject?._id as string);
            expect(testProjectEvents.length).toEqual(1);
            const otherProjectEvents = await getCustomEventTypesForProject(unchangedProject?._id as string);
            expect(otherProjectEvents.length).toEqual(1);


            const del = await agent
                .delete("/api/events/custom-event-type")
                .set("servertoken", testProject?.serverApiKey as string)
                .send({ ...validProperties });
            expect(del.status).toBe(200);
            const delEvents = await getCustomEventTypesForProject(testProject?._id as string);
            expect(delEvents.length).toEqual(0);


        });
    });

});
