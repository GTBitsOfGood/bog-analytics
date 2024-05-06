"use client"

import { AuthContext } from "@/contexts/AuthContext";
import { ScreenContext } from "@/contexts/ScreenContext";
import { ScreenURLs, TabConfiguration } from "@/utils/types";
import React, { useContext, useEffect, useState } from "react";
import Logo from "assets/img/logo.png";
import { ADMIN_DASHBOARD_TABS, MEMBER_DASHBOARD_TABS } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { urls } from "@/utils/urls";
import { signOutFromAccount } from "@/actions/Auth";

export default function Dashboard() {
    const { setCurrentScreen, isMobile } = useContext(ScreenContext);
    const { isAdmin, sessionExists, setSessionExists, setIsAdmin, setUserId } = useContext(AuthContext);
    const [tabs, setTabs] = useState<TabConfiguration[]>([]);
    const [selectedTab, setSelectedTab] = useState<TabConfiguration>(MEMBER_DASHBOARD_TABS[0]);
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if (sessionExists !== null && !sessionExists) {
            router.push(urls.client.signIn);
            return;
        }
        setCurrentScreen(ScreenURLs.DASHBOARD)
        if (isAdmin) {
            setTabs([...ADMIN_DASHBOARD_TABS])

        } else {
            setTabs([...ADMIN_DASHBOARD_TABS])
        }

    }, [sessionExists, isAdmin])

    const changeTab = (tab: TabConfiguration) => {
        setSelectedTab(tab);
    }

    const logout = async () => {
        setIsLoggingOut(true);
        await signOutFromAccount();
        setSessionExists(false);
        setIsAdmin(false);
        setUserId(null);
        setIsLoggingOut(false);
        router.push(urls.client.signIn);
    }

    return (
        <main className="flex min-h-screen flex-row bg-[#fffcf4]">
            {!isMobile && <div className={`px-10 py-6 text-black flex flex-col items-start md:min-w-[220px] ${isMobile ? "w-full" : ""} border-r-2`}>
                <img src={Logo.src} className="h-24"></img>
                <div className="flex flex-col gap-y-4 items-start">
                    {tabs.map((tab) =>
                        <button className={`text-lg ${selectedTab.id !== tab.id ? "hover:outline hover:outline-2" : ""} hover:outline-orange-500 from-[#FFC55A] to-[#FF7574] py-1 px-2 w-full text-left rounded-lg 
                            ${selectedTab.id === tab.id ? "bg-gradient-to-r text-white" : ""}
                            flex flex-row gap-x-2 items-center`}
                            onClick={() => changeTab(tab)}
                        >
                            <tab.icon />{tab.name}
                        </button>
                    )}
                </div>
                <button className={`mt-auto px-2 py-1 text-center w-full rounded-lg hover:bg-gradient-to-r 
                    text-white hover:from-[#FFC55A] hover:to-[#FF7574] bg-[#FF7574] hover:duration-500 ${isLoggingOut ? "opacity-50" : ""}`} onClick={logout} disabled={isLoggingOut}>Sign Out</button>
            </div>}
            <div className="p-12 grow">
                {selectedTab.component()}
            </div>
        </main>
    );
}
