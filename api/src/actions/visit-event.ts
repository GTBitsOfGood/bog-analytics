import { VisitEvent } from "@/src/utils/types";
import { dbConnect } from "@/src/utils/db-connect";
import { VisitEventModel } from "@/src/models/visit-event";
import Project from "@/src/models/project";

export const createVisitEvent = async (event: Partial<VisitEvent>) => {
    await dbConnect();
    const createdEvent = await VisitEventModel.create(event);
    return createdEvent;
}

export const getVisitEvents = async (date?: Date) => {
    await dbConnect();
    const fromDate = date ?? new Date(Date.now() - 60 * 60 * 24 * 30 * 1000)
    const events = await VisitEventModel.find({ createdAt: { $gte: fromDate } })
    return events
}
export const paginatedGetVisitEvents = async (afterDate: Date, afterID: string, limit: number, projectName: String) => {
    await dbConnect();
    const project = await Project.findOne({ projectName: projectName })
    if (project && project._id) {

        const events = await VisitEventModel.find(
            {
                createdAt: { $gte: afterDate },
                ...(afterID && { _id: { $gte: afterID } }),
                projectId: project._id
            })
            .limit(limit);
        return events
    }
    return []
}

export const deleteClickEvents = async () => {
    await dbConnect();
    return await VisitEventModel.deleteMany();
}