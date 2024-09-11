import { getCustomEventCount } from "@/src/actions/custom-event";
import { getCustomEventTypeID } from "@/src/actions/custom-event-type";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { EventEnvironment } from "@/src/utils/types";
import { Request } from "express";

const countRoute = APIWrapper({
    GET: {
        config: {
            requirePortalToken: true
        },
        handler: async (req: Request) => {
            const { category, subcategory } = req.query;

            if (!category || !subcategory) {
                throw new Error("You must specify an event category and subcategory");
            }

            const projectId = req.query.projectId as string;

            const eventTypeId = await getCustomEventTypeID(projectId as string, category as string, subcategory as string);

            if (!eventTypeId) {
                throw new Error("Event type not found for specified category, subcategory, and project")
            }

            const afterDate: Date = new Date(req.query.afterDate as string) ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const environment = req.query.environment as EventEnvironment ?? EventEnvironment.PRODUCTION;
            return getCustomEventCount(eventTypeId as string, afterDate, environment as EventEnvironment);
        }
    }
});

export const customEventCount = relogRequestHandler(countRoute);