"use client";
import React, { useEffect, useState } from "react";
import { getRoles, getSession, getUserId } from '@/actions/Auth'

import { AuthContext } from "@/contexts/AuthContext";
import { DashboardContext } from "@/contexts/DashboardContext";
import { Role, ScreenURLs, TabConfiguration } from "@/utils/types";
import { ScreenContext } from "@/contexts/ScreenContext";
import { MEMBER_DASHBOARD_TABS } from "@/utils/constants";

export default function ContextProvider({
    children
}: {
    children: React.ReactNode
}) {
    const [sessionExists, setSessionExists] = useState<boolean | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [currentScreen, setCurrentScreen] = useState<ScreenURLs>(ScreenURLs.HOME)
    const [currentTab, setCurrentTab] = useState<TabConfiguration>(MEMBER_DASHBOARD_TABS[0])
    const [customEventTypeRefreshKey, setCustomEventTypeRefreshKey] = useState<boolean>(false);

    useEffect(() => {
        const sessionSetter = async () => {
            const session = await getSession();
            setSessionExists(session ?? false);
        }

        const adminSetter = async () => {
            const admin = (await getRoles()).includes(Role.ADMIN);
            setIsAdmin(admin);
        }

        const userIdSetter = async () => {
            const id = await getUserId();
            if (id) {
                setUserId(id);
            }
        }
        const handleResize = () => {
            const mobileWidthThreshold = 768;
            setIsMobile(window.innerWidth < mobileWidthThreshold);

        };

        sessionSetter().then().catch();
        adminSetter().then().catch();
        userIdSetter().then().catch()
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, [])

    return (
        <ScreenContext.Provider value={{
            isMobile, setIsMobile: (mobile: boolean) => {
                setIsMobile(mobile)
            },
            currentScreen, setCurrentScreen: (screen: ScreenURLs) => {
                setCurrentScreen(screen);
            },
        }}>
            <AuthContext.Provider value={{
                sessionExists, setSessionExists: (session: boolean | null) => {
                    setSessionExists(session)
                }, isAdmin, setIsAdmin: (isAdmin: boolean | null) => {
                    setIsAdmin(isAdmin)
                }, userId, setUserId: (id: string | null) => {
                    setUserId(id)
                }
            }}>
                <DashboardContext.Provider value={{
                    currentTab, setCurrentTab: (tab: TabConfiguration) => {
                        setCurrentTab(tab)
                    },
                    customEventTypeRefreshKey, setCustomEventTypeRefreshKey: (refreshKey) => {
                        setCustomEventTypeRefreshKey(refreshKey)
                    }
                }}>
                    {children}
                </DashboardContext.Provider>
            </AuthContext.Provider>
        </ScreenContext.Provider>)
}