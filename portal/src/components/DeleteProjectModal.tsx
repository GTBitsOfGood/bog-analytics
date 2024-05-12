"use client"

import { deleteProject } from "@/actions/Project";
import { DashboardContext } from "@/contexts/DashboardContext";
import { IconTrash, IconX } from "@tabler/icons-react";
import { DOMAttributes, MouseEventHandler, useContext, useState } from "react";

export default function DeleteProjectModal({ projectName }: { projectName: string }) {

    const [confirmProjectName, setConfirmProjectName] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [projectInDeletion, setProjectInDeletion] = useState<boolean>(false);
    const { setProjectRefreshKey, projectRefreshKey, setOpenProjectDeletionModal, openProjectDeletionModal } = useContext(DashboardContext);

    const projectDeletionHandler = async (projectName: string) => {
        setProjectInDeletion(true);
        await deleteProject(projectName)
        setProjectRefreshKey(!projectRefreshKey)
        setProjectInDeletion(false);
    }

    const deletionWrapper = async () => {
        setError("");
        if (projectName !== confirmProjectName) {
            setError("Project name does not match!")
            return;
        }
        await projectDeletionHandler(projectName);
        setOpenProjectDeletionModal(false);
    }

    const closeHandler = (event: { target: any; currentTarget: any; }) => {
        if (event.target !== event.currentTarget) {
            return
        }
        setOpenProjectDeletionModal(false)
    }

    return (
        <div className={`${openProjectDeletionModal ? "absolute top-0 left-0 h-screen w-screen" : ""}`}>
            {openProjectDeletionModal && <div id="deletion-modal"
                className="overflow-x-hidden absolute z-1 justify-center items-center w-full md:inset-0 h-screen flex justify-center items-center bg-gray-500/50"
                onClick={closeHandler}
            >
                <div className="p-4 w-full max-w-md max-h-full z-75">
                    <div className="relative bg-white rounded-lg shadow">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Confirm Project Deletion
                            </h3>
                            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                                onClick={() => setOpenProjectDeletionModal(false)}>
                                <IconX></IconX>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <form className="p-4 md:p-5">
                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className="col-span-2">
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Confirm Project Name: <b>{projectName}</b></label>
                                    <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Type project name" required={true}
                                        value={confirmProjectName} onChange={(event) => setConfirmProjectName(event.target.value)} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <button disabled={projectInDeletion} type="submit" className={`text-white inline-flex items-center gap-x-2 bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-fit ${projectInDeletion ? "opacity-50" : ""}`} onClick={deletionWrapper}>
                                    <IconTrash className="h-4 w-4"></IconTrash>
                                    Delete Project
                                </button>
                                {error && <div className="text-sm text-red-500">
                                    {error}
                                </div>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>}
        </div>
    );
}
