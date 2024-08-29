import { CustomEventType, EventEnvironment, GetCustomEventsQueryParams, GetEventsQueryParams } from "@/utils/types";
import { getCustomGraphTypes } from "@/actions/custom-graph-type";
import { getCustomEventTypes } from "@/actions/custom-event-type";
import { logMessage } from "@/actions/logs";
import { formatErrorMessage } from "@/utils/error";
import { getPaginatedClickEvents } from "@/actions/click-event";
import { getPaginatedVisitEvents } from "@/actions/visit-event";
import { getPaginatedInputEvents } from "@/actions/input-event";
import { getPaginatedCustomEvents } from "@/actions/custom-event";

export default class AnalyticsViewer {
    private apiBaseUrl?: string;
    private serverApiKey?: string;
    private environment: EventEnvironment;

    constructor({ apiBaseUrl, environment }: { apiBaseUrl?: string, environment?: EventEnvironment }) {
        this.apiBaseUrl = apiBaseUrl ?? "https://analytics.bitsofgood.org"
        this.environment = environment ?? EventEnvironment.DEVELOPMENT;
    }

    public async authenticate(serverApiKey: string) {
        this.serverApiKey = serverApiKey;
    }

    public async getCustomEventTypes(projectName: string): Promise<CustomEventType[] | null> {
        try {
            const customEventTypes = await getCustomEventTypes(this.apiBaseUrl as string, projectName)
            return customEventTypes;

        } catch {
            await logMessage(formatErrorMessage(
                "an error occurred when retrieving custom event types",
                {
                    projectName
                }
            ))

            return null;
        }
    }

    public async getCustomGraphTypesbyId(projectName: string, eventTypeId: string) {
        try {
            const graphTypes = getCustomGraphTypes(this.apiBaseUrl as string, projectName, eventTypeId);
            return graphTypes;

        } catch {
            await logMessage(formatErrorMessage(
                "an error occurred when retrieving custom graph types",
                {
                    projectName,
                    eventTypeId
                }
            ))

            return null;
        }
    }

    public async getClickEventsPaginated(queryParams: GetEventsQueryParams) {
        try {
            return await getPaginatedClickEvents(this.apiBaseUrl as string, queryParams, this.serverApiKey);
        } catch {
            await logMessage(formatErrorMessage(
                "an error occurred when retrieving click events (paginated)",
                {
                    projectName: queryParams.projectName,
                    afterId: queryParams.afterId as string,
                    environment: queryParams.environment,
                    limit: queryParams.limit?.toString() as string,
                    afterTime: queryParams.afterTime as string,

                }
            ))

            return null;
        }
    }


    public async getAllClickEvents(projectName: string, afterTime?: Date) {
        const queryParams: GetEventsQueryParams = {
            projectName,
            afterTime: afterTime?.toString(),
            afterId: undefined,
            environment: this.environment
        }

        const clickEvents = []

        try {
            let page = await getPaginatedClickEvents(this.apiBaseUrl as string, queryParams, this.serverApiKey);
            while (true) {
                clickEvents.push(...page['events']);
                queryParams['afterId'] = page['afterId']
                if (page['afterId']) {
                    page = await getPaginatedClickEvents(this.apiBaseUrl as string, queryParams, this.serverApiKey);
                    continue;
                }
                break;
            }

            return clickEvents;
        }
        catch {
            await logMessage(formatErrorMessage(
                "an error occurred when retrieving click events",
                {
                    projectName: queryParams.projectName,
                    afterId: queryParams.afterId as string,
                    environment: queryParams.environment,
                    limit: queryParams.limit?.toString() as string,
                    afterTime: queryParams.afterTime as string,

                }
            ))
            return null;
        }
    }

    public async getVisitEventsPaginated(queryParams: GetEventsQueryParams) {
        try {
            return await getPaginatedVisitEvents(this.apiBaseUrl as string, queryParams, this.serverApiKey);
        } catch {
            await logMessage(formatErrorMessage(
                "an error occurred when retrieving visit events (paginated)",
                {
                    projectName: queryParams.projectName,
                    afterId: queryParams.afterId as string,
                    environment: queryParams.environment,
                    limit: queryParams.limit?.toString() as string,
                    afterTime: queryParams.afterTime as string,

                }
            ))

            return null;
        }
    }


    public async getAllVisitEvents(projectName: string, afterTime?: Date) {
        const queryParams: GetEventsQueryParams = {
            projectName,
            afterTime: afterTime?.toString(),
            afterId: undefined,
            environment: this.environment
        }

        const visitEvents = []

        try {
            let page = await getPaginatedVisitEvents(this.apiBaseUrl as string, queryParams, this.serverApiKey);
            while (true) {
                visitEvents.push(...page['events']);
                queryParams['afterId'] = page['afterId']
                if (page['afterId']) {
                    page = await getPaginatedVisitEvents(this.apiBaseUrl as string, queryParams, this.serverApiKey);
                    continue;
                }
                break;
            }

            return visitEvents;
        }
        catch {
            await logMessage(formatErrorMessage(
                "an error occurred when retrieving visit events",
                {
                    projectName: queryParams.projectName,
                    afterId: queryParams.afterId as string,
                    environment: queryParams.environment,
                    limit: queryParams.limit?.toString() as string,
                    afterTime: queryParams.afterTime as string,

                }
            ))
            return null;
        }
    }

    public async getInputEventsPaginated(queryParams: GetEventsQueryParams) {
        try {
            return await getPaginatedInputEvents(this.apiBaseUrl as string, queryParams, this.serverApiKey);
        } catch {
            await logMessage(formatErrorMessage(
                "an error occurred when retrieving input events (paginated)",
                {
                    projectName: queryParams.projectName,
                    afterId: queryParams.afterId as string,
                    environment: queryParams.environment,
                    limit: queryParams.limit?.toString() as string,
                    afterTime: queryParams.afterTime as string,

                }
            ))

            return null;
        }
    }


    public async getAllInputEvents(projectName: string, afterTime?: Date) {
        const queryParams: GetEventsQueryParams = {
            projectName,
            afterTime: afterTime?.toString(),
            afterId: undefined,
            environment: this.environment
        }

        const inputEvents = []

        try {
            let page = await getPaginatedInputEvents(this.apiBaseUrl as string, queryParams, this.serverApiKey);
            while (true) {
                inputEvents.push(...page['events']);
                queryParams['afterId'] = page['afterId']
                if (page['afterId']) {
                    page = await getPaginatedInputEvents(this.apiBaseUrl as string, queryParams, this.serverApiKey);
                    continue;
                }
                break;
            }

            return inputEvents;
        }
        catch {
            await logMessage(formatErrorMessage(
                "an error occurred when retrieving input events",
                {
                    projectName: queryParams.projectName,
                    afterId: queryParams.afterId as string,
                    environment: queryParams.environment,
                    limit: queryParams.limit?.toString() as string,
                    afterTime: queryParams.afterTime as string,

                }
            ))
            return null;
        }
    }

    public async getCustomEventsPaginated(queryParams: GetCustomEventsQueryParams) {
        try {
            return await getPaginatedCustomEvents(this.apiBaseUrl as string, queryParams, this.serverApiKey);
        } catch {
            await logMessage(formatErrorMessage(
                "an error occurred when retrieving custom events (paginated)",
                {
                    projectName: queryParams.projectName,
                    afterId: queryParams.afterId as string,
                    environment: queryParams.environment,
                    limit: queryParams.limit?.toString() as string,
                    afterTime: queryParams.afterTime as string,
                    subcategory: queryParams.subcategory,
                    category: queryParams.category
                }
            ))

            return null;
        }

    }

    public async getAllCustomEvents(projectName: string, category: string, subcategory: string, afterTime?: Date) {
        const queryParams: GetCustomEventsQueryParams = {
            projectName,
            afterTime: afterTime?.toString(),
            afterId: undefined,
            environment: this.environment,
            subcategory,
            category
        }

        const customEvents = []

        try {
            let page = await getPaginatedCustomEvents(this.apiBaseUrl as string, queryParams, this.serverApiKey);
            while (true) {
                customEvents.push(...page['events']);
                queryParams['afterId'] = page['afterId']
                if (page['afterId']) {
                    page = await getPaginatedCustomEvents(this.apiBaseUrl as string, queryParams, this.serverApiKey);
                    continue;
                }
                break;
            }

            return customEvents;
        }
        catch {
            await logMessage(formatErrorMessage(
                "an error occurred when retrieving visit events",
                {
                    projectName: queryParams.projectName,
                    afterId: queryParams.afterId as string,
                    environment: queryParams.environment,
                    limit: queryParams.limit?.toString() as string,
                    afterTime: queryParams.afterTime as string,

                }
            ))
            return null;
        }

    }
}
