import mongoose, { Schema, Document, CallbackError } from "mongoose";
import { BaseEvent, InputEvent, InputEventProperties, EventCategories, EventSubcategories } from "../node_modules/bog-analytics";
import BaseEventModel from "./base-event";

const InputEventSchema = new Schema<BaseEvent & {
    eventProperties: InputEventProperties;
}>({
    eventProperties: {
        objectId: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        textValue: {
            type: String,
            required: true,
        }
    },
});

const EventDiscriminator = BaseEventModel.discriminator(
    "InputEvent",
    InputEventSchema
);

InputEventSchema.pre("save", async function (this: Document & BaseEvent, next: (err?: CallbackError) => void) {
    // Set default values for category and subcategory if they are not provided
    if (!this.category) {
        this.category = EventCategories.INTERACTION;
    }

    if (!this.subcategory) {
        this.subcategory = EventSubcategories.INPUT;
    }

    // Continue with the save operation
    next();
});


export const InputEventModel = (mongoose.models.InputEvent as mongoose.Model<InputEvent>) || mongoose.model("InputEvent", InputEventSchema, "inputevents");

// export default EventDiscriminator as mongoose.Model<Document & BaseEvent & {
//     eventProperties: InputEventProperties
// }>;

export default InputEventModel;
