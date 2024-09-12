import mongoose, { Schema } from "mongoose";
import { CustomEventType } from "../utils/types";
import ProjectModel from "./project";

export const CustomEventTypeSchema = new mongoose.Schema<CustomEventType>({
    category: {
        type: String,
        required: true,
    },
    subcategory: {
        type: String,
        required: true,
    },
    properties: {
        type: [String],
        required: true
    },
    projectId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: ProjectModel.modelName
    }
});

const CustomEventTypeModel =
    (mongoose.models.CustomEventType as mongoose.Model<CustomEventType>) ||
    mongoose.model<CustomEventType>("CustomEventType", CustomEventTypeSchema);

export default CustomEventTypeModel;