import { dbConnect } from "@/src/utils/db-connect";
import CustomEventModel from "@/src/models/custom-event";
import { CustomEvent, EventEnvironment } from "@/src/utils/types";
import CustomEventTypeModel from "@/src/models/custom-event-type";
import { ObjectId } from 'mongodb';

export const createCustomEvent = async (event: Partial<CustomEvent>) => {
    await dbConnect();
    let eventId = new ObjectId(event.eventTypeId);
    const createdEvent = await CustomEventModel.create(event);
    return createdEvent;
}
export const getCustomEventsByProjectId = async (projectId: string) => {
    await dbConnect();
    const events = await CustomEventModel.find(
        {
            projectId,
        })
    return events;
}
export const getCustomEventsByEventTypeId = async (eventTypeId: string) => {
    await dbConnect();
    const events = await CustomEventModel.find(
        {
            eventTypeId,
        })
    return events;
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

export const deleteCustomEvents = async () => {
    await dbConnect();
    const events = await CustomEventModel.deleteMany()
    return events;
}