import { dbConnect } from "@/src/utils/db-connect";
import CustomEventModel from "@/src/models/custom-event";
import { CustomEvent, EventEnvironment } from "@/src/utils/types";
import CustomEventTypeModel from "@/src/models/custom-event-type";


export const createCustomEvent = async (event: Partial<CustomEvent>) => {
    await dbConnect();
    let eventType = await CustomEventTypeModel.findOne({ _id: event.eventTypeId, projectId: event.projectId })

    if (!eventType) {
        return null;
    }
    let typeProperties = eventType.properties;
    if (Object.keys(typeProperties).length === Object.keys((event?.properties as Record<string, string | number | Date>)).length
        && Object.keys(typeProperties).every(k => event?.properties?.hasOwnProperty(k))) {
        return null;
    }
    const createdEvent = await CustomEventModel.create(event);
    return createdEvent;
}
//one function to get eventTypeId, then this paginated method
export const paginatedGetCustomEvents = async (eventTypeId: string, afterDate: Date, afterID: string, limit: number, environment: EventEnvironment) => {
    await dbConnect();
    const events = await CustomEventModel.find(
        {
            createdAt: { $gte: afterDate },
            ...(afterID && { _id: { $gt: afterID } }),
            eventTypeId,
            ...(environment && { environment })
        })
        .limit(limit);
    return events
}