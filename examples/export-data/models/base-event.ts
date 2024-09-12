import mongoose, { Schema } from "mongoose";
import { BaseEvent, EventEnvironment } from "../utils/types";
import ProjectModel from "./project";

export const BaseEventSchema = new mongoose.Schema<BaseEvent>({
    category: {
        type: String,
        required: true,
    },
    subcategory: {
        type: String,
        required: true,
    },
    projectId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: ProjectModel.modelName
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
