import { InputEvent } from "@/src/utils/types";
import { dbConnect } from "@/src/utils/db-connect";
import { InputEventModel } from "@/src/models/input-event";
import ProjectModel from "@/src/models/project";

import exp from "constants";

export const createInputEvent = async (event: Partial<InputEvent>) => {
    await dbConnect();
    const createdEvent = await InputEventModel.create(event);
    return createdEvent;
}

export const getInputEvents = async (date?: Date) => {
    await dbConnect();
    let fromDate = new Date(Date.now() - 60 * 60 * 24 * 30 * 1000)
    if (typeof date !== 'undefined') {
        fromDate = date
    }
    const events = await InputEventModel.find({ date: { $gte: fromDate } })
    return events
}

export const paginatedGetInputEvents = async (afterDate: string, afterID: String, limit: number, projectName: String) => {
    await dbConnect();
    const project = await ProjectModel.findOne({ projectName: projectName })
    if (project && project._id) {
        let projectId = project._id;
        const events = await InputEventModel.find(
            {
                date: { $gte: afterDate },
                ...(afterID && {_id: { $gte: afterID }}),
                projectId: projectId
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