import { createProject, getProjectIDByName, getProjectsWithSensitiveInfo } from "@/src/actions/project";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { Project } from "@/src/utils/types";
import { randomUUID } from "crypto";
import { Request } from "express";


const projectRoute = APIWrapper({
    POST: {
        config: {
            requirePortalToken: true
        },
        handler: async (req: Request) => {
            const projectName: string = req.body.projectName;
            if (!projectName) {
                throw new Error("You must specify a project name to create a project!")
            }

            const clientApiKey: string = randomUUID();
            const serverApiKey: string = randomUUID();

            const project: Partial<Project> = {
                projectName, clientApiKey, serverApiKey
            }

            const preexistingProject = await getProjectIDByName(projectName);
            if (preexistingProject) {
                throw new Error("A project with this name already exists")
            }

            const createdProject = await createProject(project);
            return createdProject
        },
    },
    GET: {
        config: {},
        handler: async (req: Request) => {
            return getProjectsWithSensitiveInfo();
        }
    }

});

export const portalProject = relogRequestHandler(projectRoute);