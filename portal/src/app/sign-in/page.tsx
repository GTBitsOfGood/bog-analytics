"use client"

import { AuthContext } from "@/contexts/AuthContext";
import { ScreenContext } from "@/contexts/ScreenContext";
import { Role, ScreenURLs } from "@/utils/types";
import { urls } from "@/utils/urls";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Logo from "assets/img/logo.png";
import AnalyticsLogin from "assets/img/analytics-login.svg";
import AnalyticsLogin2 from "assets/img/analytics-login-2.svg";
import Link from "next/link";
import { getRoles, getSession, loginToAccount } from "@/actions/Auth";
import { validateEmail } from "@/utils/string";

export default function SignIn() {
    const { sessionExists, setIsAdmin, setSessionExists, setUserId } = useContext(AuthContext);
    const { setCurrentScreen, isMobile } = useContext(ScreenContext);
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

    useEffect(() => {
        setCurrentScreen(ScreenURLs.SIGN_IN)
        if (sessionExists) {
            router.push(urls.client.dashboard)
        }
    }, [sessionExists])

    const signInToAccount = async () => {
        setError("");
        if (!password || !email) {
            setError("Email or password cannot be empty!");
            return;

        }

        if (!validateEmail(email)) {
            setError("Invalid email provided!");
            return;

        }
        try {
            setIsLoggingIn(true);
            const userId = await loginToAccount(email, password);
            setUserId(userId);
        } catch {
            setIsLoggingIn(false);
            setError("Incorrect login information provided!")
            return;
        }
        setSessionExists(await getSession());
        setIsAdmin((await getRoles()).includes(Role.ADMIN))
        setIsLoggingIn(false);
        router.push(urls.client.dashboard)
    }


    return (
        <main className="flex min-h-screen flex-row">
            <div className={`p-12 bg-[#fffcf4] text-black flex flex-col items-start md:min-w-[420px] ${isMobile ? "w-full" : ""} gap-y-6`}>
                <img src={Logo.src} className="h-24"></img>
                <h1 className="text-2xl font-bold">Sign In</h1>
                <div className="flex flex-col gap-y-6 w-full">
                    <div className="flex flex-col gap-y-2">
                        <label className="font-light">Email Address</label>
                        <input className="py-2 px-4 rounded-md outline outline-gray-400 outline-2 bg-[#fffcf4]" placeholder="your email"
                            onChange={({ target }) => setEmail(target.value)}></input>
                    </div>
                    <div className="flex flex-col gap-y-2 w-full">
                        <label className="font-light">Password</label>
                        <input className="py-2 px-4 rounded-md outline outline-gray-400 outline-2 bg-[#fffcf4]" placeholder="your password" type="password"
                            onChange={({ target }) => setPassword(target.value)}></input>
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <button className={`p-2 hover:bg-[#FFC55A] bg-[#FF7574] rounded-lg text-white hover:duration-500 w-full ${isLoggingIn ? "opacity-50" : ""}`} onClick={signInToAccount} disabled={isLoggingIn}>Sign In</button>
                        <p className="text-sm text-gray-500">Don't have an account? <Link className="text-blue-800 underline" href={urls.client.signUp}>Sign Up</Link></p>
                        {error && <div className="text-sm text-red-500">
                            {error}
                        </div>}
                    </div>
                </div>
            </div>
            {!isMobile && <div className="bg-[#ffaa63] grow p-12 flex flex-col justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold">BoG Analytics Platform</h2>
                    <h3 className="text-md font-light">Access and configure all of your analytics settings.</h3>
                </div>
                <div className="flex flex-row">
                    <img src={AnalyticsLogin.src} className="h-96"></img>
                    <img src={AnalyticsLogin2.src} className="h-96"></img>
                </div>
            </div>}
        </main>
    );
}
