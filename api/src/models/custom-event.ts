import mongoose, { Schema } from "mongoose";
import { CustomEvent, EventEnvironment } from "@/src/utils/types";
import CustomEventTypeModel from "@/src/models/custom-event-type";
import ProjectModel from "./project";

// NOTE: Ensure this is in sync with the CustomEventSchema in the deletion-policy package
const CustomEventSchema = new Schema<CustomEvent>(
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
    projectId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: ProjectModel.modelName,
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
  (mongoose.models.CustomEvent as mongoose.Model<CustomEvent>) ||
  mongoose.model<CustomEvent>("CustomEvent", CustomEventSchema);

export default CustomEventModel;
