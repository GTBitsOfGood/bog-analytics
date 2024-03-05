import mongoose, { Schema } from "mongoose";
import { CustomEvent } from "@/src/utils/types";
import ProjectModel from "@/src/models/project";
import CustomEventTypeModel from "@/src/models/custom-event-type";

export const CustomEventSchema = new mongoose.Schema<CustomEvent>({
    subcategory: {
        type: String,
        required: true,
    },
    properties: {
        type: Schema.Types.Mixed,
        required: true
    },
    projectId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: ProjectModel.modelName
    },
    eventTypeId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: CustomEventTypeModel.modelName
    }
}, { timestamps: true });

const CustomEventModel =
    (mongoose.models.CustomEvent as mongoose.Model<CustomEvent>) ||
    mongoose.model<CustomEvent>("CustomEvent", CustomEventSchema);

export default CustomEventModel;