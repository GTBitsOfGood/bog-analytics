import { describe, test } from '@jest/globals';
import { logMessage } from '@/actions/logs';


describe('Slackbot Logger Module', () => {
    test('Simple Message Log', async () => {
        await logMessage(`
            Test: This is a jest test message for what an average log might look like\n\`\`\`- Project API Key: Sample Project API Key\n- Object Id: Sample Object Id\n- User Id: Sample User Id\`\`\`
    `)
    })
})