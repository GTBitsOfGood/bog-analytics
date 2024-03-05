import mongoose, { CallbackError, Schema } from "mongoose";
import { BaseEvent, CustomEvent, EventCategories } from "@/src/utils/types";
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

CustomEventSchema.pre("save", async function (this: Document & CustomEvent, next: (err?: CallbackError) => void) {
    if (!this.category) {
        this.category = EventCategories.CUSTOM;
    }
    next();
});

const CustomEventModel =
    (mongoose.models.CustomEvent as mongoose.Model<CustomEvent>) ||
    mongoose.model<CustomEvent>("CustomEvent", CustomEventSchema);

export default CustomEventModel;