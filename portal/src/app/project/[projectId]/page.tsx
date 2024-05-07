"use client"
import { useContext, useEffect } from "react";
import { ScreenContext } from "@/contexts/ScreenContext";
import { ScreenURLs } from "@/utils/types";
import Navigator from "@/components/Navigator";
import CustomEventTypesTable from "@/components/CustomEventTypesTable";


function ProjectPage({ params }: { params: { projectId: string } }) {

    const { setCurrentScreen } = useContext(ScreenContext)
    useEffect(() => {
        setCurrentScreen(ScreenURLs.PROJECT)
    }, [])

    return (<main className="flex min-h-screen flex-row bg-[#fffcf4] max-w-screen max-h-screen text-black">
        <Navigator />
        <div className="p-12 grow min-w-0">
            <CustomEventTypesTable projectId={params.projectId} />
        </div>
    </main>
    )
}

export default ProjectPage;