//
// README: Ensure this is in sync with the models defined in the api package
//

import { EventEnvironment, BaseEvent, Project, CustomEvent } from "bog-analytics";
import mongoose, { Schema, Types } from "mongoose";

export interface BaseEventInterface extends Omit<BaseEvent, 'projectId'>, Document {
  projectId: Types.ObjectId;
}
export interface ProjectInterface extends Project, Document { }
export interface CustomEventInterface extends Omit<Omit<CustomEvent, 'projectId'>, "eventTypeId">, Document {
  projectId: Types.ObjectId;
  eventTypeId: Types.ObjectId;
}


const ProjectSchema = new mongoose.Schema<ProjectInterface>(
  {
    projectName: { type: String, required: true, unique: true },
    clientApiKey: { type: String, required: true, unique: true },
    serverApiKey: { type: String, required: true, unique: true },
    privateData: { type: Boolean, default: false },
    deletionPolicy: { type: Number, default: -1 },
  },
  { timestamps: true }
);

const BaseEventSchema = new mongoose.Schema<BaseEventInterface>(
  {
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    projectId: { type: Schema.Types.ObjectId, required: true, ref: "Project" },
    environment: {
      type: String,
      required: true,
      enum: Object.values(EventEnvironment),
      default: EventEnvironment.DEVELOPMENT,
    },
  },
  { timestamps: true }
);

const CustomEventSchema = new mongoose.Schema<CustomEventInterface>(
  {
    properties: { type: Schema.Types.Mixed, required: true },
    eventTypeId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "CustomEventType",
    },
    projectId: { type: Schema.Types.ObjectId, required: true, ref: "Project" },
    environment: {
      type: String,
      required: true,
      enum: Object.values(EventEnvironment),
      default: EventEnvironment.DEVELOPMENT,
    },
  },
  { timestamps: true }
);

export const ProjectModel = mongoose.model<ProjectInterface>("Project", ProjectSchema);
export const BaseEventModel = mongoose.model<BaseEventInterface>(
  "BaseEvent",
  BaseEventSchema
);
export const CustomEventModel = mongoose.model<CustomEventInterface>(
  "CustomEvent",
  CustomEventSchema
);
