import mongoose from "mongoose";
import { Project } from "@/src/utils/types";

export const ProjectSchema = new mongoose.Schema<Project>({
    apiKey: {
        type: String,
        required: true,
    },
    projectName: {
        type: String,
        required: true,
    },
},
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        }
    });

const ProjectModel =
    (mongoose.models.Project as mongoose.Model<Project>) ||
    mongoose.model<Project>("Project", ProjectSchema);

export default ProjectModel;