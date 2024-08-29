import { getProjectSettings, updateProjectSettings } from "@/actions/Project"
import { Project } from "bog-analytics"
import { useEffect, useState } from "react"

export default function UpdatePrivateDataWidget({ projectId }: { projectId: string }) {

    const [projectInfo, setProjectInfo] = useState<Partial<Project> | null>(null)
    const [updateSettings, setUpdateSettings] = useState<boolean>(false);
    useEffect(() => {
        const projectInfoSetter = async () => {
            const info = await getProjectSettings(projectId)
            setProjectInfo(info);
        }
        projectInfoSetter().then().catch()
    }, [updateSettings])
    return (
        <div className="text-black text-sm flex gap-y-2 flex-col">
            <div>
                <p className="text-sm"><span className="font-semibold">Keep Data Private:</span> Prevents outside entities from accessing your data. You will need to use your server API key to access the data</p>
            </div>
            <div className="flex flex-row gap-x-2 text-white">
                <button className={`px-2 py-1 bg-green-500 rounded-lg ${projectInfo?.privateData === true ? 'opacity-100' : 'opacity-50'}`}
                    onClick={async () => {
                        await updateProjectSettings(projectInfo?.projectName as string, true)
                        setUpdateSettings(!updateSettings)
                    }}
                    disabled={projectInfo?.privateData === true}
                >True</button>
                <button className={`px-2 py-1 bg-red-500 rounded-lg ${projectInfo?.privateData === false ? 'opacity-100' : 'opacity-50'}`}
                    onClick={async () => {
                        await updateProjectSettings(projectInfo?.projectName as string, false)
                        setUpdateSettings(!updateSettings)

                    }}
                    disabled={projectInfo?.privateData === false}
                >False</button>
            </div>
        </div>)
}
