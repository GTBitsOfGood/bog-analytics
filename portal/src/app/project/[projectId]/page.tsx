"use client"
import { useContext, useEffect } from "react";
import { ScreenContext } from "@/contexts/ScreenContext";
import { ScreenURLs } from "@/utils/types";
import Navigator from "@/components/Navigator";
import CustomEventTypesTable from "@/components/CustomEventTypesTable";
import CreateCustomEventTypeWidget from "@/components/CreateCustomEventTypeWidget";
import UpdatePrivateDataWidget from "@/components/UpdatePrivateDataWidget";
import UpdateDeletionPolicyWidget from "@/components/UpdateDeletionPolicyWidget";
import CustomEventCountTable from "@/components/CustomEventCountTable";


function ProjectPage({ params }: { params: { projectId: string } }) {

    const { setCurrentScreen, isMobile } = useContext(ScreenContext)
    useEffect(() => {
        setCurrentScreen(ScreenURLs.PROJECT)
    }, [])

    return (<main className={`flex min-h-screen ${isMobile ? "flex-col" : "flex-row"} bg-[#fffcf4] max-w-screen max-h-screen`}>
        <Navigator />
        <div className={`p-12 grow min-w-0 min-h-0 ${isMobile ? "min-h-0 overflow-y-scroll max-h-full" : ""} flex flex-col gap-y-2 overflow-y-scroll`}>
            <CreateCustomEventTypeWidget projectId={params.projectId} />
            <CustomEventTypesTable projectId={params.projectId} />
            <UpdatePrivateDataWidget projectId={params.projectId} />
            <UpdateDeletionPolicyWidget projectId={params.projectId} />
            <CustomEventCountTable projectId={params.projectId}></CustomEventCountTable>
        </div>
    </main>
    )
}

export default ProjectPage;