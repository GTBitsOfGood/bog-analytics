import { InputEvent } from "@/src/utils/types";
import { dbConnect } from "@/src/utils/db-connect";
import { InputEventModel } from "@/src/models/input-event";

export const createInputEvent = async (event: Partial<InputEvent>) => {
    await dbConnect();
    const createdEvent = InputEventModel.create(event);
    return createdEvent;
}   