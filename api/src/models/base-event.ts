import mongoose from "mongoose";
import { BaseEvent } from "@/utils/types";

export const BaseEventSchema = new mongoose.Schema<BaseEvent>({
    category: {
        type: String,
        required: true,
    },
    subcategory: {
        type: String,
        required: true,
    },
});

const BaseEventModel =
    (mongoose.models.Animal as mongoose.Model<BaseEvent>) ||
    mongoose.model<BaseEvent>("Animal", BaseEventSchema);

export default BaseEventModel;