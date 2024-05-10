"use client"
import { useContext, useEffect } from "react";
import { ScreenContext } from "@/contexts/ScreenContext";
import { ScreenURLs } from "@/utils/types";
import Navigator from "@/components/Navigator";
import CustomEventTypesTable from "@/components/CustomEventTypesTable";
import CreateCustomEventTypeWidget from "@/components/CreateCustomEventTypeWidget";


function ProjectPage({ params }: { params: { projectId: string } }) {

    const { setCurrentScreen, isMobile } = useContext(ScreenContext)
    useEffect(() => {
        setCurrentScreen(ScreenURLs.PROJECT)
    }, [])

    return (<main className={`flex min-h-screen ${isMobile ? "flex-col" : "flex-row"} bg-[#fffcf4] max-w-screen max-h-screen`}>
        <Navigator />
        <div className={`p-12 grow min-w-0 min-h-0 ${isMobile ? "min-h-0 overflow-y-scroll max-h-full" : ""} flex flex-col gap-y-2`}>
            <CreateCustomEventTypeWidget projectId={params.projectId} />
            <CustomEventTypesTable projectId={params.projectId} />
        </div>
    </main>
    )
}

export default ProjectPage;