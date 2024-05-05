import { Lucia, User, Session } from "lucia";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { cookies } from "next/headers";
import { cache } from "react";
import { InternalUser } from "@/utils/types";
import dbConnect from "server/utils/dbConnect";

import { webcrypto } from "crypto";
import mongoose from "mongoose";
globalThis.crypto = webcrypto as Crypto;


(async () => {
    await dbConnect();
})();

const adapter = new MongodbAdapter(
    mongoose.connection.collection("sessions"),
    mongoose.connection.collection("users")
);
export const auth = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: process.env.NODE_ENV === "production"
        }
    },
    getUserAttributes: (attributes: Omit<InternalUser, "_id">) => {
        return {
            email: attributes.email,
            roles: attributes.roles
        };
    }
});

export const validateRequest = cache(
    async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
        const sessionId = cookies().get(auth.sessionCookieName)?.value ?? null;
        if (!sessionId) {
            return {
                user: null,
                session: null
            };
        }

        const result = await auth.validateSession(sessionId);
        // next.js throws when you attempt to set cookie when rendering page
        try {
            if (result.session && result.session.fresh) {
                const sessionCookie = auth.createSessionCookie(result.session.id);
                cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
            }
            if (!result.session) {
                const sessionCookie = auth.createBlankSessionCookie();
                cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
            }
        } catch { }
        return result;
    }
);


export const getUser = cache(async () => {
    const sessionId = cookies().get(auth.sessionCookieName)?.value ?? null;
    if (!sessionId) {
        return null;
    }

    const { user, session } = await auth.validateSession(sessionId);
    try {
        if (session && session.fresh) {
            const sessionCookie = auth.createSessionCookie(session.id);
            cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        }
        if (!session) {
            const sessionCookie = auth.createBlankSessionCookie();
            cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        }
    } catch {
        // Next.js throws error when attempting to set cookies when rendering page
        return null;
    }
    return user;
});

declare module "lucia" {
    interface Register {
        Lucia: typeof auth;
        DatabaseUserAttributes: Omit<InternalUser, "_id">;
    }
}

