import { auth, validateRequest } from "server/auth";
import APIWrapper from "server/utils/APIWrapper";
import { APIWrapperType } from "@/utils/types";
import { cookies } from "next/headers";

const route = APIWrapper({
    POST: {
        config: {},
        handler: async (req) => {
            const { session } = await validateRequest();
            if (!session) {
                throw new Error("Unauthorized")
            }

            await auth.invalidateSession(session.id);
            const sessionCookie = auth.createBlankSessionCookie();
            cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        }
    }
})

export let GET: APIWrapperType, POST: APIWrapperType, PATCH: APIWrapperType, DELETE: APIWrapperType, PUT: APIWrapperType;
GET = POST = PATCH = POST = DELETE = PUT = route;
