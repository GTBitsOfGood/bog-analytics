import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { AnalyticsLogger, AnalyticsManager, GDPRManager } from '@/index';
import { ClickEvent, CustomEvent, ClickEventProperties, CustomEventType, EventEnvironment, HttpMethod, InputEventProperties, Project, VisitEvent, VisitEventProperties, InputEvent } from '@/utils/types';
import { externalRequest } from '@/utils/requests';
import { randomUUID } from "crypto";
import { urls } from '@/utils/urls';

describe('GDPR Manager Module', () => {
    let developmentLogger: AnalyticsLogger;
    let analyticsManager: AnalyticsManager;
    let gdprManager: GDPRManager;
    let project: Project;
    const EVENT_COUNT = 200;
    const USER_ID = "user 1";
    const OLD_OBJECT = "object 1"
    const NEW_OBJECT = "object 2"
    const OLD_PAGE = "/old-page"
    const NEW_PAGE = "/new-page"
    const OLD_TEXT_VALUE = "old text"
    const NEW_TEXT_VALUE = "new text"
    const USER_ATTRIBUTE = "userId"

    let clickEventProperties: ClickEventProperties = {
        objectId: OLD_OBJECT,
        userId: USER_ID
    }

    let visitEventProperties: VisitEventProperties = {
        pageUrl: OLD_PAGE,
        userId: USER_ID
    }

    let inputEventProperties: InputEventProperties = {
        objectId: OLD_OBJECT,
        userId: USER_ID,
        textValue: OLD_TEXT_VALUE
    }

    let customEventType: CustomEventType;


    beforeEach(async () => {
        developmentLogger = new AnalyticsLogger({ apiBaseUrl: "http://127.0.0.1:3001", environment: EventEnvironment.DEVELOPMENT })
        project = await externalRequest<Project>({
            url: "http://127.0.0.1:3001" + urls.project,
            method: HttpMethod.POST,
            body: {
                projectName: randomUUID()
            }
        })
        developmentLogger.authenticate(project.clientApiKey);

        analyticsManager = new AnalyticsManager({ apiBaseUrl: "http://127.0.0.1:3001" });
        analyticsManager.authenticate(project.serverApiKey);

        gdprManager = new GDPRManager({ apiBaseUrl: "http://127.0.0.1:3001" })
        gdprManager.authenticate(project.serverApiKey)

        customEventType = {
            category: "category 1",
            subcategory: "subcategory 1",
            properties: [
                "prop1",
                "prop2",
                USER_ATTRIBUTE
            ],
            projectId: project._id
        }

        await analyticsManager.defineCustomEvent(customEventType);

        for (let i = 0; i < EVENT_COUNT; i++) {
            await developmentLogger.logClickEvent(clickEventProperties);
            await developmentLogger.logVisitEvent(visitEventProperties);
            await developmentLogger.logInputEvent(inputEventProperties);
            await developmentLogger.logCustomEvent(customEventType.category, customEventType.subcategory, {
                "prop1": OLD_TEXT_VALUE,
                "prop2": OLD_TEXT_VALUE,
                "userId": USER_ID
            })
        }
    }, 100000)

    test("getAllUserClickEvents and deleteClickEventsForUser", async () => {
        let events = await gdprManager.getAllUserClickEvents(USER_ID);
        expect(events?.length).toEqual(EVENT_COUNT);

        await gdprManager.deleteClickEventsForUser(USER_ID);
        events = await gdprManager.getAllUserClickEvents(USER_ID);
        expect(events?.length).toEqual(0);
    }, 100000)

    test("getAllUserInputEvents and deleteInputEventsForUser", async () => {
        let events = await gdprManager.getAllUserInputEvents(USER_ID);
        expect(events?.length).toEqual(EVENT_COUNT);

        await gdprManager.deleteInputEventsForUser(USER_ID);
        events = await gdprManager.getAllUserInputEvents(USER_ID);
        expect(events?.length).toEqual(0);
    }, 100000)

    test("getAllUserVisitEvents and deleteVisitEventsForUser", async () => {
        let events = await gdprManager.getAllUserVisitEvents(USER_ID);
        expect(events?.length).toEqual(EVENT_COUNT);
        await gdprManager.deleteVisitEventsForUser(USER_ID);
        events = await gdprManager.getAllUserVisitEvents(USER_ID);
        expect(events?.length).toEqual(0);
    }, 100000)


    test("updateUserClickEvent", async () => {
        let events: ClickEvent[] = await gdprManager.getAllUserClickEvents(USER_ID) as ClickEvent[];
        expect(events?.length).toEqual(EVENT_COUNT);
        const eventId = events[0]._id;
        await gdprManager.updateUserClickEvent(eventId, USER_ID, NEW_OBJECT)

        events = await gdprManager.getAllUserClickEvents(USER_ID) as ClickEvent[];
        expect(events?.length).toEqual(EVENT_COUNT);


        let selectedEvent: ClickEvent | null = null;
        for (let i = 0; i < events.length; i++) {
            if (events[i]._id == eventId) {
                selectedEvent = events[i]
            }
        }
        expect(selectedEvent).not.toBe(null);
        expect(selectedEvent?.eventProperties.objectId).toEqual(NEW_OBJECT);
    })

    test("gdprUpdateVisitEvent", async () => {
        let events: VisitEvent[] = await gdprManager.getAllUserVisitEvents(USER_ID) as VisitEvent[];
        expect(events?.length).toEqual(EVENT_COUNT);
        const eventId = events[0]._id;
        await gdprManager.updateUserVisitEvent(eventId, USER_ID, NEW_PAGE)

        events = await gdprManager.getAllUserVisitEvents(USER_ID) as VisitEvent[];
        expect(events?.length).toEqual(EVENT_COUNT);


        let selectedEvent: VisitEvent | null = null;
        for (let i = 0; i < events.length; i++) {
            if (events[i]._id == eventId) {
                selectedEvent = events[i]
            }
        }
        expect(selectedEvent).not.toBe(null);
        expect(selectedEvent?.eventProperties.pageUrl).toEqual(NEW_PAGE);
    })

    test("gdprUpdateInputEvent", async () => {
        let events: InputEvent[] = await gdprManager.getAllUserInputEvents(USER_ID) as unknown as InputEvent[];
        expect(events?.length).toEqual(EVENT_COUNT);
        const eventId = events[0]._id;
        await gdprManager.updateUserInputEvent(eventId, USER_ID, NEW_OBJECT, NEW_TEXT_VALUE)

        events = await gdprManager.getAllUserInputEvents(USER_ID) as unknown as InputEvent[];
        expect(events?.length).toEqual(EVENT_COUNT);


        let selectedEvent: InputEvent | null = null;
        for (let i = 0; i < events.length; i++) {
            if (events[i]._id == eventId) {
                selectedEvent = events[i]
            }
        }
        expect(selectedEvent).not.toBe(null);
        expect(selectedEvent?.eventProperties.objectId).toEqual(NEW_OBJECT);
        expect(selectedEvent?.eventProperties.textValue).toEqual(NEW_TEXT_VALUE);
    })

    test("getAllUserCustomEvents and deleteCustomEventsForUser", async () => {
        let events = await gdprManager.getAllUserCustomEvents(USER_ID, USER_ATTRIBUTE, customEventType.category, customEventType.subcategory);
        expect(events?.length).toEqual(EVENT_COUNT);

        await gdprManager.deleteCustomEventsForUser(USER_ID, USER_ATTRIBUTE, customEventType.category, customEventType.subcategory);
        events = await gdprManager.getAllUserCustomEvents(USER_ID, USER_ATTRIBUTE, customEventType.category, customEventType.subcategory);
        expect(events?.length).toEqual(0);
    }, 100000)


    test("gdprUpdateCustomEvent", async () => {
        let events: CustomEvent[] = await gdprManager.getAllUserCustomEvents(USER_ID, USER_ATTRIBUTE, customEventType.category, customEventType.subcategory) as unknown as CustomEvent[];
        expect(events?.length).toEqual(EVENT_COUNT);
        const eventId = events[0]._id;
        await gdprManager.updateUserCustomEvent(eventId, USER_ID, USER_ATTRIBUTE, {
            prop1: NEW_TEXT_VALUE
        })

        events = await gdprManager.getAllUserCustomEvents(USER_ID, USER_ATTRIBUTE, customEventType.category, customEventType.subcategory) as unknown as CustomEvent[];
        expect(events?.length).toEqual(EVENT_COUNT);


        let selectedEvent: CustomEvent | null = null;
        for (let i = 0; i < events.length; i++) {
            if (events[i]._id == eventId) {
                selectedEvent = events[i]
            }
        }
        expect(selectedEvent).not.toBe(null);
        expect((selectedEvent?.properties as { [key: string]: string })['prop1']).toEqual(NEW_TEXT_VALUE);
        expect((selectedEvent?.properties as { [key: string]: string })['prop2']).toEqual(OLD_TEXT_VALUE);
    })

})