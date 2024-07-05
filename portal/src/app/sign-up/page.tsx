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
import { validateEmail } from "@/utils/string";
import Netlify from "assets/img/netlify.svg";
import { createAccount, getRoles, getSession, getVerificationStatus } from "@/actions/Auth";

export default function SignUp() {
    const { sessionExists, setUserId, setSessionExists, setIsAdmin, setIsVerified } = useContext(AuthContext);
    const { setCurrentScreen, isMobile } = useContext(ScreenContext);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isSigningUp, setIsSigningUp] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        setCurrentScreen(ScreenURLs.SIGN_UP)
        if (sessionExists) {
            router.push(urls.client.dashboard)
        }
    }, [sessionExists])

    const createUserAccount = async () => {
        setError("");
        if (password != confirmPassword) {
            setError("Password fields do not match!");
            return;
        }

        if (password.length < 6) {
            setError("Password should be at least 6 characters long!");
            return;

        }

        if (!validateEmail(email)) {
            setError("Invalid email provided!");
            return;

        }

        try {
            setIsSigningUp(true);
            const userId = await createAccount(email, password);
            setUserId(userId);
        } catch {
            setIsSigningUp(false);
            setError("An error occurred when signing up");
            return;
        }
        setSessionExists(await getSession());
        setIsAdmin((await getRoles()).includes(Role.ADMIN));
        setIsVerified(await getVerificationStatus());
        setIsSigningUp(false);
        router.push(urls.client.dashboard)
    }

    return (
        <main className="flex min-h-screen flex-row">
            <div className={`p-12 bg-[#fffcf4] text-black flex flex-col items-start md:min-w-[420px] ${isMobile ? "w-full" : ""} gap-y-6`}>
                <img src={Logo.src} className="h-24"></img>
                <h1 className="text-2xl font-bold">Sign Up</h1>
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
                    <div className="flex flex-col gap-y-2 w-full">
                        <label className="font-light">Confirm Password</label>
                        <input className="py-2 px-4 rounded-md outline outline-gray-400 outline-2 bg-[#fffcf4]" placeholder="confirm your password" type="password"
                            onChange={({ target }) => setConfirmPassword(target.value)}></input>
                    </div>

                    <div className="flex flex-col gap-y-2">
                        <button className={`p-2 hover:bg-[#FFC55A] bg-[#FF7574] rounded-lg text-white hover:duration-500 w-full ${isSigningUp ? "opacity-50" : ""}`} disabled={isSigningUp}
                            onClick={createUserAccount}>Sign Up</button>
                        <p className="text-sm text-gray-500">Already have an account? <Link className="text-blue-800 underline" href={urls.client.signIn}>Sign In</Link></p>
                        {error && <div className="text-sm text-red-500">
                            {error}
                        </div>}
                    </div>
                </div>
                <a href="https://www.netlify.com" className="mt-auto">
                    <img src={Netlify.src} className="h-12" />
                </a>
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
