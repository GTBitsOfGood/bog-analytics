import mongoose from "mongoose";
import { Project } from "@/src/utils/types";

// NOTE: Ensure this is in sync with the ProjectSchema in the deletion-policy package
export const ProjectSchema = new mongoose.Schema<Project>(
  {
    clientApiKey: {
      type: String,
      required: true,
    },
    serverApiKey: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
      unique: true,
    },
    privateData: {
      type: Boolean,
      required: true,
      default: false,
    },
    deletionPolicy: {
      type: Number,
      required: true,
      default: -1,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const ProjectModel =
  (mongoose.models.Project as mongoose.Model<Project>) ||
  mongoose.model<Project>("Project", ProjectSchema);

export default ProjectModel;
