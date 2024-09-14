import mongoose, { Schema } from "mongoose";
import { CustomEventType } from "../node_modules/bog-analytics"

export const CustomEventTypeSchema = new mongoose.Schema<CustomEventType>({
    _id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
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
    (mongoose.models.CustomEventType as mongoose.Model<CustomEventType>) ||
    mongoose.model<CustomEventType>("CustomEventType", CustomEventTypeSchema);

export default CustomEventTypeModel;