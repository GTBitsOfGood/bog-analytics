import mongoose, { Schema } from "mongoose";
import { BaseEvent, EventEnvironment } from "../node_modules/bog-analytics";

export const BaseEventSchema = new mongoose.Schema<BaseEvent>({
    category: {
        type: String,
        required: true,
    },
    subcategory: {
        type: String,
        required: true,
    },
    environment: {
        type: String,
        required: true,
        enum: Object.values(EventEnvironment),
        default: EventEnvironment.PRODUCTION
    }
}, { timestamps: true });

const BaseEventModel =
    (mongoose.models.BaseEvent as mongoose.Model<BaseEvent>) ||
    mongoose.model<BaseEvent>("BaseEvent", BaseEventSchema);

export default BaseEventModel;
