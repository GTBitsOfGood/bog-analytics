import { Project } from "@/src/utils/types";
import { dbConnect } from "@/src/utils/db-connect";
import ProjectModel from "@/src/models/project";

export const createProject = async (project: Project) => {
    await dbConnect();
    const createdProject = await ProjectModel.create(project);
    return createdProject
}

export const getProjectByClientKey = async (clientApiKey: string): Promise<Project | null> => {
    await dbConnect();
    return await ProjectModel.findOne({ clientApiKey });
}

export const getProjectByServerKey = async (serverApiKey: string): Promise<Project | null> => {
    await dbConnect();
    return await ProjectModel.findOne({ serverApiKey });
}