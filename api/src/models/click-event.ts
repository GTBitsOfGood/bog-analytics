import mongoose, { Schema, Document } from "mongoose";
import { BaseEvent, ClickEventProperties } from "@/utils/types";
import BaseEventModel from "./base-event";

const ClickEventSchema = new Schema<BaseEvent & {
    eventProperties: ClickEventProperties;
}>({
    eventProperties: {
        ObjectId: {
            type: String,
            required: true,
        },
        UserId: {
            type: String,
            required: true,
        },
    },
});

const EventDiscriminator = BaseEventModel.discriminator(
    "ClickEvent",
    ClickEventSchema
);

export const ClickEventModel = mongoose.model("ClickEvent", ClickEventSchema);

export default EventDiscriminator as mongoose.Model<Document & BaseEvent & {
    eventProperties: ClickEventProperties
}>;
