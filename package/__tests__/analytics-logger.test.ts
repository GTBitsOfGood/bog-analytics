import { beforeAll, describe, test } from '@jest/globals';
import { AnalyticsLogger } from '@/index';


describe('Analytics Logger Module', () => {
    let logger: AnalyticsLogger;
    beforeAll(() => {
        logger = new AnalyticsLogger()
        logger.authenticate({ clientApiKey: "" })
    })
    test('Click Event Log', async () => {

    })
})