import { afterAll, beforeAll, describe, expect, test, afterEach } from '@jest/globals';
import request, { Test } from "supertest";
import { api } from "@/netlify/functions/api";
import { Project } from '@/src/utils/types';
import { deleteProjectById } from '@/src/actions/project';
import { Server, IncomingMessage, ServerResponse, get } from 'http';
import TestAgent from 'supertest/lib/agent';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { deleteInputEvents, getInputEvents, paginatedGetInputEvents } from '@/src/actions/input-event';

let testProject: Project | null = null;
let server: Server<typeof IncomingMessage, typeof ServerResponse>;
let agent: TestAgent<Test>;
let mongoMemoryInstance: MongoMemoryServer;
beforeAll(async () => {
    mongoMemoryInstance = await MongoMemoryServer.create();
    process.env.DATABASE_URL = mongoMemoryInstance.getUri();
    server = api.listen(942)
    agent = request.agent(server)
})

afterAll(async () => {
    await mongoMemoryInstance.stop()
    server.close()
})

describe("/api/events/input-event", () => {
    beforeAll(async () => {
        const response = await agent.post("/api/project").send({ projectName: "jest project" })
        expect(response.status).toBe(200)

        testProject = response.body.payload;
    })
    afterAll(async () => {
        await deleteProjectById(testProject?._id as string);
    });

    describe("POST /api/events/input-event", () => {
        const inputEventBadProperties = {
            objectId: "exampleObjectId",
            userId: "exampleUserId",
            environment: "development"
        };

        const inputEventProperties = {
            objectId: "exampleObjectId",
            userId: "exampleUserId",
            environment: "development",
            textValue: "exampleText"
        }

        afterEach(async () => {
            // Clean up input events
            await deleteInputEvents();
        })

        test("Create new input event with valid client token", async () => {
            const response = await agent
                .post("/api/events/input-event")
                .set("clienttoken", testProject?.clientApiKey as string)
                .send(inputEventProperties);
            expect(response.status).toBe(200);

            const events = await getInputEvents();
            expect(events.length).toEqual(1);

        });

        test("Create new input event without valid client token", async () => {
            const response = await agent
                .post("/api/events/input-event")
                .set("clienttoken", "invalid client token")
                .send(inputEventProperties);
            expect(response.status).toBe(403);


            const events = await getInputEvents();
            expect(events.length).toEqual(0);
        });
        test("Create input event without full properties", async () => {
            const response = await agent
                .post("/api/events/input-event")
                .set("clienttoken", testProject?.clientApiKey as string)
                .send(inputEventBadProperties);
            expect(response.status).toBe(400);


            const events = await getInputEvents();
            expect(events.length).toEqual(0);
        });
        test("Create multiple input events with different properties", async () => {
            const response = await agent
                .post("/api/events/input-event")
                .set("clienttoken", testProject?.clientApiKey as string)
                .send(inputEventProperties);
            expect(response.status).toBe(200);


            const events = await getInputEvents();
            expect(events.length).toEqual(1);

            let properties2 = {
                objectId: "exampleObjectId2",
                userId: "exampleUserId2",
                textValue: "exampleText2",
                environment: "development"
            }

            const response2 = await agent
                .post("/api/events/input-event")
                .set("clienttoken", testProject?.clientApiKey as string)
                .send(properties2);
            expect(response.status).toBe(200);

            const events2 = await getInputEvents();
            console.log(events2)
            expect(events2.length).toEqual(2);


        });
        test("Create multiple input events with same properties", async () => {
            const response = await agent
                .post("/api/events/input-event")
                .set("clienttoken", testProject?.clientApiKey as string)
                .send(inputEventProperties);
            expect(response.status).toBe(200);


            const events = await getInputEvents();
            expect(events.length).toEqual(1);


            const response2 = await agent
                .post("/api/events/input-event")
                .set("clienttoken", testProject?.clientApiKey as string)
                .send(inputEventProperties);
            expect(response.status).toBe(200);

            const events2 = await getInputEvents();
            console.log(events2)
            expect(events2.length).toEqual(2);


        });
        test("Create input events with invalid and valid properties", async () => {
            const response2 = await agent
                .post("/api/events/input-event")
                .set("clienttoken", testProject?.clientApiKey as string)
                .send(inputEventBadProperties);
            expect(response2.status).toBe(400);

            const events = await getInputEvents();
            expect(events.length).toEqual(0);


            const response = await agent
                .post("/api/events/input-event")
                .set("clienttoken", testProject?.clientApiKey as string)
                .send(inputEventProperties);
            expect(response.status).toBe(200);


            const events2 = await getInputEvents();
            console.log(events2)
            expect(events2.length).toEqual(1);
        });
    });
});
