import { CustomEventType } from "@/src/utils/types";
import { dbConnect } from "@/src/utils/db-connect";
import CustomEventTypeModel from "@/src/models/custom-event-type";

export const createCustomEventType = async (eventType: Partial<CustomEventType>) => {
    await dbConnect();
    let { projectId, category, subcategory } = eventType
    let sameEvents = await CustomEventTypeModel.find({ projectId }, { category }, { subcategory })
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