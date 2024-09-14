import mongoose, { Schema } from "mongoose";
import { CustomEvent, EventEnvironment } from "../node_modules/bog-analytics";
import CustomEventTypeModel from "./custom-event-type";


const CustomEventSchema = new Schema<CustomEvent>({
    properties: {
        type: Schema.Types.Mixed,
        required: true
    },
    eventTypeId: {
        // type: Schema.Types.ObjectId,
        type: String,
        required: true,
        ref: CustomEventTypeModel.modelName
    },
    environment: {
        type: String,
        required: true,
        enum: Object.values(EventEnvironment),
        default: EventEnvironment.PRODUCTION
    }
}, { timestamps: true });

export const CustomEventModel =
    (mongoose.models.CustomEvent as mongoose.Model<CustomEvent>) ||
    mongoose.model<CustomEvent>("CustomEvent", CustomEventSchema);

export default CustomEventModel;