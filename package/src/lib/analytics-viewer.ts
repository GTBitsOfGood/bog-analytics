import { CustomEventType } from "@/utils/types";
import { getCustomGraphTypes } from "@/actions/custom-graph-type";
import { getCustomEventTypes } from "@/actions/custom-event-type";
import { logMessage } from "@/actions/logs";
import { formatErrorMessage } from "@/utils/error";

export default class AnalyticsViewer {
    public async getCustomEventTypes(projectName: string): Promise<CustomEventType[] | null> {
        try {
            const customEventTypes = await getCustomEventTypes(projectName)
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
            const graphTypes = getCustomGraphTypes(projectName, eventTypeId);
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
