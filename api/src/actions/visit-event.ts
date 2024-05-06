import { EventCategories, EventEnvironment, EventSubcategories, VisitEvent } from "@/src/utils/types";
import { dbConnect } from "@/src/utils/db-connect";
import { VisitEventModel } from "@/src/models/visit-event";
import ProjectModel from "@/src/models/project";

export const createVisitEvent = async (event: Partial<VisitEvent>) => {
    await dbConnect();
    const createdEvent = await VisitEventModel.create({ ...event, category: EventCategories.ACTIVITY, subcategory: EventSubcategories.VISIT });
    return createdEvent;
}

export const getVisitEvents = async (date?: Date) => {
    await dbConnect();
    const fromDate = date ?? new Date(Date.now() - 60 * 60 * 24 * 30 * 1000)
    const events = await VisitEventModel.find({ createdAt: { $gte: fromDate } })
    return events
}

export const paginatedGetVisitEvents = async (afterDate: Date, afterID: string, limit: number, projectName: string, environment: EventEnvironment) => {
    await dbConnect();
    const project = await ProjectModel.findOne({ projectName: projectName })
    if (project && project._id) {

        const events = await VisitEventModel.find(
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

export const deleteVisitEvents = async () => {
    await dbConnect();
    return await VisitEventModel.deleteMany();
}

export const deleteVisitEventsByProject = async (projectId: string) => {
    await dbConnect();
    return await VisitEventModel.deleteMany({ projectId });
}

export const getVisitEventsByUser = async (projectId: string, userId: string) => {
    await dbConnect();
    const events = await VisitEventModel.find(
        {
            projectId,
            "eventProperties.userId": userId
        })
    return events
}

export const paginatedGetVisitEventsByUser = async (afterID: string, limit: number, projectId: string, userId: string) => {
    await dbConnect();
    const events = await VisitEventModel.find(
        {
            ...(afterID && { _id: { $gt: afterID } }),
            projectId,
            "eventProperties.userId": userId
        })
        .limit(limit);
    return events
}

export const getVisitEventById = async (eventId: string) => {
    await dbConnect();
    return await VisitEventModel.findOne({ _id: eventId })
}


export const deleteVisitEventsByUserId = async (projectId: string, userId: string) => {
    await dbConnect();
    return await VisitEventModel.deleteMany({ projectId, "eventProperties.userId": userId })
}

export const updateVisitEventById = async (eventId: string, pageUrl: string) => {
    await dbConnect();
    return await VisitEventModel.updateOne({ _id: eventId }, { "eventProperties.pageUrl": pageUrl });
}