import mongoose, { Schema } from "mongoose";
import { CustomEventType } from "bog-analytics";

export const CustomEventTypeSchema = new mongoose.Schema<Omit<CustomEventType, "projectId">>({
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
});

const CustomEventTypeModel =
    (mongoose.models.CustomEventType as mongoose.Model<Omit<CustomEventType, "projectId">>) ||
    mongoose.model<Omit<CustomEventType, "projectId">>("CustomEventType", CustomEventTypeSchema);

export default CustomEventTypeModel;