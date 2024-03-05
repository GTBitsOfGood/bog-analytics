import mongoose, { Schema } from "mongoose";
import { BaseEvent, CustomEvent } from "@/src/utils/types";
import CustomEventTypeModel from "@/src/models/custom-event-type";


const CustomEventSchema = new Schema<BaseEvent & CustomEvent>({
    properties: {
        type: Schema.Types.Mixed,
        required: true
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