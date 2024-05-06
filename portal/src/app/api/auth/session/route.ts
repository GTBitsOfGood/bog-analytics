import { auth, validateRequest } from "server/auth";
import APIWrapper from "server/utils/APIWrapper";
import * as context from "next/headers";
import { APIWrapperType } from "@/utils/types";

const route = APIWrapper({
    GET: {
        config: {},
        handler: async (req) => {
            const { session } = await validateRequest();
            return session && session.expiresAt >= new Date();
        }
    }
})

export let GET: APIWrapperType, POST: APIWrapperType, PATCH: APIWrapperType, DELETE: APIWrapperType, PUT: APIWrapperType;
GET = POST = PATCH = POST = DELETE = PUT = route;