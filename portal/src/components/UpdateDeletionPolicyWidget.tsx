import { getProjectSettings, updateProjectSettings } from "@/actions/Project"
import { Project } from "bog-analytics"
import { ChangeEvent, useEffect, useState } from "react"

export default function UpdateDeletionPolicyWidget({ projectId }: { projectId: string }) {

    const [projectInfo, setProjectInfo] = useState<Partial<Project> | null>(null)
    const [updateSettings, setUpdateSettings] = useState<boolean>(false);
    const [initialLoad, setInitialLoad] = useState<boolean>(true);
    const [deletionPolicyDays, setDeletionPolicyDays] = useState<number>(0);
    const [savingPolicy, setSavingPolicy] = useState<boolean>(false);
    useEffect(() => {
        const projectInfoSetter = async () => {
            const info = await getProjectSettings(projectId)
            setProjectInfo(info);
            if (initialLoad) {
                setDeletionPolicyDays(info.deletionPolicy);
            }
        }
        projectInfoSetter().then().catch()
        setInitialLoad(false)
    }, [updateSettings])

    const deletionPolicyHandler = async (event: ChangeEvent<HTMLInputElement>) => {
        if (!projectInfo) {
            return
        }

        if (Number.isNaN(event.target.value) || !event.target.value) {
            return
        }
        setDeletionPolicyDays(parseInt(event.target.value))
    }

    const saveDeletionPolicy = async () => {
        setSavingPolicy(true)
        await updateProjectSettings(projectInfo?.projectName as string, undefined, deletionPolicyDays)
        setUpdateSettings(!updateSettings)
        setSavingPolicy(false)
    }
    return (
        <div className="text-black text-sm flex gap-y-2 flex-col">
            <p className="text-sm"><span className="font-semibold">Deletion Policy (Days):</span> Data older than the specified policy will be deleted. Negative numbers indicate to never delete the data.</p>
            <div className="flex flex-row gap-x-2 w-full">
                <input
                    value={deletionPolicyDays}
                    onChange={deletionPolicyHandler}
                    className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={async () => {
                        await saveDeletionPolicy()
                    }}
                    disabled={savingPolicy}
                    className={`${savingPolicy ? "opacity-50" : 'opacity-100'} py-2 px-3 hover:from-[#FFC55A] hover:to-[#FF7574] hover:bg-gradient-to-r bg-[#FF7574] hover:duration-500 w-fit rounded-lg text-white`}>Save</button>
            </div>
        </div>)
}
