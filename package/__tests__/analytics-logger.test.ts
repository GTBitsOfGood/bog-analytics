import { beforeAll, describe, expect, test } from '@jest/globals';
import { AnalyticsLogger } from '@/index';
import { externalRequest } from '@/utils/requests';
import { urls } from '@/utils/urls';
import { ClickEventProperties, EventEnvironment, HttpMethod, InputEventProperties, Project, VisitEventProperties } from '@/utils/types';
import { randomUUID } from "crypto";

describe('Analytics Logger Module', () => {
    let developmentLogger: AnalyticsLogger;
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

    beforeAll(async () => {
        developmentLogger = new AnalyticsLogger()
        const project = await externalRequest<Project>({
            url: urls.apiBaseUrl + urls.project,
            method: HttpMethod.POST,
            body: {
                projectName: randomUUID()
            }
        })
        developmentLogger.authenticate(project.clientApiKey, EventEnvironment.DEVELOPMENT);
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


})