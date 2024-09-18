import mongoose, { Schema, Types } from "mongoose";
import { CustomEvent, EventEnvironment } from "bog-analytics";
import CustomEventTypeModel from "./custom-event-type";

export interface MongooseCustomEvent extends Omit<Omit<CustomEvent, "projectId">, "eventTypeId"> {
  eventTypeId: Types.ObjectId
}
// NOTE: Ensure this is in sync with the CustomEventSchema in the deletion-policy package
const CustomEventSchema = new Schema<MongooseCustomEvent>(
  {
    properties: {
      type: Schema.Types.Mixed,
      required: true,
    },
    eventTypeId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: CustomEventTypeModel.modelName,
    },
    environment: {
      type: String,
      required: true,
      enum: Object.values(EventEnvironment),
      default: EventEnvironment.DEVELOPMENT,
    },
  },
  { timestamps: true }
);

export const CustomEventModel =
  (mongoose.models.CustomEvent as mongoose.Model<MongooseCustomEvent>) ||
  mongoose.model<MongooseCustomEvent>("CustomEvent", CustomEventSchema);

export default CustomEventModel;
