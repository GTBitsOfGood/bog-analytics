import mongoose, { Schema } from "mongoose";
import { BaseEvent, EventEnvironment } from "bog-analytics";

// NOTE: Ensure this is in sync with the BaseEventSchema in the deletion-policy package
export const BaseEventSchema = new mongoose.Schema<Omit<BaseEvent, "projectId">>(
  {
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
      required: true,
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

const BaseEventModel =
  (mongoose.models.BaseEvent as mongoose.Model<Omit<BaseEvent, "projectId">>) ||
  mongoose.model<Omit<BaseEvent, "projectId">>("BaseEvent", BaseEventSchema);

export default BaseEventModel;
