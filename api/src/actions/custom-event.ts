import { dbConnect } from "@/src/utils/db-connect";
import CustomEventModel from "@/src/models/custom-event";
import { CustomEvent, EventEnvironment } from "@/src/utils/types";
import CustomEventTypeModel from "@/src/models/custom-event-type";
import { Types } from "mongoose";
import { ObjectId } from 'mongodb'; // Import ObjectId from MongoDB driver

export const createCustomEvent = async (event: Partial<CustomEvent>) => {
    await dbConnect();
    let eventId = new ObjectId(event.eventTypeId);
    let eventType = await CustomEventTypeModel.findOne({ _id: eventId, projectId: event.projectId })
    console.log(eventType)
    if (!eventType) {
        console.log("event type not found")
        return null;
    }
    let typeProperties = eventType.properties;
    // if (Object.keys(typeProperties).length === Object.keys((event?.properties as Record<string, string | number | Date>)).length
    //     && Object.keys(typeProperties).every(k => event?.properties?.hasOwnProperty(k))) {
    //     return null;
    // }
    if (Object.keys(typeProperties).length !== Object.keys((event?.properties as Record<string, string | number | Date>)).length) {
        console.log("properties length not equal")
        return null;
    }
    console.log(Object.values(typeProperties))
    for (const key in event?.properties) {
        let has = false;
        for (let i = 0; i < typeProperties.length; i++) {
            let value = typeProperties[i]
            console.log(value, value == key)
            if (value == key) {
                has = true;
                break;
            }
        }
        if (has == false) {
            console.log("property not found")
            return null;
        }
    }
    const createdEvent = await CustomEventModel.create(event);
    console.log("created event")
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