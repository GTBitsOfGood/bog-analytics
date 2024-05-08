"use client"
import { createContext } from "react";

export const AuthContext = createContext<{
    sessionExists: boolean | null,
    setSessionExists: (session: boolean | null) => void,
    isVerified: boolean | null,
    setIsVerified: (session: boolean | null) => void,
    isAdmin: boolean | null,
    setIsAdmin: (isAdmin: boolean | null) => void,
    userId: string | null,
    setUserId: (id: string | null) => void
}>({
    sessionExists: null,
    setSessionExists: (session: boolean | null) => { },
    isVerified: null,
    setIsVerified: (verified: boolean | null) => { },
    isAdmin: null,
    setIsAdmin: (isAdmin: boolean | null) => { },
    userId: null,
    setUserId: (id: string | null) => { }
});
