import APIWrapper from "server/utils/APIWrapper";
import { APIWrapperType, Role } from "@/utils/types"
import { getAllUsers } from "server/mongodb/actions/User";

const route: APIWrapperType = APIWrapper({
    GET: {
        config: {
            requireToken: true,
            requiredVerifiedUser: true,
            roles: [Role.ADMIN]
        },
        handler: async () => {
            return await getAllUsers()
        },
    }
});

export let GET: APIWrapperType, POST: APIWrapperType, PATCH: APIWrapperType, DELETE: APIWrapperType, PUT: APIWrapperType;
GET = POST = PATCH = POST = DELETE = PUT = route;