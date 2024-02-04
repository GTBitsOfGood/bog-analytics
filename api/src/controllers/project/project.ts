import { createProject } from "@/src/actions/project";
import { relogRequestHandler } from "@/src/middleware/request-middleware";
import APIWrapper from "@/src/utils/api-wrapper";
import { Project } from "@/src/utils/types";
import { randomUUID } from "crypto";
import { Request } from "express";


const projectRoute = APIWrapper({
    POST: {
        config: {
            requireToken: false,
            developmentRoute: true
        },
        handler: async (req: Request) => {
            const projectName: string = req.body.projectName;
            console.log("HERE")
            if (!projectName) {
                throw new Error("You must specify a project name to create a project!")
            }

            const apiKey: string = randomUUID();
            const project: Project = {
                projectName, apiKey
            }
            console.log(project)

            const createdProject = await createProject(project);
            return createdProject
        },
    },
});

export const project = relogRequestHandler(projectRoute);