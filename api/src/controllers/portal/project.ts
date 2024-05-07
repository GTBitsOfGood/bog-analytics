import { deleteClickEventsByProject } from "@/src/actions/click-event";
import { deleteCustomEventsByProject } from "@/src/actions/custom-event";
import { deleteCustomEventTypesByProject } from "@/src/actions/custom-event-type";
import { deleteCustomGraphTypesByProject } from "@/src/actions/custom-graph-type";
import { deleteInputEventsByProject } from "@/src/actions/input-event";
import { createProject, deleteProjectByName, getProjectIDByName, getProjectsWithSensitiveInfo, getProjectByIdWithSensitiveInfo } from "@/src/actions/project";
import { deleteVisitEventsByProject } from "@/src/actions/visit-event";
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
        config: {
            requirePortalToken: true
        },
        handler: async (req: Request) => {
            const projectId = req.query.projectId;
            if (!projectId) {
                return await getProjectsWithSensitiveInfo();
            } else {
                return await getProjectByIdWithSensitiveInfo(projectId as string);
            }
        }
    },
    DELETE: {
        config: { requirePortalToken: true },
        handler: async (req: Request) => {
            const projectName: string = req.body.projectName;
            const projectId = await getProjectIDByName(projectName) as string;

            await deleteClickEventsByProject(projectId);
            await deleteInputEventsByProject(projectId);
            await deleteVisitEventsByProject(projectId);

            await deleteCustomEventsByProject(projectId);
            await deleteCustomEventTypesByProject(projectId);
            await deleteCustomGraphTypesByProject(projectId);

            return await deleteProjectByName(projectName);
        }
    },

});

export const portalProject = relogRequestHandler(projectRoute);