import { CustomEventType } from "@/utils/types";
import { getCustomGraphTypes } from "@/actions/custom-graph-type";
import { getCustomEventTypes } from "@/actions/custom-event-type";
import { logMessage } from "@/actions/logs";
import { formatErrorMessage } from "@/utils/error";

export default class AnalyticsViewer {
    private apiBaseUrl?: string;

    constructor({ apiBaseUrl }: { apiBaseUrl?: string }) {
        this.apiBaseUrl = apiBaseUrl ?? "https://analytics.bitsofgood.org"
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
}
