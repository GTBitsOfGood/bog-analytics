import { dbConnect } from "@/src/utils/db-connect";
import CustomEventModel from "@/src/models/custom-event";
import { CustomEvent, EventEnvironment } from "@/src/utils/types";

export const createCustomEvent = async (event: Partial<CustomEvent>) => {
    await dbConnect();
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
            createdAt: { $gt: afterDate },
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

export const deleteCustomEventsByProject = async (projectId: string) => {
    await dbConnect();
    const events = await CustomEventModel.deleteMany({ projectId })
    return events;
}

export const deleteCustomEventsByUserId = async (projectId: string, userId: string, eventTypeId: string, userAttribute: string) => {
    await dbConnect();
    return await CustomEventModel.deleteMany({ [`properties.${userAttribute}`]: userId, eventTypeId, projectId })
}

export const getCustomEventsByUser = async (userAttribute: string, userId: string) => {
    await dbConnect();
    return await CustomEventModel.find(
        {
            [`properties.${userAttribute}`]: userId
        })
}

export const paginatedGetCustomEventsByUser = async (afterID: string, limit: number, projectId: string, eventTypeId: string, userAttribute: string, userId: string) => {
    await dbConnect();
    const events = await CustomEventModel.find(
        {
            ...(afterID && { _id: { $gt: afterID } }),
            projectId,
            eventTypeId,
            [`properties.${userAttribute}`]: userId
        })
        .limit(limit);
    return events
}
export const getCustomEventById = async (eventId: string) => {
    await dbConnect();
    return await CustomEventModel.findOne({ _id: eventId });
}

export const updateCustomEventById = async (eventId: string, updatedAttributes: object) => {
    await dbConnect();
    return await CustomEventModel.findOneAndUpdate({ _id: eventId },
        { $set: { properties: { ...updatedAttributes } } }, { new: true }
    );

}

export const getCustomEventCount = async (eventTypeId: string, afterDate: Date, environment: EventEnvironment) => {
    await dbConnect();
    return await CustomEventModel.countDocuments({ eventTypeId, createdAt: { $gt: afterDate }, environment })
}