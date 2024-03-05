import { CustomEventType } from "@/src/utils/types";
import { dbConnect } from "@/src/utils/db-connect";
import CustomEventTypeModel from "@/src/models/custom-event-type";
import CustomEvent from "@/src/models/custom-event";
import CustomGraphType from "@/src/models/custom-graph-type";


export const createCustomEvent = async (projectId: string, eventTypeId: string, properties: object) => {
    await dbConnect();
    let eventType = CustomEventTypeModel.find({ _id: eventTypeId, projectId })
    if (eventType == null) {
        //there is no event with this id for this projectId
        return;
    }
    let typeProperties = eventType.properties
    if (Object.keys(typeProperties).length === Object.keys(properties).length
        && Object.keys(typeProperties).every(k => properties.hasOwnProperty(k))) {
        //Checks if all the properties in event type are in the custom even properties
        return;
    }
    const createdEvent = await CustomEvent.create({ projectId, eventTypeId, properties });
    return createdEvent;
}
//one function to get eventTypeId, then this paginated method
export const paginatedGetCustomEvents = async (eventTypeId: string, afterDate: string, afterID: string, limit: number) => {
    await dbConnect();
    const events = await CustomEvent.find(
        {
            date: { $gte: afterDate },
            ...(afterID && { _id: { $gte: afterID } }),
            eventTypeId
        })
        .limit(limit);
    return events
}