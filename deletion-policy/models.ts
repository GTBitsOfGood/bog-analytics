// NOTE: Ensure this is in sync with the models defined in the api package

import { EventEnvironment } from "bog-analytics";
import mongoose, { Schema, Types } from "mongoose";

export interface BaseEvent extends Document {
  category: string;
  subcategory: string;
  projectId: string | Types.ObjectId;
  environment: EventEnvironment;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Project extends Document {
  _id: string | Types.ObjectId;
  clientApiKey: string;
  serverApiKey: string;
  projectName: string;
  privateData: boolean;
  deletionPolicy: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BaseEventWithoutCategory extends Document {
  projectId: string | Types.ObjectId;
  environment: EventEnvironment;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface CustomEvent extends BaseEventWithoutCategory {
  eventTypeId: string | Types.ObjectId;
  properties: object;
}

// Project Model
const ProjectSchema = new mongoose.Schema<Project>(
  {
    projectName: { type: String, required: true, unique: true },
    clientApiKey: { type: String, required: true, unique: true },
    serverApiKey: { type: String, required: true, unique: true },
    privateData: { type: Boolean, default: false },
    deletionPolicy: { type: Number, default: -1 },
  },
  { timestamps: true }
);

// Base Event Model
const BaseEventSchema = new mongoose.Schema<BaseEvent>(
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

// Custom Event Model
const CustomEventSchema = new mongoose.Schema<CustomEvent>(
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

export const ProjectModel = mongoose.model<Project>("Project", ProjectSchema);
export const BaseEventModel = mongoose.model<BaseEvent>(
  "BaseEvent",
  BaseEventSchema
);
export const CustomEventModel = mongoose.model<CustomEvent>(
  "CustomEvent",
  CustomEventSchema
);
