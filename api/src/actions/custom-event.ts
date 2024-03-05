import { dbConnect } from "@/src/utils/db-connect";
import CustomEventTypeModel from "@/src/models/custom-event-type";
import CustomEvent from "@/src/models/custom-event";


export const createCustomEvent = async (projectId: string, eventTypeId: string, properties: object) => {
    await dbConnect();
    let eventType = await CustomEventTypeModel.findOne({ _id: eventTypeId, projectId })

    if (!eventType) {
        return null;
    }
    let typeProperties = eventType.properties;
    if (Object.keys(typeProperties).length === Object.keys(properties).length
        && Object.keys(typeProperties).every(k => properties.hasOwnProperty(k))) {
        return null;
    }
    const createdEvent = await CustomEvent.create({
        projectId,
        eventTypeId,
        properties,
        category: eventType.category,
        subcategory: eventType.subcategory
    });
    return createdEvent;
}
//one function to get eventTypeId, then this paginated method
export const paginatedGetCustomEvents = async (eventTypeId: string, afterDate: Date, afterID: string, limit: number) => {
    await dbConnect();
    const events = await CustomEvent.find(
        {
            createdAt: { $gte: afterDate },
            ...(afterID && { _id: { $gte: afterID } }),
            eventTypeId
        })
        .limit(limit);
    return events
}