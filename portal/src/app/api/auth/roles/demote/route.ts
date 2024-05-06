import APIWrapper from "server/utils/APIWrapper";
import { APIWrapperType, InternalUser, Role } from "@/utils/types";
import { demoteUser } from "server/mongodb/actions/User";

interface DemoteUserRequest {
    email: string;
}
const route = APIWrapper({
    POST: {
        config: {
            requireToken: true,
            requiredVerifiedUser: true,
            roles: [Role.ADMIN]
        },
        handler: async (req) => {
            const body: DemoteUserRequest = await req.json();
            const user: InternalUser | null = await demoteUser(body.email);
            return user
        }
    },
})

export let GET: APIWrapperType, POST: APIWrapperType, PATCH: APIWrapperType, DELETE: APIWrapperType, PUT: APIWrapperType;
GET = POST = PATCH = POST = DELETE = PUT = route;