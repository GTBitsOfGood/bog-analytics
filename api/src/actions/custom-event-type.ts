import { CustomEventType } from "@/src/utils/types";
import { dbConnect } from "@/src/utils/db-connect";
import CustomEventTypeModel from "@/src/models/custom-event-type";

export const createCustomEventType = async (eventType: Partial<CustomEventType>) => {
    await dbConnect();
    const createdEventType = await CustomEventTypeModel.create(eventType);
    return createdEventType;
}