import { afterAll, beforeAll, describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import request, { Test } from "supertest";
import { api } from "@/netlify/functions/api";
import { ClickEvent, Project, VisitEvent, InputEvent, CustomEvent } from '@/src/utils/types';
import { deleteProjectById } from '@/src/actions/project';
import { Server, IncomingMessage, ServerResponse } from 'http';
import TestAgent from 'supertest/lib/agent';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { deleteClickEvents, getClickEventsByUser } from '@/src/actions/click-event';
import { deleteVisitEvents, getVisitEventsByUser } from '@/src/actions/visit-event';
import { deleteInputEvents, getInputEventsByUser } from '@/src/actions/input-event';
import { deleteCustomEvents, getCustomEventsByUser } from '@/src/actions/custom-event';

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
        const clickEventProperties = {
            userId: "user 1",
            objectId: "object 1"
        }
        const EVENT_COUNT = 100;
        const newObjectId = "object 2"

        beforeEach(async () => {
            for (let i = 0; i < EVENT_COUNT; i++) {
                const response = await agent.post("/api/events/click-event")
                    .set("clienttoken", testProject?.clientApiKey as string)
                    .send(clickEventProperties)
                expect(response.status).toBe(200)
            }
        }, 100000)

        afterEach(async () => {
            await deleteClickEvents()
        })
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

        const inputEventProperties = {
            userId: "user 1",
            objectId: "object 1",
            textValue: "text 1"
        }
        const EVENT_COUNT = 100;
        const newObjectId = "object 2"
        const newTextValue = "text 2"

        beforeEach(async () => {
            for (let i = 0; i < EVENT_COUNT; i++) {
                const response = await agent.post("/api/events/input-event")
                    .set("clienttoken", testProject?.clientApiKey as string)
                    .send(inputEventProperties)
                expect(response.status).toBe(200)
            }
        }, 100000)

        afterEach(async () => {
            await deleteInputEvents()
        })
        test("DELETE /api/gdpr/input-event", async () => {
            const events = await getInputEventsByUser((testProject as Project)._id.toString(), inputEventProperties.userId);
            expect(events.length).toEqual(EVENT_COUNT)
            const response = await agent.delete("/api/gdpr/input-event")
                .set("servertoken", testProject?.serverApiKey as string)
                .send({ userId: inputEventProperties.userId })
            expect(response.status).toBe(200);
            const eventsDeleted = await getInputEventsByUser((testProject as Project)._id.toString(), inputEventProperties.userId);
            expect(eventsDeleted.length).toEqual(0)

        })

        test("GET /api/gdpr/input-event", async () => {
            let userEvents: InputEvent[] = []
            let afterId = null;
            while (true) {
                const response = await agent.get("/api/gdpr/input-event")
                    .set("servertoken", testProject?.serverApiKey as string)
                    .query({ afterId, userId: inputEventProperties.userId, limit: 50 })

                expect(response.status).toBe(200);
                userEvents = [...(userEvents as InputEvent[]), ...(response.body.payload.events as InputEvent[])]
                if (!response.body.payload.afterId) {
                    break;
                }
                afterId = response.body.payload.afterId;
            }

            expect(userEvents.length).toEqual(EVENT_COUNT);
        })

        test("PATCH /api/gdpr/input-event", async () => {
            let events = await getInputEventsByUser((testProject as Project)._id.toString(), inputEventProperties.userId);
            expect(events.length).toEqual(EVENT_COUNT)

            const eventId = events[0]._id;
            const response = await agent.patch("/api/gdpr/input-event")
                .set("servertoken", testProject?.serverApiKey as string)
                .send({ eventId, userId: inputEventProperties.userId, objectId: newObjectId, textValue: newTextValue })
            expect(response.status).toBe(200)
            events = await getInputEventsByUser((testProject as Project)._id.toString(), inputEventProperties.userId);

            let selectedEvent: InputEvent | null = null;
            for (let i = 0; i < events.length; i++) {
                if (events[i]._id.toString() === eventId.toString()) {
                    selectedEvent = events[i];
                }
            }
            expect(selectedEvent).not.toBe(null);
            expect(selectedEvent?.eventProperties.objectId).toEqual(newObjectId);
            expect(selectedEvent?.eventProperties.textValue).toEqual(newTextValue);

        })
    })
    describe("/api/gdpr/visit-event", () => {
        const visitEventProperties = {
            userId: "user 1",
            pageUrl: "/page"
        }
        const EVENT_COUNT = 100;
        const newPageUrl = "/new-page"

        beforeEach(async () => {
            for (let i = 0; i < EVENT_COUNT; i++) {
                const response = await agent.post("/api/events/visit-event")
                    .set("clienttoken", testProject?.clientApiKey as string)
                    .send(visitEventProperties)
                expect(response.status).toBe(200)
            }
        }, 100000)

        afterEach(async () => {
            await deleteVisitEvents()
        })
        test("DELETE /api/gdpr/visit-event", async () => {
            const events = await getVisitEventsByUser((testProject as Project)._id.toString(), visitEventProperties.userId);
            expect(events.length).toEqual(EVENT_COUNT)
            const response = await agent.delete("/api/gdpr/visit-event")
                .set("servertoken", testProject?.serverApiKey as string)
                .send({ userId: visitEventProperties.userId })
            expect(response.status).toBe(200);
            const eventsDeleted = await getVisitEventsByUser((testProject as Project)._id.toString(), visitEventProperties.userId);
            expect(eventsDeleted.length).toEqual(0)

        })

        test("GET /api/gdpr/visit-event", async () => {
            let userEvents: VisitEvent[] = []
            let afterId = null;
            while (true) {
                const response = await agent.get("/api/gdpr/visit-event")
                    .set("servertoken", testProject?.serverApiKey as string)
                    .query({ afterId, userId: visitEventProperties.userId, limit: 50 })

                expect(response.status).toBe(200);
                userEvents = [...(userEvents as VisitEvent[]), ...(response.body.payload.events as VisitEvent[])]
                if (!response.body.payload.afterId) {
                    break;
                }
                afterId = response.body.payload.afterId;
            }

            expect(userEvents.length).toEqual(EVENT_COUNT);
        })

        test("PATCH /api/gdpr/visit-event", async () => {
            let events = await getVisitEventsByUser((testProject as Project)._id.toString(), visitEventProperties.userId);
            expect(events.length).toEqual(EVENT_COUNT)

            const eventId = events[0]._id;
            const response = await agent.patch("/api/gdpr/visit-event")
                .set("servertoken", testProject?.serverApiKey as string)
                .send({ eventId, userId: visitEventProperties.userId, pageUrl: newPageUrl })
            expect(response.status).toBe(200)
            events = await getVisitEventsByUser((testProject as Project)._id.toString(), visitEventProperties.userId);

            let selectedEvent: VisitEvent | null = null;
            for (let i = 0; i < events.length; i++) {
                if (events[i]._id.toString() === eventId.toString()) {
                    selectedEvent = events[i];
                }
            }
            expect(selectedEvent).not.toBe(null);
            expect(selectedEvent?.eventProperties.pageUrl).toEqual(newPageUrl);

        })
    })

    describe("/api/gdpr/custom-event", () => {
        const EVENT_COUNT = 100;
        const USER_ID = "user 1"
        const USER_ATTRIBUTE = "user prop"
        const customEventType = {
            properties: ['prop1', USER_ATTRIBUTE, 'prop2'],
            category: 'category 1',
            subcategory: 'category 2'
        }
        const oldProps = {
            prop1: 'hello 1',
            [USER_ATTRIBUTE]: USER_ID,
            prop2: 'hello 1'
        }

        const updatedProps = {
            prop1: 'hello 2',

        }
        beforeEach(async () => {
            const response = await agent.post("/api/events/custom-event-type")
                .set("servertoken", testProject?.serverApiKey as string)
                .send(customEventType)

            for (let i = 0; i < EVENT_COUNT; i++) {
                const response = await agent.post("/api/events/custom-event")
                    .set("clienttoken", testProject?.clientApiKey as string)
                    .send({
                        category: customEventType.category, subcategory: customEventType.subcategory, properties: oldProps
                    })
                expect(response.status).toBe(200)
            }
        }, 100000)

        afterEach(async () => {
            await deleteCustomEvents();
        })

        test("DELETE /api/gdpr/custom-event", async () => {
            let events = await getCustomEventsByUser(USER_ATTRIBUTE, USER_ID);
            expect(events.length).toEqual(EVENT_COUNT);
            const response = await agent.delete("/api/gdpr/custom-event")
                .set("servertoken", testProject?.serverApiKey as string)
                .send({
                    userId: USER_ID,
                    userAttribute: USER_ATTRIBUTE,
                    eventCategory: customEventType.category,
                    eventSubcategory: customEventType.subcategory
                })
            expect(response.status).toBe(200)

            events = await getCustomEventsByUser(USER_ATTRIBUTE, USER_ID);
            expect(events.length).toEqual(0);

        })

        test("GET /api/gdpr/custom-event", async () => {
            let userEvents: CustomEvent[] = []
            let afterId = null;
            while (true) {
                const response = await agent.get("/api/gdpr/custom-event")
                    .set("servertoken", testProject?.serverApiKey as string)
                    .query({ afterId, userId: USER_ID, userAttribute: USER_ATTRIBUTE, eventCategory: customEventType.category, eventSubcategory: customEventType.subcategory, limit: 50 })

                expect(response.status).toBe(200);
                userEvents = [...(userEvents as CustomEvent[]), ...(response.body.payload.events as CustomEvent[])]
                if (!response.body.payload.afterId) {
                    break;
                }
                afterId = response.body.payload.afterId;
            }

            expect(userEvents.length).toEqual(EVENT_COUNT);

        })

        test("PATCH /api/gdpr/custom-event", async () => {
            let events = await getCustomEventsByUser(USER_ATTRIBUTE, USER_ID);
            expect(events.length).toEqual(EVENT_COUNT);

            const eventId = events[0]._id;
            const response = await agent.patch("/api/gdpr/custom-event")
                .set("servertoken", testProject?.serverApiKey as string)
                .send({ eventId, userId: USER_ID, userAttribute: USER_ATTRIBUTE, updatedAttributes: updatedProps })
            expect(response.status).toBe(200)

            events = await getCustomEventsByUser(USER_ATTRIBUTE, USER_ID);
            expect(events.length).toEqual(EVENT_COUNT);

            let selectedEvent: CustomEvent | null = null;
            for (let i = 0; i < events.length; i++) {
                if (events[i]._id.toString() === eventId.toString()) {
                    selectedEvent = events[i];
                }
            }
            expect(selectedEvent).not.toBe(null);
            expect(selectedEvent?.properties).not.toBe(null);
            expect((selectedEvent?.properties as { [key: string]: string })['prop1']).toEqual(updatedProps.prop1);
            expect((selectedEvent?.properties as { [key: string]: string })['prop2']).toEqual(oldProps.prop2);
        })
    })


})

