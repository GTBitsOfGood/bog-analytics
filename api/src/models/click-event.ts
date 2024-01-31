import mongoose, { Schema, Document } from "mongoose";
import { BaseEvent, ClickEventProperties } from "@/src/utils/types";
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

export const ClickEventModel = mongoose.model("ClickEvent", ClickEventSchema);

export default EventDiscriminator as mongoose.Model<Document & BaseEvent & {
    eventProperties: ClickEventProperties
}>;
