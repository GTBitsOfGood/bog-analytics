import { CustomEventType } from "@/src/utils/types";
import { dbConnect } from "@/src/utils/db-connect";
import CustomEventTypeModel from "@/src/models/custom-event-type";
import CustomEvent from "@/src/models/custom-event";
import CustomGraphType from "@/src/models/custom-graph-type";


export const createCustomEventType = async (eventType: Partial<CustomEventType>) => {
    await dbConnect();
    let { projectId, category, subcategory } = eventType
    let sameEvents = await CustomEventTypeModel.find({ projectId, category, subcategory })
    if (sameEvents != null) {
        throw new Error("A custom event type with the same category and subcategory already exists")
    }
    const createdEventType = await CustomEventTypeModel.create(eventType);
    return createdEventType;
}

export const getCustomEventTypesForProject = async (projectId: string) => {
    await dbConnect();
    const eventTypes = await CustomEventTypeModel.find({ projectId })
    return eventTypes;
}
export const getCustomEventType = async (projectId: string, category: string, subcategory: string) => {
    await dbConnect();
    const eventType = await CustomEventTypeModel.find({ projectId, category, subcategory })
    return eventType;
}
export const getCustomEventTypeID = async (projectId: string, category: string, subcategory: string) => {
    await dbConnect();
    const eventType = await CustomEventTypeModel.find({ projectId, category, subcategory })
    return eventType._id;
}
export const deleteCustomEventType = async (projectId: string, category: string, subcategory: string) => {
    let deletedEventType = await CustomEventTypeModel.delete({ projectId, category, subcategory })
    if (deletedEventType == null) {
        return;
    }
    let eventTypeId = deletedEventType._id
    //delete events with this id
    await CustomEvent.deleteMany({ eventTypeId })
    await CustomGraphType.deleteMany({ eventTypeId })
}