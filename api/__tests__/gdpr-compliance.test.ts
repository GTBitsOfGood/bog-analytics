import { afterAll, beforeAll, describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import request, { Test } from "supertest";
import { api } from "@/netlify/functions/api";
import { ClickEvent, Project } from '@/src/utils/types';
import { deleteProjectById } from '@/src/actions/project';
import { Server, IncomingMessage, ServerResponse } from 'http';
import TestAgent from 'supertest/lib/agent';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { deleteClickEvents, getClickEventsByUser } from '@/src/actions/click-event';

let testProject: Project | null = null;
let server: Server<typeof IncomingMessage, typeof ServerResponse>;
let agent: TestAgent<Test>;
let mongoMemoryInstance: MongoMemoryServer;
beforeAll(async () => {
    mongoMemoryInstance = await MongoMemoryServer.create();
    process.env.DATABASE_URL = mongoMemoryInstance.getUri();
    server = api.listen(3006)
    agent = request.agent(server)
})

afterAll(async () => {
    await mongoMemoryInstance.stop()
    server.close()
})

describe("/api/gdpr", () => {
    beforeAll(async () => {
        const response = await agent.post("/api/project").send({ projectName: "jest project" })
        expect(response.status).toBe(200)

        testProject = response.body.payload;
    })

    afterAll(async () => {
        await deleteProjectById(testProject?._id as string);
    });
    describe("/api/gdpr/click-event", () => {
        beforeEach(async () => {
            for (let i = 0; i < EVENT_COUNT; i++) {
                const response = await agent.post("/api/events/click-event")
                    .set("clienttoken", testProject?.clientApiKey as string)
                    .send(clickEventProperties)
                expect(response.status).toBe(200)
            }
        })

        afterEach(async () => {
            await deleteClickEvents()
        })
        const clickEventProperties = {
            userId: "user 1",
            objectId: "object 1"
        }
        const EVENT_COUNT = 100;
        const newObjectId = "object 2"
        test("DELETE /api/gdpr/click-event", async () => {
            const events = await getClickEventsByUser((testProject as Project)._id.toString(), clickEventProperties.userId);
            expect(events.length).toEqual(EVENT_COUNT)
            const response = await agent.delete("/api/gdpr/click-event")
                .set("servertoken", testProject?.serverApiKey as string)
                .send({ userId: clickEventProperties.userId })
            expect(response.status).toBe(200);
            const eventsDeleted = await getClickEventsByUser((testProject as Project)._id.toString(), clickEventProperties.userId);
            expect(eventsDeleted.length).toEqual(0)

        })

        test("GET /api/gdpr/click-event", async () => {
            let userEvents: ClickEvent[] = []
            let afterId = null;
            while (true) {
                const response = await agent.get("/api/gdpr/click-event")
                    .set("servertoken", testProject?.serverApiKey as string)
                    .query({ afterId, userId: clickEventProperties.userId, limit: 50 })

                expect(response.status).toBe(200);
                userEvents = [...(userEvents as ClickEvent[]), ...(response.body.payload.events as ClickEvent[])]
                if (!response.body.payload.afterId) {
                    break;
                }
                afterId = response.body.payload.afterId;
            }

            expect(userEvents.length).toEqual(EVENT_COUNT);
        })

        test("PATCH /api/gdpr/click-event", async () => {
            let events = await getClickEventsByUser((testProject as Project)._id.toString(), clickEventProperties.userId);
            expect(events.length).toEqual(EVENT_COUNT)

            const eventId = events[0]._id;
            const response = await agent.patch("/api/gdpr/click-event")
                .set("servertoken", testProject?.serverApiKey as string)
                .send({ eventId, userId: clickEventProperties.userId, objectId: newObjectId })
            expect(response.status).toBe(200)
            events = await getClickEventsByUser((testProject as Project)._id.toString(), clickEventProperties.userId);

            let selectedEvent: ClickEvent | null = null;
            for (let i = 0; i < events.length; i++) {
                if (events[i]._id.toString() === eventId.toString()) {
                    selectedEvent = events[i];
                }
            }
            expect(selectedEvent).not.toBe(null);
            expect(selectedEvent?.eventProperties.objectId).toEqual(newObjectId);

        })
    })
    describe("/api/gdpr/input-event", () => {

        test("DELETE /api/gdpr/input-event", async () => {

        })

        test("GET /api/gdpr/input-event", async () => {

        })

        test("PATCH /api/gdpr/input-event", async () => {

        })
    })
    describe("/api/gdpr/visit-event", () => {

        test("DELETE /api/gdpr/visit-event", async () => {

        })

        test("GET /api/gdpr/visit-event", async () => {

        })

        test("PATCH /api/gdpr/visit-event", async () => {

        })
    })
})

