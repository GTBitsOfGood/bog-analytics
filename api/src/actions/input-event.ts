import { EventCategories, EventEnvironment, EventSubcategories, InputEvent } from "@/src/utils/types";
import { dbConnect } from "@/src/utils/db-connect";
import { InputEventModel } from "@/src/models/input-event";
import ProjectModel from "@/src/models/project";

export const createInputEvent = async (event: Partial<InputEvent>) => {
    await dbConnect();
    const createdEvent = await InputEventModel.create({ ...event, category: EventCategories.INTERACTION, subcategory: EventSubcategories.INPUT });
    return createdEvent;
}

export const getInputEvents = async (date?: Date) => {
    await dbConnect();
    const fromDate = date ?? new Date(Date.now() - 60 * 60 * 24 * 30 * 1000)
    const events = await InputEventModel.find({ createdAt: { $gte: fromDate } })
    return events
}

export const paginatedGetInputEvents = async (afterDate: Date, afterID: string, limit: number, projectName: string, environment: EventEnvironment) => {
    await dbConnect();
    const project = await ProjectModel.findOne({ projectName: projectName })
    if (project && project._id) {
        const events = await InputEventModel.find(
            {
                createdAt: { $gte: afterDate },
                ...(afterID && { _id: { $gt: afterID } }),
                projectId: project._id,
                ...(environment && { environment })
            })
            .limit(limit);
        return events
    }
    return []
}

export const deleteInputEvents = async () => {
    await dbConnect();
    return await InputEventModel.deleteMany();
}


export const deleteInputEventsByProject = async (projectId: string) => {
    await dbConnect();
    return await InputEventModel.deleteMany({ projectId });
}

export const deleteInputEventsByUserId = async (projectId: string, userId: string) => {
    await dbConnect();
    return await InputEventModel.deleteMany({ projectId, "eventProperties.userId": userId })
}

export const getInputEventsByUser = async (projectId: string, userId: string) => {
    await dbConnect();
    const events = await InputEventModel.find(
        {
            projectId,
            "eventProperties.userId": userId
        })
    return events
}

export const paginatedGetInputEventsByUser = async (afterID: string, limit: number, projectId: string, userId: string) => {
    await dbConnect();
    const events = await InputEventModel.find(
        {
            ...(afterID && { _id: { $gt: afterID } }),
            projectId,
            "eventProperties.userId": userId
        })
        .limit(limit);
    return events
}

export const getInputEventById = async (eventId: string) => {
    await dbConnect();
    return await InputEventModel.findOne({ _id: eventId })
}

export const updateInputEventById = async (eventId: string, objectId?: string, textValue?: string) => {
    await dbConnect();
    return await InputEventModel.updateOne({ _id: eventId },
        {
            ...(objectId && { "eventProperties.objectId": objectId }),
            ...(textValue && { "eventProperties.textValue": textValue })

        });
}