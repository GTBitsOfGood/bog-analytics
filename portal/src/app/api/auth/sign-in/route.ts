import { auth } from "server/auth";
import APIWrapper from "server/utils/APIWrapper";
import { cookies } from "next/headers";
import { APIWrapperType, InternalUser } from "@/utils/types";
import { getUserByEmail, validatePassword } from "server/mongodb/actions/User";

interface SignInRequestData {
    email: string;
    password: string;
}

const route = APIWrapper({
    POST: {
        config: {},
        handler: async (req) => {
            const body: SignInRequestData = await req.json()
            const existingUser: InternalUser | null = await getUserByEmail(body.email as string)
            if (!existingUser) {
                throw new Error("Invalid email");
            }
            const passwordVerification = await validatePassword(existingUser.passwordHash, body.password as string);
            if (!passwordVerification) {
                throw new Error("Invalid password");
            }
            const session = await auth.createSession(existingUser._id, {});
            const sessionCookie = auth.createSessionCookie(session.id);
            cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
            return existingUser._id;
        }
    }
})

export let GET: APIWrapperType, POST: APIWrapperType, PATCH: APIWrapperType, DELETE: APIWrapperType, PUT: APIWrapperType;
GET = POST = PATCH = POST = DELETE = PUT = route;