import APIWrapper from "server/utils/APIWrapper";
import { APIWrapperType, Role } from "@/utils/types"
import { getProject, updateProject } from "server/mongodb/actions/Project";
import { NextRequest } from "next/server";

const route: APIWrapperType = APIWrapper({
    PATCH: {
        config: {
            requireToken: true,
            requiredVerifiedUser: true,
            roles: [Role.MEMBER, Role.ADMIN]
        },
        handler: async (req: NextRequest) => {
            const { projectName, privateData, deletionPolicy } = await req.json();
            return await updateProject(projectName, privateData, deletionPolicy);
        },
    },
    GET: {
        config: {
            requireToken: true,
            requiredVerifiedUser: true,
            roles: [Role.MEMBER, Role.ADMIN]
        },
        handler: async (req: NextRequest) => {
            const projectName = req.nextUrl.searchParams.get('projectName') as string;
            const project = await getProject(projectName);

            return {
                privateData: project.privateData,
                projectName: project.projectName,
                deletionPolicy: project.deletionPolicy
            }
        },
    },

});

export let GET: APIWrapperType, POST: APIWrapperType, PATCH: APIWrapperType, DELETE: APIWrapperType, PUT: APIWrapperType;
GET = POST = PATCH = POST = DELETE = PUT = route;