import { auth } from "server/auth";
import APIWrapper from "server/utils/APIWrapper";
import { createUser } from "server/mongodb/actions/User";
import { APIWrapperType } from "@/utils/types";
import { cookies } from "next/headers";

interface SignUpRequestData {
    email: string;
    password: string;
}

const route = APIWrapper({
    POST: {
        config: {},
        handler: async (req) => {
            const body: SignUpRequestData = await req.json();
            const user = await createUser(body.email as string, body.password as string)
            const session = await auth.createSession(user._id, {});
            const sessionCookie = auth.createSessionCookie(session.id);
            cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
            return user._id;
        }
    }
})

export let GET: APIWrapperType, POST: APIWrapperType, PATCH: APIWrapperType, DELETE: APIWrapperType, PUT: APIWrapperType;
GET = POST = PATCH = POST = DELETE = PUT = route;