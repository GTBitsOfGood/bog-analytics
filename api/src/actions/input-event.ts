import { EventCategories, EventSubcategories, InputEvent } from "@/src/utils/types";
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

export const paginatedGetInputEvents = async (afterDate: Date, afterID: String, limit: number, projectName: String) => {
    await dbConnect();
    const project = await ProjectModel.findOne({ projectName: projectName })
    if (project && project._id) {
        const events = await InputEventModel.find(
            {
                createdAt: { $gte: afterDate },
                ...(afterID && { _id: { $gt: afterID } }),
                projectId: project._id
            })
            .limit(limit);
        return events
    }
    return []
}

export const deleteClickEvents = async () => {
    await dbConnect();
    return await InputEventModel.deleteMany();
}