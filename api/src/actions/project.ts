import { Project } from "@/src/utils/types";
import { dbConnect } from "@/src/utils/db-connect";
import ProjectModel from "@/src/models/project";

export const createProject = async (project: Project) => {
    await dbConnect();
    const createdProject = await ProjectModel.create(project);
    return createdProject
}

export const getProjectByWebToken = async (webToken: string): Promise<Project | null> => {
    await dbConnect();

    return null
}