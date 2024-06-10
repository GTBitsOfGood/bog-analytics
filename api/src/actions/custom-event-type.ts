import { CustomEventType } from "@/src/utils/types";
import { dbConnect } from "@/src/utils/db-connect";
import CustomEventTypeModel from "@/src/models/custom-event-type";
import CustomEventModel from "@/src/models/custom-event";
import CustomGraphTypeModel from "@/src/models/custom-graph-type";
import { Types } from "mongoose";


export const findEventTypeForProject = async (projectId: string | Types.ObjectId, category: string, subcategory: string) => {
    await dbConnect();
    return await CustomEventTypeModel.findOne({ projectId, category, subcategory })

}
export const findEventTypeForProjectByID = async (projectId: string | Types.ObjectId, eventTypeId: string | Types.ObjectId) => {
    await dbConnect();
    return await CustomEventTypeModel.findOne({ projectId, _id: eventTypeId })
}
export const createCustomEventType = async (eventType: Partial<CustomEventType>) => {
    await dbConnect();
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
    const eventType = await CustomEventTypeModel.findOne({ projectId, category, subcategory })
    return eventType;
}
export const getCustomEventTypeID = async (projectId: string, category: string, subcategory: string) => {
    await dbConnect();
    const eventType = await CustomEventTypeModel.findOne({ projectId, category, subcategory })
    return eventType?._id;
}
export const deleteCustomEventType = async (projectId: string, category: string, subcategory: string) => {
    await dbConnect();
    const deletedEventType = await CustomEventTypeModel.findOne({ projectId, category, subcategory });
    if (!deletedEventType) {
        return;
    }
    let eventTypeId = deletedEventType._id

    await CustomEventModel.deleteMany({ eventTypeId })
    await CustomGraphTypeModel.deleteMany({ eventTypeId })
    await CustomEventTypeModel.deleteOne({ projectId, category, subcategory })
}

export const deleteCustomEventTypesByProject = async (projectId: string) => {
    await dbConnect();
    await CustomEventTypeModel.deleteMany({ projectId })
}


export const deleteAllCustomEventTypes = async () => {
    await dbConnect();
    await CustomEventTypeModel.deleteMany()
    await CustomEventModel.deleteMany()
    await CustomGraphTypeModel.deleteMany()
}