import mongoose, { Schema, Document, CallbackError } from "mongoose";
import { BaseEvent, VisitEvent, VisitEventProperties, EventCategories, EventSubcategories } from "@/src/utils/types";
import BaseEventModel from "@/src/models/base-event";

const VisitEventSchema = new Schema<BaseEvent & {
    eventProperties: VisitEventProperties;
}>({
    eventProperties: {
        pageUrl: {
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
    "VisitEvent",
    VisitEventSchema
);

VisitEventSchema.pre("save", async function (this: Document & BaseEvent, next: (err?: CallbackError) => void) {
    // Set default values for category and subcategory if they are not provided
    if (!this.category) {
        this.category = EventCategories.ACTIVITY;
    }

    if (!this.subcategory) {
        this.subcategory = EventSubcategories.VISIT;
    }

    // Continue with the save operation
    next();
});


export const VisitEventModel = (mongoose.models.VisitEvent as mongoose.Model<VisitEvent>) || mongoose.model("VisitEvent", VisitEventSchema, "visitevents");

export default EventDiscriminator as mongoose.Model<Document & BaseEvent & {
    eventProperties: VisitEventProperties
}>;
