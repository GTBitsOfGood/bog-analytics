"use client"

import { deleteProject, getProjects } from "@/actions/Project";
import { AuthContext } from "@/contexts/AuthContext";
import { DashboardContext } from "@/contexts/DashboardContext";
import { MEMBER_DASHBOARD_TABS } from "@/utils/constants";
import { copyToClipboard } from "@/utils/string";
import { TabConfiguration } from "@/utils/types";
import { urls } from "@/utils/urls";
import { IconCopy } from "@tabler/icons-react";
import { Project } from "bog-analytics";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import DeleteProjectModal from "./DeleteProjectModal";

export default function Projects() {

    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedDeletionProject, setSelectedDeletionProject] = useState<string>("");

    const { sessionExists, isAdmin, isVerified } = useContext(AuthContext);
    const { setCurrentTab, projectRefreshKey, setOpenProjectDeletionModal } = useContext(DashboardContext);
    const router = useRouter();
    useEffect(() => {
        const projectSetter = async () => {
            const retrievedProjects = await getProjects();
            setProjects([...retrievedProjects]);
        }

        if (sessionExists && isVerified) {
            projectSetter().then().catch();
        }
    }, [sessionExists, projectRefreshKey, isVerified])

    const deletionModalHandler = (projectName: string) => {
        setSelectedDeletionProject(projectName)
        setOpenProjectDeletionModal(true)
    }

    return (
        <main className="h-full w-full flex flex-col gap-y-2">
            <button className="p-2 hover:from-[#FFC55A] hover:to-[#FF7574] hover:bg-gradient-to-r bg-[#FF7574] hover:duration-500 w-fit rounded-lg" onClick={() => {
                const createProjectTab = MEMBER_DASHBOARD_TABS.filter((tab: TabConfiguration) => tab.id === "create-project")
                setCurrentTab(createProjectTab[0]);
            }}>Create Project</button>
            {
                isVerified !== null && !isVerified && <div className="text-xs text-red-500 uppercase py-2 rounded-lg font-bold">You must be verified to view projects</div>
            }
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-full w-full overflow-x-scroll">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 h-full">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Project name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Client API Key
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Server API Key
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Private Data
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Deletion Policy
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Project Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            isVerified && projects.map((project: Project, index: number) => {
                                return (
                                    <tr className="odd:bg-white even:bg-gray-50 border-b" key={index}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {project.projectName}
                                        </th>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-row gap-x-4 items-center">
                                                •••••••
                                                <IconCopy className="h-5 w-5 cursor-pointer hover:bg-blue-100 rounded-lg p-1" onClick={() => copyToClipboard(project.clientApiKey)} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-row gap-x-4 items-center">
                                                •••••••
                                                <IconCopy className="h-5 w-5 cursor-pointer hover:bg-blue-100 rounded-lg p-1" onClick={() => copyToClipboard(project.serverApiKey)} />
                                            </div>
                                        </td>
                                        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                                            {!project.privateData && <div className="py-1 px-2 rounded-lg text-white font-normal bg-red-500 w-fit">
                                                {project.privateData.toString()}
                                            </div>}
                                            {project.privateData && <div className="py-1 px-2 rounded-lg text-white font-normal bg-green-500 w-fit">
                                                {project.privateData.toString()}
                                            </div>}
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                                            {project.deletionPolicy <= 0 ? "Never Delete" : project.deletionPolicy + " Days"}                                        </th>
                                        <td className="px-6 py-4 flex flex-row gap-x-2">
                                            <button className="font-medium text-blue-600 hover:underline" onClick={() => router.push(`${urls.client.project}/${project._id}`)}>Manage</button>
                                            {isAdmin && <button className={`font-medium text-red-600 hover:underline`} onClick={() => deletionModalHandler(project.projectName)}
                                                data-modal-target="deletion-modal"
                                                data-modal-toggle="deletion-modal" >Delete</button>}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <DeleteProjectModal projectName={selectedDeletionProject}></DeleteProjectModal>
        </main>
    );
}
