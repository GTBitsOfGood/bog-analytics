import { ClickEvent } from "@/src/utils/types";
import { dbConnect } from "@/src/utils/db-connect";
import { ClickEventModel } from "@/src/models/click-event";

export const createClickEvent = async (event: Partial<ClickEvent>) => {
    await dbConnect();
    const createdEvent = await ClickEventModel.create(event);
    return createdEvent;
}

export const getClickEvents = async (date?: Date) => {
    await dbConnect();
    let fromDate = date ?? new Date(Date.now() - 60 * 60 * 24 * 30 * 1000)
    const events = await ClickEventModel.find({ date: { $gte: fromDate } })
    return events
}

export const deleteClickEvents = async () => {
    await dbConnect();
    return await ClickEventModel.deleteMany();
}


