import APIWrapper from "server/utils/APIWrapper";
import { APIWrapperType, Role } from "@/utils/types"
import { getProjects } from "server/mongodb/actions/Project";

const route: APIWrapperType = APIWrapper({
    POST: {
        config: {
            requireToken: true,
            requiredVerifiedUser: true,
            roles: [Role.ADMIN]
        },
        handler: async () => {

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
    }
});

export let GET: APIWrapperType, POST: APIWrapperType, PATCH: APIWrapperType, DELETE: APIWrapperType, PUT: APIWrapperType;
GET = POST = PATCH = POST = DELETE = PUT = route;