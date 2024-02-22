import { createProject } from "@/src/actions/project";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { Project } from "@/src/utils/types";
import { randomUUID } from "crypto";
import { Request } from "express";


const projectRoute = APIWrapper({
    POST: {
        config: {
            developmentRoute: true
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

            const createdProject = await createProject(project);
            return createdProject
        },
    },
});

export const project = relogRequestHandler(projectRoute);