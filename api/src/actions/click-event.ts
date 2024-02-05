import { ClickEvent } from "@/src/utils/types";
import { dbConnect } from "@/src/utils/db-connect";
import { ClickEventModel } from "@/src/models/click-event";

export const createClickEvent = async (event: Partial<ClickEvent>) => {
    await dbConnect();
    const createdEvent = ClickEventModel.create(event);
    return createdEvent;
}

export const getClickEvents = async (date?: Date) => {
    await dbConnect();
    let fromDate = new Date(Date.now() - 60 * 60 * 24 * 30 * 1000)
    if (typeof date !== 'undefined') {
        fromDate = date
    }
    const events = await ClickEventModel.find({ date: { $gte: fromDate } })
    return events
}


