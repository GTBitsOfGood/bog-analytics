import { beforeAll, describe, expect, test } from '@jest/globals';
import { AnalyticsLogger, AnalyticsManager } from '@/index';
import { externalRequest } from '@/utils/requests';
import { urls } from '@/utils/urls';
import { ClickEventProperties, CustomEventType, EventEnvironment, HttpMethod, InputEventProperties, Project, VisitEventProperties } from '@/utils/types';
import { randomUUID } from "crypto";

describe('Analytics Logger Module', () => {
    let developmentLogger: AnalyticsLogger;
    let analyticsManager: AnalyticsManager;

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

    beforeAll(async () => {
        developmentLogger = new AnalyticsLogger({ apiBaseUrl: "http://127.0.0.1:3001", environment: EventEnvironment.DEVELOPMENT })
        const project = await externalRequest<Project>({
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


    test('Basic Click Event Test', async () => {
        const clickEvent = await developmentLogger.logClickEvent(clickEventProperties)
        expect(clickEvent?.eventProperties.objectId).toEqual(clickEventProperties.objectId)
        expect(clickEvent?.eventProperties.userId).toEqual(clickEventProperties.userId)
    })

    test('Basic Visit Event Test', async () => {
        const visitEvent = await developmentLogger.logVisitEvent(visitEventProperties)
        expect(visitEvent?.eventProperties.pageUrl).toEqual(visitEventProperties.pageUrl)
        expect(visitEvent?.eventProperties.userId).toEqual(visitEventProperties.userId)
    })

    test('Basic Input Event Test', async () => {
        const inputEvent = await developmentLogger.logInputEvent(inputEventProperties)
        expect(inputEvent?.eventProperties.objectId).toEqual(inputEventProperties.objectId)
        expect(inputEvent?.eventProperties.userId).toEqual(inputEventProperties.userId)
        expect(inputEvent?.eventProperties.textValue).toEqual(inputEventProperties.textValue)
    })


    test('Basic Custom Event Test', async () => {
        const eventType = await analyticsManager.defineCustomEvent(customEventType) as CustomEventType;
        const customEvent = await developmentLogger.logCustomEvent({
            eventTypeId: eventType._id, properties: {
                "prop1": "val1",
                "prop2": "val2"
            }
        });
        expect(customEvent?.eventTypeId).toEqual(eventType._id);

    })
})