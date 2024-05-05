import { gdprDeleteClickEvents, gdprDeleteCustomEvents, gdprDeleteInputEvents, gdprDeleteVisitEvents, gdprPaginatedUserClickEvents, gdprPaginatedUserCustomEvents, gdprPaginatedUserInputEvents, gdprPaginatedUserVisitEvents, gdprUpdateClickEvent, gdprUpdateCustomEvent, gdprUpdateInputEvent, gdprUpdateVisitEvent } from "@/actions/gdpr";
import { logMessage } from "@/actions/logs";
import { isBrowser } from "@/utils/env";
import { formatErrorMessage } from "@/utils/error";
import { GetUserEventsQueryParams } from "@/utils/types";

export default class GDPRManager {
    private serverApiKey?: string;
    private apiBaseUrl?: string;

    constructor({ apiBaseUrl }: { apiBaseUrl?: string }) {
        if (isBrowser()) {
            throw new Error("GDPR manager cannot be used client side!")
        }

        this.apiBaseUrl = apiBaseUrl ?? "https://analytics.bitsofgood.org"
    }

    public async authenticate(serverApiKey: string): Promise<void> {
        this.serverApiKey = serverApiKey;
    }

    public async deleteClickEventsForUser(userId: string) {
        try {
            if (!this.serverApiKey) {
                throw new Error('Please authenticate with your server api key first using the authenticate method');
            }
            const events = await gdprDeleteClickEvents(this.apiBaseUrl as string, this.serverApiKey, userId);
            return events;

        } catch {
            await logMessage(formatErrorMessage("an error occurred when deleting click events for a user (GDPR)", { userId }))
            return null
        }

    }

    public async deleteVisitEventsForUser(userId: string) {
        try {
            if (!this.serverApiKey) {
                throw new Error('Please authenticate with your server api key first using the authenticate method');
            }
            const events = await gdprDeleteVisitEvents(this.apiBaseUrl as string, this.serverApiKey, userId);
            return events;

        } catch {
            await logMessage(formatErrorMessage("an error occurred when deleting visit events for a user (GDPR)", { userId }))
            return null
        }

    }

    public async deleteInputEventsForUser(userId: string) {
        try {
            if (!this.serverApiKey) {
                throw new Error('Please authenticate with your server api key first using the authenticate method');
            }
            const events = await gdprDeleteInputEvents(this.apiBaseUrl as string, this.serverApiKey, userId);
            return events;

        } catch {
            await logMessage(formatErrorMessage("an error occurred when deleting click events for a user (GDPR)", { userId }))
            return null
        }
    }

    public async deleteCustomEventsForUser(userId: string, userAttribute: string, eventCategory: string, eventSubcategory: string) {
        try {
            if (!this.serverApiKey) {
                throw new Error('Please authenticate with your server api key first using the authenticate method');
            }
            const events = await gdprDeleteCustomEvents(this.apiBaseUrl as string, this.serverApiKey, userId, userAttribute, eventCategory, eventSubcategory);
            return events;

        } catch {
            await logMessage(formatErrorMessage("an error occurred when deleting custom events for a user (GDPR)", { userId }))
            return null
        }

    }

    public async getUserClickEventsPaginated(queryParams: GetUserEventsQueryParams) {
        try {
            if (!this.serverApiKey) {
                throw new Error('Please authenticate with your server api key first using the authenticate method');
            }
            return await gdprPaginatedUserClickEvents(this.apiBaseUrl as string, this.serverApiKey, queryParams);
        } catch {
            await logMessage(formatErrorMessage(
                "an error occurred when retrieving user click events (paginated) (GDPR)",
                {
                    limit: queryParams.limit?.toString() as string,
                    afterId: queryParams.afterId?.toString() as string,
                    userId: queryParams.userId.toString() as string
                }
            ))
            return null;
        }
    }

    public async getAllUserClickEvents(userId: string) {
        const queryParams: GetUserEventsQueryParams = {
            userId,
            afterId: undefined
        }

        const clickEvents = []

        try {
            if (!this.serverApiKey) {
                throw new Error('Please authenticate with your server api key first using the authenticate method');
            }

            let page = await gdprPaginatedUserClickEvents(this.apiBaseUrl as string, this.serverApiKey, queryParams);
            while (true) {
                clickEvents.push(...page['events']);
                queryParams['afterId'] = page['afterId']
                if (page['afterId']) {
                    page = await gdprPaginatedUserClickEvents(this.apiBaseUrl as string, this.serverApiKey, queryParams);
                    continue;
                }
                break;
            }

            return clickEvents;
        }
        catch {
            await logMessage(formatErrorMessage(
                "an error occurred when retrieving user click events (GDPR)",
                {
                    limit: queryParams.limit?.toString() as string,
                    afterId: queryParams.afterId?.toString() as string,
                    userId: queryParams.userId.toString() as string
                }
            ))
            return null;
        }
    }

    public async getUserVisitEventsPaginated(queryParams: GetUserEventsQueryParams) {
        try {
            if (!this.serverApiKey) {
                throw new Error('Please authenticate with your server api key first using the authenticate method');
            }
            return await gdprPaginatedUserVisitEvents(this.apiBaseUrl as string, this.serverApiKey, queryParams);
        } catch {
            await logMessage(formatErrorMessage(
                "an error occurred when retrieving user visit events (paginated) (GDPR)",
                {
                    limit: queryParams.limit?.toString() as string,
                    afterId: queryParams.afterId?.toString() as string,
                    userId: queryParams.userId.toString() as string
                }
            ))
            return null;
        }
    }

    public async getAllUserVisitEvents(userId: string) {
        const queryParams: GetUserEventsQueryParams = {
            userId,
            afterId: undefined
        }

        const visitEvents = []

        try {
            if (!this.serverApiKey) {
                throw new Error('Please authenticate with your server api key first using the authenticate method');
            }

            let page = await gdprPaginatedUserVisitEvents(this.apiBaseUrl as string, this.serverApiKey, queryParams);
            while (true) {
                visitEvents.push(...page['events']);
                queryParams['afterId'] = page['afterId']
                if (page['afterId']) {
                    page = await gdprPaginatedUserVisitEvents(this.apiBaseUrl as string, this.serverApiKey, queryParams);
                    continue;
                }
                break;
            }

            return visitEvents;
        }
        catch {
            await logMessage(formatErrorMessage(
                "an error occurred when retrieving user visit events (GDPR)",
                {
                    limit: queryParams.limit?.toString() as string,
                    afterId: queryParams.afterId?.toString() as string,
                    userId: queryParams.userId.toString() as string
                }
            ))
            return null;
        }
    }

    public async getUserInputEventsPaginated(queryParams: GetUserEventsQueryParams) {
        try {
            if (!this.serverApiKey) {
                throw new Error('Please authenticate with your server api key first using the authenticate method');
            }
            return await gdprPaginatedUserInputEvents(this.apiBaseUrl as string, this.serverApiKey, queryParams);
        } catch {
            await logMessage(formatErrorMessage(
                "an error occurred when retrieving user input events (paginated) (GDPR)",
                {
                    limit: queryParams.limit?.toString() as string,
                    afterId: queryParams.afterId?.toString() as string,
                    userId: queryParams.userId.toString() as string
                }
            ))
            return null;
        }
    }

    public async getAllUserInputEvents(userId: string) {
        const queryParams: GetUserEventsQueryParams = {
            userId,
            afterId: undefined
        }

        const inputEvents = []

        try {
            if (!this.serverApiKey) {
                throw new Error('Please authenticate with your server api key first using the authenticate method');
            }

            let page = await gdprPaginatedUserInputEvents(this.apiBaseUrl as string, this.serverApiKey, queryParams);
            while (true) {
                inputEvents.push(...page['events']);
                queryParams['afterId'] = page['afterId']
                if (page['afterId']) {
                    page = await gdprPaginatedUserInputEvents(this.apiBaseUrl as string, this.serverApiKey, queryParams);
                    continue;
                }
                break;
            }

            return inputEvents;
        }
        catch {
            await logMessage(formatErrorMessage(
                "an error occurred when retrieving user visit events (GDPR)",
                {
                    limit: queryParams.limit?.toString() as string,
                    afterId: queryParams.afterId?.toString() as string,
                    userId: queryParams.userId.toString() as string
                }
            ))
            return null;
        }
    }

    public async getUserCustomEventsPaginated(afterId: string, userId: string, userAttribute: string, eventCategory: string, eventSubcategory: string) {
        try {
            if (!this.serverApiKey) {
                throw new Error('Please authenticate with your server api key first using the authenticate method');
            }
            return await gdprPaginatedUserCustomEvents(this.apiBaseUrl as string, this.serverApiKey, afterId, userId, userAttribute, eventCategory, eventSubcategory);
        } catch {
            await logMessage(formatErrorMessage(
                "an error occurred when retrieving user custom events (paginated) (GDPR)",
                {
                    afterId,
                    userId,
                    userAttribute,
                    eventCategory,
                    eventSubcategory
                }
            ))
            return null;
        }
    }

    public async getAllUserCustomEvents(userId: string, userAttribute: string, eventCategory: string, eventSubcategory: string) {
        let afterId = undefined;
        const customEvents = []

        try {
            if (!this.serverApiKey) {
                throw new Error('Please authenticate with your server api key first using the authenticate method');
            }

            let page = await gdprPaginatedUserCustomEvents(this.apiBaseUrl as string, this.serverApiKey, afterId, userId, userAttribute, eventCategory, eventSubcategory)
            while (true) {
                customEvents.push(...page['events']);
                afterId = page['afterId']
                if (page['afterId']) {
                    page = await gdprPaginatedUserCustomEvents(this.apiBaseUrl as string, this.serverApiKey, afterId, userId, userAttribute, eventCategory, eventSubcategory)
                    continue;
                }
                break;
            }

            return customEvents;
        }
        catch {
            await logMessage(formatErrorMessage(
                "an error occurred when retrieving user custom events (GDPR)",
                {
                    userId, userAttribute, eventCategory, eventSubcategory
                }
            ))
            return null;
        }
    }


    public async updateUserClickEvent(eventId: string, userId: string, objectId: string) {
        try {
            if (!this.serverApiKey) {
                throw new Error('Please authenticate with your server api key first using the authenticate method');
            }
            const events = await gdprUpdateClickEvent(this.apiBaseUrl as string, this.serverApiKey, eventId, userId, objectId);
            return events;

        } catch (e) {
            console.log(e)
            await logMessage(formatErrorMessage("an error occurred when updating click events for a user (GDPR)", { userId, eventId, objectId }))
            return null
        }

    }

    public async updateUserVisitEvent(eventId: string, userId: string, pageUrl: string) {
        try {
            if (!this.serverApiKey) {
                throw new Error('Please authenticate with your server api key first using the authenticate method');
            }
            const events = await gdprUpdateVisitEvent(this.apiBaseUrl as string, this.serverApiKey, eventId, userId, pageUrl);
            return events;

        } catch {
            await logMessage(formatErrorMessage("an error occurred when updating visit events for a user (GDPR)", { userId, eventId, pageUrl }))
            return null
        }

    }

    public async updateUserInputEvent(eventId: string, userId: string, objectId?: string, textValue?: string) {
        try {
            if (!this.serverApiKey) {
                throw new Error('Please authenticate with your server api key first using the authenticate method');
            }
            const events = await gdprUpdateInputEvent(this.apiBaseUrl as string, this.serverApiKey, eventId, userId, objectId, textValue);
            return events;

        } catch {
            await logMessage(formatErrorMessage("an error occurred when updating input events for a user (GDPR)", { userId, eventId, textValue: textValue as string, objectId: objectId as string }))
            return null
        }

    }

    public async updateUserCustomEvent(eventId: string, userId: string, userAttribute: string, updatedAttributes: object) {
        try {
            if (!this.serverApiKey) {
                throw new Error('Please authenticate with your server api key first using the authenticate method');
            }
            const events = await gdprUpdateCustomEvent(this.apiBaseUrl as string, this.serverApiKey, eventId, userId, userAttribute, updatedAttributes);
            return events;

        } catch {
            await logMessage(formatErrorMessage("an error occurred when updating input events for a user (GDPR)", { eventId, userId, userAttribute, updatedAttributes }))
            return null
        }

    }

}