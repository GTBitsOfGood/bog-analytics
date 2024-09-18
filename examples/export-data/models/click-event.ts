import mongoose, { Schema, Document, CallbackError } from "mongoose";
import { ClickEvent, EventCategories, EventSubcategories } from "bog-analytics";
import BaseEventModel from "./base-event";


export interface MongooseClickEvent extends Omit<ClickEvent, "projectId"> { };

const ClickEventSchema = new Schema<MongooseClickEvent>({
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

ClickEventSchema.pre("save", async function (this: Document & MongooseClickEvent, next: (err?: CallbackError) => void) {
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


export const ClickEventModel = (mongoose.models.ClickEvent as mongoose.Model<MongooseClickEvent>) || mongoose.model("ClickEvent", ClickEventSchema, "clickevents");

export default EventDiscriminator as mongoose.Model<MongooseClickEvent>;
