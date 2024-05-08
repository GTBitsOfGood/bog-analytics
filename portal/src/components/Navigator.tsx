"use client"

import { AuthContext } from "@/contexts/AuthContext";
import { ScreenContext } from "@/contexts/ScreenContext";
import { useContext, useEffect, useState } from "react";
import Logo from "assets/img/logo.png";
import { TabConfiguration } from "@/utils/types";
import { ADMIN_DASHBOARD_TABS, MEMBER_DASHBOARD_TABS } from "@/utils/constants";
import { DashboardContext } from "@/contexts/DashboardContext";
import { signOutFromAccount } from "@/actions/Auth";
import { useRouter } from "next/navigation";
import { urls } from "@/utils/urls";

export default function Navigator() {

    const { isMobile } = useContext(ScreenContext);
    const { setIsAdmin, setUserId, isAdmin, sessionExists, setSessionExists } = useContext(AuthContext);
    const { currentTab, setCurrentTab } = useContext(DashboardContext);
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
    const router = useRouter();

    const logout = async () => {
        setIsLoggingOut(true);
        await signOutFromAccount();
        setSessionExists(false);
        setIsAdmin(false);
        setUserId(null);
        setIsLoggingOut(false);
        router.push(urls.client.signIn);
    }

    const [tabs, setTabs] = useState<TabConfiguration[]>([]);
    useEffect(() => {
        if (isAdmin) {
            setTabs([...ADMIN_DASHBOARD_TABS])

        } else {
            setTabs([...MEMBER_DASHBOARD_TABS])
        }

    }, [sessionExists, isAdmin])

    const tabClickHandler = (tab: TabConfiguration) => {
        setCurrentTab(tab)
        router.push(urls.client.dashboard)
    }

    return (
        <div className="min-h-screen">
            {!isMobile && <div className={`px-10 py-6 text-black flex flex-col items-start md:min-w-[280px] ${isMobile ? "w-full" : ""} border-r-2 h-full`}>
                <img src={Logo.src} className="h-24"></img>
                <div className="flex flex-col gap-y-4 items-start">
                    {tabs.map((tab, index) =>
                        <button key={index} className={`text-lg ${currentTab.id !== tab.id ? "hover:outline hover:outline-2" : ""} hover:outline-orange-500 from-[#FFC55A] to-[#FF7574] py-1 px-2 w-full text-left rounded-lg 
                            ${currentTab.id === tab.id ? "bg-gradient-to-r text-white" : ""}
                            flex flex-row gap-x-2 items-center`}
                            onClick={() => tabClickHandler(tab)}
                        >
                            <tab.icon />{tab.name}
                        </button>
                    )}
                </div>
                <button className={`mt-auto px-2 py-1 text-center w-full rounded-lg hover:bg-gradient-to-r 
                    text-white hover:from-[#FFC55A] hover:to-[#FF7574] bg-[#FF7574] hover:duration-500 ${isLoggingOut ? "opacity-50" : ""}`} onClick={logout} disabled={isLoggingOut}>Sign Out</button>
            </div>}
        </div>
    );
}
