import { authenticateProject } from "@/actions/auth";
import { API_KEY_JWT_TIMEOUT } from "@/utils/types";

export default class AnalyticsLogger {
    private apiKey?: string;
    private webToken?: string;

    public async authenticate(apiKey: string): Promise<void> {
        this.apiKey = apiKey;
        this.webToken = await authenticateProject(apiKey);

        console.log(this.webToken)
        // reauthenticate every 59 minutes (JWT lasts 60 minutes)
        setTimeout(() => {
            this.authenticate(apiKey);
        }, API_KEY_JWT_TIMEOUT * 60 * 1000)
    }

    public logClickEvent(objectId: string, userId: string): void {
        if (!this.apiKey) {
            throw new Error('Please authenticate first using the authenticate method');
        }

        // Perform click logging logic with apiKey, objectId, userId
        console.log(`Click logged for objectId: ${objectId} by userId: ${userId}`);
    }

    public logVisitEvent(objectId: string, userId: string): void {
        if (!this.apiKey) {
            throw new Error('Please authenticate first using the authenticate method');
        }

        // Perform click logging logic with apiKey, objectId, userId
        console.log(`Click logged for objectId: ${objectId} by userId: ${userId}`);
    }

    public logInputEvent(objectId: string, userId: string): void {
        if (!this.apiKey) {
            throw new Error('Please authenticate first using the authenticate method');
        }

        // Perform click logging logic with apiKey, objectId, userId
        console.log(`Click logged for objectId: ${objectId} by userId: ${userId}`);
    }


}
