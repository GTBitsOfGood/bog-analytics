import { describe, test } from '@jest/globals';
import { logMessage } from '@/actions/logs';
import { formatErrorMessage } from '@/utils/error';


describe('Slackbot Logger Module', () => {
    test('Simple Message Log', async () => {
        await logMessage(formatErrorMessage("This is a jest test message for what an average error log might look like", {
            "Project API Key": "Sample Project API Key",
            "Object Id": "Sample Object Id",
            "User Id": "Sample User Id",
            "Environment": process.env.NODE_ENV as string
        }))
    })
})