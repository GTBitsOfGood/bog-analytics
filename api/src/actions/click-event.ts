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

export const paginatedGetClickEvents = async (afterDate: Date, afterID: String, limit: number, projectName: String, environment: EventEnvironment) => {
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


