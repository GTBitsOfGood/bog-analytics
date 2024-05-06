import APIWrapper from "server/utils/APIWrapper";
import { APIWrapperType, Role } from "@/utils/types"
import { createProject, deleteProject, getProjects } from "server/mongodb/actions/Project";
import { NextRequest } from "next/server";

const route: APIWrapperType = APIWrapper({
    POST: {
        config: {
            requireToken: true,
            requiredVerifiedUser: true,
            roles: [Role.MEMBER, Role.ADMIN]
        },
        handler: async (req: NextRequest) => {
            const { projectName } = await req.json();
            return await createProject(projectName);
        },
    },
    GET: {
        config: {
            requireToken: true,
            requiredVerifiedUser: true,
            roles: [Role.MEMBER, Role.ADMIN]
        },
        handler: async () => {
            const projects = await getProjects();
            return projects;
        },
    },
    DELETE: {
        config: {
            requireToken: true,
            requiredVerifiedUser: true,
            roles: [Role.ADMIN]
        },
        handler: async (req: NextRequest) => {
            const { projectName } = await req.json();
            return await deleteProject(projectName);
        },
    }
});

export let GET: APIWrapperType, POST: APIWrapperType, PATCH: APIWrapperType, DELETE: APIWrapperType, PUT: APIWrapperType;
GET = POST = PATCH = POST = DELETE = PUT = route;