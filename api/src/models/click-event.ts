import mongoose, { Schema, Document, CallbackError } from "mongoose";
import { BaseEvent, ClickEventProperties, EventCategories, EventSubcategories } from "@/src/utils/types";
import BaseEventModel from "@/src/models/base-event";

const ClickEventSchema = new Schema<BaseEvent & {
    eventProperties: ClickEventProperties;
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
    },
});

const EventDiscriminator = BaseEventModel.discriminator(
    "ClickEvent",
    ClickEventSchema
);

ClickEventSchema.pre("save", async function (this: Document & BaseEvent, next: (err?: CallbackError) => void) {
    // Set default values for category and subcategory if they are not provided
    if (!this.category) {
        this.category = EventCategories.INTERACTION;
    }

    if (!this.subcategory) {
        this.subcategory = EventSubcategories.CLICK;
    }

    // Continue with the save operation
    next();
});


export const ClickEventModel = mongoose.model("ClickEvent", ClickEventSchema);

export default EventDiscriminator as mongoose.Model<Document & BaseEvent & {
    eventProperties: ClickEventProperties
}>;
