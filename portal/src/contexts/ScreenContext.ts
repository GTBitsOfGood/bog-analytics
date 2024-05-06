"use client"
import { ScreenURLs } from "@/utils/types";
import { createContext } from "react";

export const ScreenContext = createContext({
    isMobile: false, setIsMobile: (isMobile: boolean) => { },
    currentScreen: ScreenURLs.HOME, setCurrentScreen: (screen: ScreenURLs) => { },
});