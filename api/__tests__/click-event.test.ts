import { afterAll, beforeAll, describe, expect, test, afterEach } from '@jest/globals';
import request, { Test } from "supertest";
import { api } from "@/netlify/functions/api";
import { Project } from '@/src/utils/types';
import { deleteProjectById } from '@/src/actions/project';
import { Server, IncomingMessage, ServerResponse } from 'http';
import TestAgent from 'supertest/lib/agent';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { deleteClickEvents, getClickEvents } from '@/src/actions/click-event';

let testProject: Project | null = null;
let server: Server<typeof IncomingMessage, typeof ServerResponse>;
let agent: TestAgent<Test>;
let mongoMemoryInstance: MongoMemoryServer;
beforeAll(async () => {
    mongoMemoryInstance = await MongoMemoryServer.create();
    process.env.DATABASE_URL = mongoMemoryInstance.getUri();
    server = api.listen(9999)
    agent = request.agent(server)
})

afterAll(() => {
    mongoMemoryInstance.stop()
})

describe("/api/events/click-event", () => {
    beforeAll(async () => {
        const response = await agent.post("/api/project").send({ projectName: "jest project" })
        expect(response.status).toBe(200)

        testProject = response.body.payload;
    })
    afterAll(async () => {
        await deleteProjectById(testProject?._id as string);
    });

    describe("POST /api/events/click-event", () => {
        const clickEventProperties = {
            objectId: "exampleObjectId",
            userId: "exampleUserId",
            environment: "development"
        };

        afterEach(async () => {
            // Clean up click events
            await deleteClickEvents();
        })

        test("Create new click event with valid client token", async () => {
            const response = await agent
                .post("/api/events/click-event")
                .set("clienttoken", testProject?.clientApiKey as string)
                .send(clickEventProperties);
            expect(response.status).toBe(200);

            const events = await getClickEvents();
            expect(events.length).toEqual(1);

        });

        test("Create new click event without valid client token", async () => {
            const response = await agent
                .post("/api/events/click-event")
                .set("clienttoken", "invalid client token")
                .send(clickEventProperties);
            expect(response.status).toBe(403);


            const events = await getClickEvents();
            expect(events.length).toEqual(0);
        });
    });
});
