"use client"

import { AuthContext } from "@/contexts/AuthContext";
import { ScreenContext } from "@/contexts/ScreenContext";
import { ScreenURLs } from "@/utils/types";
import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { urls } from "@/utils/urls";
import Projects from "@/components/Projects";
import UserManagement from "@/components/UserManagement";
import CreateProject from "@/components/CreateProject";
import { DashboardContext } from "@/contexts/DashboardContext";
import Navigator from "@/components/Navigator";

export default function Dashboard() {
    const { setCurrentScreen } = useContext(ScreenContext);
    const { sessionExists } = useContext(AuthContext);
    const { currentTab } = useContext(DashboardContext);
    const router = useRouter();

    useEffect(() => {
        if (sessionExists !== null && !sessionExists) {
            router.push(urls.client.signIn);
            return;
        }
        setCurrentScreen(ScreenURLs.DASHBOARD)

    }, [sessionExists])

    return (
        <main className="flex min-h-screen flex-row bg-[#fffcf4] max-w-screen max-h-screen">
            <Navigator></Navigator>
            <div className="p-12 grow min-w-0">
                {currentTab.id === "project-list" && <Projects />}
                {currentTab.id === "create-project" && <CreateProject />}
                {currentTab.id === "user-management" && <UserManagement />}
            </div>
        </main>
    );
}
