import { HttpMethod } from "@/utils/types";
import { externalRequest } from "@/utils/requests";
import { CustomEventType, CustomGraphType } from "@/utils/types";
import { customEventTypeUrl } from "@/actions/custom-event-type";
import { customGraphTypeUrl } from "@/actions/custom-graph-event";

export default class AnalyticsViewer {
    public async getCustomEventTypes(projectName: string) {
        try {
            const projectUrl = `${customEventTypeUrl}?projectName=${encodeURIComponent(projectName)}`;
        
            const customEventTypes = await externalRequest<CustomEventType[]>({
                url: projectUrl,
                method: HttpMethod.GET,
            });
            return customEventTypes;

        } catch {
            return null
        }
    }

    public async getCustomGraphTypes(customEventTypeId: string) {
        try {
            const graphTypesUrl = `${customGraphTypeUrl}?eventTypeId=${encodeURIComponent(customEventTypeId)}`;

            const graphTypes = await externalRequest<CustomGraphType[]>({
                url: graphTypesUrl,
                method: HttpMethod.GET,
            });
            return graphTypes;
    
        } catch {
            return null
        }
    }
}
