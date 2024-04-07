import { afterAll, beforeAll, describe, expect, test, afterEach } from '@jest/globals';
import request, { Test } from "supertest";
import { api } from "@/netlify/functions/api";
import { Project } from '@/src/utils/types';
import { deleteProjectById } from '@/src/actions/project';
import { Server, IncomingMessage, ServerResponse, get } from 'http';
import TestAgent from 'supertest/lib/agent';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { deleteAllCustomEventTypes, getCustomEventType, getCustomEventTypeID, getCustomEventTypesForProject, } from '@/src/actions/custom-event-type';

let testProject: Project | null = null;
let unchangedProject: Project | null = null;
let server: Server<typeof IncomingMessage, typeof ServerResponse>;
let agent: TestAgent<Test>;
let mongoMemoryInstance: MongoMemoryServer;
beforeAll(async () => {
    mongoMemoryInstance = await MongoMemoryServer.create();
    process.env.DATABASE_URL = mongoMemoryInstance.getUri();
    server = api.listen(941)
    agent = request.agent(server)
})

afterAll(async () => {
    await mongoMemoryInstance.stop()
    server.close()
})

describe("/api/events/custom-event", () => {
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

    describe("POST /api/events/custom-event", () => {
        const eventTypeDimProperties = {
            category: "exampleCategory",
            subcategory: "exampleSubcategory",
            properties: ["length", "width", "height"]
        }

        const eventDimProperties = {
            properties: { 
                length: 10,
                width: 20,
                height: 30
            }
        }

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
            expect(response.status).toBe(200);

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
            expect(response.status).toBe(200);

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
});
