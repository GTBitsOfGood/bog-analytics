import { VisitEvent } from "@/src/utils/types";
import { dbConnect } from "@/src/utils/db-connect";
import { VisitEventModel } from "@/src/models/visit-event";

export const createVisitEvent = async (event: Partial<VisitEvent>) => {
    await dbConnect();
    const createdEvent = await VisitEventModel.create(event);
    return createdEvent;
}

export const getVisitEvents = async (date?: Date) => {
    await dbConnect();
    let fromDate = new Date(Date.now() - 60 * 60 * 24 * 30 * 1000)
    if (typeof date !== 'undefined') {
        fromDate = date
    }
    const events = await VisitEventModel.find({ date: { $gte: fromDate } })
    return events
}