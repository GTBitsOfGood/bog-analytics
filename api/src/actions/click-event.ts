import { ClickEvent } from "@/src/utils/types";
import { dbConnect } from "@/src/utils/db-connect";
import { ClickEventModel } from "@/src/models/click-event";

export const createClickEvent = async (event: ClickEvent) => {
    await dbConnect();
    const createdEvent = ClickEventModel.create(event);
    return createdEvent;
}