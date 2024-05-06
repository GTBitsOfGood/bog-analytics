import { validateRequest } from "server/auth";
import APIWrapper from "server/utils/APIWrapper";
import { APIWrapperType } from "@/utils/types";

const route = APIWrapper({
    GET: {
        config: {},
        handler: async (req) => {
            const { user } = await validateRequest();
            if (!user) {
                return null;
            }
            return user._id;
        }
    }
})

export let GET: APIWrapperType, POST: APIWrapperType, PATCH: APIWrapperType, DELETE: APIWrapperType, PUT: APIWrapperType;
GET = POST = PATCH = POST = DELETE = PUT = route;