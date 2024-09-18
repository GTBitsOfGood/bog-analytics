import mongoose, { Schema, Document, CallbackError } from "mongoose";
import { VisitEvent, EventCategories, EventSubcategories } from "bog-analytics";
import BaseEventModel from "./base-event";

export interface MongooseVisitEvent extends Omit<VisitEvent, "projectId"> { };

const VisitEventSchema = new Schema<MongooseVisitEvent>({
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

VisitEventSchema.pre("save", async function (this: Document & MongooseVisitEvent, next: (err?: CallbackError) => void) {
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


export const VisitEventModel = (mongoose.models.VisitEvent as mongoose.Model<MongooseVisitEvent>) || mongoose.model("VisitEvent", VisitEventSchema, "visitevents");

export default EventDiscriminator as mongoose.Model<MongooseVisitEvent>;
