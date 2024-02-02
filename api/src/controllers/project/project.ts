import { createProject } from "@/src/actions/project";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { Project } from "@/src/utils/types";
import { randomUUID } from "crypto";
import { Request, Response } from "express";


const projectRoute = APIWrapper({
    POST: {
        config: {
            requireToken: false,
        },
        handler: async (req: Request, res: Response) => {
            const projectName: string = req.body.projectName;

            if (!projectName) {
                throw new Error("You must specify a project name to create a project!")
            }

            const apiKey: string = randomUUID();
            const project: Project = {
                projectName, apiKey
            }

            await createProject(project);
        },
    },
});

export const project = relogRequestHandler(projectRoute);