import { validateRequest } from "server/auth";
import APIWrapper from "server/utils/APIWrapper";
import { APIWrapperType } from "@/utils/types";

const route = APIWrapper({
    GET: {
        config: {},
        handler: async (req) => {
            const { user } = await validateRequest();
            if (!user) {
                return [];
            }
            return user.roles;
        }
    }
})

export let GET: APIWrapperType, POST: APIWrapperType, PATCH: APIWrapperType, DELETE: APIWrapperType, PUT: APIWrapperType;
GET = POST = PATCH = POST = DELETE = PUT = route;