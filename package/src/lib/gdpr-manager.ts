import { isBrowser } from "@/utils/env";

export default class GDPRManager {
    private serverApiKey?: string;
    private apiBaseUrl?: string;

    constructor({ apiBaseUrl }: { apiBaseUrl?: string }) {
        if (isBrowser()) {
            throw new Error("Analytics manager cannot be used client side!")
        }

        this.apiBaseUrl = apiBaseUrl ?? "https://analytics.bitsofgood.org"
    }

    public async authenticate(serverApiKey: string): Promise<void> {
        this.serverApiKey = serverApiKey;
    }
}