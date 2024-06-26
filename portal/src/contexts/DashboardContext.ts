"use client"
import { MEMBER_DASHBOARD_TABS } from "@/utils/constants";
import { TabConfiguration } from "@/utils/types";
import { createContext } from "react";

export const DashboardContext = createContext({
    currentTab: MEMBER_DASHBOARD_TABS[0], setCurrentTab: (currentTab: TabConfiguration) => { },
    customEventTypeRefreshKey: false, setCustomEventTypeRefreshKey: (customEventTypeRefreshKey: boolean) => { },
    projectRefreshKey: false, setProjectRefreshKey: (projectRefreshKey: boolean) => { },
    openProjectDeletionModal: false, setOpenProjectDeletionModal: (openProjectDeletionModal: boolean) => { }
});