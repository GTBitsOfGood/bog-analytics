import { Project } from "../utils/types";
import { dbConnect } from "../utils/db-connect";
import ProjectModel from "../models/project";

export const createProject = async (project: Partial<Project>) => {
    await dbConnect();
    const createdProject = await ProjectModel.create(project);
    return createdProject
}

export const getProjectByName = async (projectName: string) => {
    await dbConnect();
    const project = await ProjectModel.findOne({ projectName });
    return project
}

export const getProjectIDByName = async (projectName: string) => {
    await dbConnect();
    const project = await ProjectModel.findOne({ projectName });
    return project?._id
}
export const getProjectByClientKey = async (clientApiKey: string): Promise<Project | null> => {
    await dbConnect();
    return await ProjectModel.findOne({ clientApiKey });
}

export const getProjectByServerKey = async (serverApiKey: string): Promise<Project | null> => {
    await dbConnect();
    return await ProjectModel.findOne({ serverApiKey });
}

export const deleteProjectById = async (projectId: string) => {
    await dbConnect();
    return await ProjectModel.findOneAndDelete({ _id: projectId });
}

export const getAllProjects = async () => {
    await dbConnect();
    return await ProjectModel.find({}).select("projectName _id privateData deletionPolicy");

}

export const getProjectsWithSensitiveInfo = async () => {
    await dbConnect();
    return await ProjectModel.find({});
}

export const getProjectByIdWithSensitiveInfo = async (projectId: string) => {
    await dbConnect();
    return await ProjectModel.findOne({ _id: projectId });
}

export const deleteProjectByName = async (projectName: string) => {
    await dbConnect();
    return await ProjectModel.deleteOne({ projectName });
}

export const validatePrivateData = async (projectName: string, serverToken: string | null | undefined) => {
    const project = await getProjectByName(projectName);
    if (!project) {
        return false
    }
    const validateServerToken = serverToken ? await getProjectByServerKey(serverToken) : null;
    if (project.privateData) {
        if (!validateServerToken) {
            return false
        }
    }
    return true

}

export const updateProjectByName = async (projectName: string, updates: Partial<Project>) => {
    await dbConnect();
    return await ProjectModel.findOneAndUpdate({ projectName }, updates)
}