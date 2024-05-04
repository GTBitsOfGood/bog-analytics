import { ClickEvent, EventCategories, EventEnvironment, EventSubcategories } from "@/src/utils/types";
import { dbConnect } from "@/src/utils/db-connect";
import { ClickEventModel } from "@/src/models/click-event";
import ProjectModel from "@/src/models/project";

export const createClickEvent = async (event: Partial<ClickEvent>) => {
    await dbConnect();
    const createdEvent = await ClickEventModel.create({ ...event, category: EventCategories.INTERACTION, subcategory: EventSubcategories.CLICK });
    return createdEvent;
}

export const getClickEvents = async (date?: Date) => {
    await dbConnect();
    let fromDate = date ?? new Date(Date.now() - 60 * 60 * 24 * 30 * 1000)
    const events = await ClickEventModel.find({ createdAt: { $gte: fromDate } })
    return events
}

export const paginatedGetClickEvents = async (afterDate: Date, afterID: string, limit: number, projectName: string, environment: EventEnvironment) => {
    await dbConnect();
    const project = await ProjectModel.findOne({ projectName: projectName })
    if (project && project._id) {
        const events = await ClickEventModel.find(
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

export const deleteClickEvents = async () => {
    await dbConnect();
    return await ClickEventModel.deleteMany();
}

export const deleteClickEventsByUserId = async (projectId: string, userId: string) => {
    await dbConnect();
    return await ClickEventModel.deleteMany({ projectId, "eventProperties.userId": userId })
}

export const getClickEventsByUser = async (projectId: string, userId: string) => {
    await dbConnect();
    const events = await ClickEventModel.find(
        {
            projectId,
            "eventProperties.userId": userId
        })
    return events
}

export const paginatedGetClickEventsByUser = async (afterID: string, limit: number, projectId: string, userId: string) => {
    await dbConnect();
    const events = await ClickEventModel.find(
        {
            ...(afterID && { _id: { $gt: afterID } }),
            projectId,
            "eventProperties.userId": userId
        })
        .limit(limit);
    return events
}

export const getClickEventById = async (eventId: string) => {
    await dbConnect();
    return await ClickEventModel.findOne({ _id: eventId })
}

export const updateClickEventById = async (eventId: string, objectId: string) => {
    await dbConnect();
    return await ClickEventModel.updateOne({ _id: eventId, "eventProperties.objectId": objectId });
}