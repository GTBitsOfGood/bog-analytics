import { VisitEvent } from "@/src/utils/types";
import { dbConnect } from "@/src/utils/db-connect";
import { VisitEventModel } from "@/src/models/visit-event";

export const createVisitEvent = async (event: Partial<VisitEvent>) => {
    await dbConnect();
    const createdEvent = VisitEventModel.create(event);
    return createdEvent;
}