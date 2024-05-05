import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { AnalyticsLogger, AnalyticsManager, AnalyticsViewer } from '@/index';
import { externalRequest } from '@/utils/requests';
import { urls } from '@/utils/urls';
import { ClickEventProperties, CustomEventType, EventEnvironment, HttpMethod, InputEventProperties, Project, VisitEventProperties } from '@/utils/types';
import { randomUUID } from "crypto";

describe('Analytics Logger Module', () => {
    let developmentLogger: AnalyticsLogger;
    let analyticsManager: AnalyticsManager;
    let analyticsViewer: AnalyticsViewer;
    let project: Project;

    const EVENT_COUNT = 200;
    const PAGINATE_COUNT = 10;

    let clickEventProperties: ClickEventProperties = {
        objectId: "object 1",
        userId: "user 1"
    }

    let visitEventProperties: VisitEventProperties = {
        pageUrl: "page 1",
        userId: "user 1"
    }

    let inputEventProperties: InputEventProperties = {
        objectId: "input 1",
        userId: "user 1",
        textValue: "text 1"
    }

    let customEventType: CustomEventType;

    beforeEach(async () => {
        analyticsViewer = new AnalyticsViewer({ apiBaseUrl: "http://127.0.0.1:3001", environment: EventEnvironment.DEVELOPMENT })
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

        customEventType = {
            category: "category 1",
            subcategory: "subcategory 1",
            properties: [
                "prop1",
                "prop2"
            ],
            projectId: project._id
        }

    })

    test('Get visit events paginated test', async () => {
        for (let i = 0; i < EVENT_COUNT; i++) {
            await developmentLogger.logVisitEvent(visitEventProperties)
        }

        const payload = await analyticsViewer.getVisitEventsPaginated(
            { projectName: project.projectName, afterId: undefined, environment: EventEnvironment.DEVELOPMENT, limit: PAGINATE_COUNT });
        expect(payload).not.toBe(null);
        expect(payload?.events).not.toBe(null);
        expect(payload?.afterId).not.toBe(null);
        expect(payload?.events?.length).toBe(PAGINATE_COUNT);
    }, 100000)

    test('Get all visit events test', async () => {
        for (let i = 0; i < EVENT_COUNT; i++) {
            await developmentLogger.logVisitEvent(visitEventProperties)
        }

        const events = await analyticsViewer.getAllVisitEvents(project.projectName);
        expect(events).not.toBe(null);
        expect(events?.length).toBe(EVENT_COUNT);
    }, 100000)

    test('Get click events paginated test', async () => {
        for (let i = 0; i < EVENT_COUNT; i++) {
            await developmentLogger.logClickEvent(clickEventProperties)
        }

        const payload = await analyticsViewer.getClickEventsPaginated(
            { projectName: project.projectName, afterId: undefined, environment: EventEnvironment.DEVELOPMENT, limit: PAGINATE_COUNT });
        expect(payload).not.toBe(null);
        expect(payload?.events).not.toBe(null);
        expect(payload?.afterId).not.toBe(null);
        expect(payload?.events?.length).toBe(PAGINATE_COUNT);
    }, 100000)

    test('Get all click events test', async () => {
        for (let i = 0; i < EVENT_COUNT; i++) {
            await developmentLogger.logClickEvent(clickEventProperties)
        }

        const events = await analyticsViewer.getAllClickEvents(project.projectName);
        expect(events).not.toBe(null);
        expect(events?.length).toBe(EVENT_COUNT);
    }, 100000)

    test('Get input events paginated test', async () => {
        for (let i = 0; i < EVENT_COUNT; i++) {
            await developmentLogger.logInputEvent(inputEventProperties)
        }

        const payload = await analyticsViewer.getInputEventsPaginated(
            { projectName: project.projectName, afterId: undefined, environment: EventEnvironment.DEVELOPMENT, limit: PAGINATE_COUNT });
        expect(payload).not.toBe(null);
        expect(payload?.events).not.toBe(null);
        expect(payload?.afterId).not.toBe(null);
        expect(payload?.events?.length).toBe(PAGINATE_COUNT);
    }, 100000)

    test('Get all input events test', async () => {
        for (let i = 0; i < EVENT_COUNT; i++) {
            await developmentLogger.logInputEvent(inputEventProperties)
        }

        const events = await analyticsViewer.getAllInputEvents(project.projectName);
        expect(events).not.toBe(null);
        expect(events?.length).toBe(EVENT_COUNT);
    }, 100000)

    test('Get custom events paginated test', async () => {
        const eventType = await analyticsManager.defineCustomEvent(customEventType) as CustomEventType;

        for (let i = 0; i < EVENT_COUNT; i++) {
            await developmentLogger.logCustomEvent(eventType.category, eventType.subcategory, {
                "prop1": "val1",
                "prop2": "val2"
            })
        }

        const payload = await analyticsViewer.getCustomEventsPaginated(
            { category: eventType.category, subcategory: eventType.subcategory, projectName: project.projectName, afterId: undefined, environment: EventEnvironment.DEVELOPMENT, limit: PAGINATE_COUNT });
        expect(payload).not.toBe(null);
        expect(payload?.events).not.toBe(null);
        expect(payload?.afterId).not.toBe(null);
        expect(payload?.events?.length).toBe(PAGINATE_COUNT);
    }, 100000)

    test('Get all custom events test', async () => {
        const eventType = await analyticsManager.defineCustomEvent(customEventType) as CustomEventType;
        for (let i = 0; i < EVENT_COUNT; i++) {
            await developmentLogger.logCustomEvent(eventType.category, eventType.subcategory, {
                "prop1": "val1",
                "prop2": "val2"
            })
        }

        const events = await analyticsViewer.getAllCustomEvents(project.projectName, eventType.category, eventType.subcategory);
        expect(events).not.toBe(null);
        expect(events?.length).toBe(EVENT_COUNT);
    }, 100000)


})