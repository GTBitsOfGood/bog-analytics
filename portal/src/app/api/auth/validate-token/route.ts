import APIWrapper from "server/utils/APIWrapper";
import { APIWrapperType } from "@/utils/types";
import { validatePortalToken } from "server/mongodb/actions/Auth";

const route = APIWrapper({
    POST: {
        config: {},
        handler: async (req) => {
            const { portalToken } = await req.json();
            return validatePortalToken(portalToken)
        }
    }
})

export let GET: APIWrapperType, POST: APIWrapperType, PATCH: APIWrapperType, DELETE: APIWrapperType, PUT: APIWrapperType;
GET = POST = PATCH = POST = DELETE = PUT = route;