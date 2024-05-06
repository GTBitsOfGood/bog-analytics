"use client"

import { createProject } from "@/actions/Project";
import { AuthContext } from "@/contexts/AuthContext";
import { copyToClipboard } from "@/utils/string";
import { IconCopy } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";

export default function CreateProject() {

    const [projectName, setProjectName] = useState<string>("");
    const [error, setError] = useState<string>("");

    const [generatedClientKey, setGeneratedClientKey] = useState<string>("");
    const [generatedServerKey, setGeneratedServerKey] = useState<string>("");

    const [creatingProject, setCreatingProject] = useState<boolean>(false);

    const { sessionExists } = useContext(AuthContext);

    useEffect(() => {
    }, [])

    const createProjectHandler = async () => {
        setError("")
        setCreatingProject(true);
        if (!projectName) {
            setCreatingProject(false);
            setError("Project name cannot be empty");
            return;
        }

        try {
            const project = await createProject(projectName);
            setGeneratedClientKey(project.clientApiKey)
            setGeneratedServerKey(project.serverApiKey)
        } catch {
            setCreatingProject(false);
            setError("An error occurred when creating the project")
            return;
        }
        setCreatingProject(false);
        setProjectName("");
    }

    return (
        <main className="h-full w-full flex flex-col gap-y-2 text-black">
            <label className="font-light">Enter Project Name:</label>
            <input className="py-2 px-4 rounded-md outline outline-gray-400 outline-2 bg-[#fffcf4] w-fit" placeholder="your project name"
                onChange={({ target }) => setProjectName(target.value)} value={projectName}></input>
            <button className={`${creatingProject ? "opacity-50" : ""} p-2 hover:from-[#FFC55A] hover:to-[#FF7574] hover:bg-gradient-to-r bg-[#FF7574] hover:duration-500 w-fit rounded-lg text-white`}
                onClick={() => createProjectHandler()} disabled={creatingProject}
            >Create Project</button>
            {error && <div className="text-sm text-red-500">
                {error}
            </div>}

            {generatedClientKey && <div className="flex flex-row gap-x-2 items-center">
                <h1><span className="font-bold">Your Client API Key: </span>{generatedClientKey}</h1>
                <IconCopy className="h-5 w-5 cursor-pointer hover:bg-blue-100 rounded-lg p-1" onClick={() => copyToClipboard(generatedServerKey)} />
            </div>}
            {generatedServerKey && <div className="flex flex-row gap-x-2 items-center">
                <h1><span className="font-bold">Your Server API Key: </span>{generatedServerKey}</h1>
                <IconCopy className="h-5 w-5 cursor-pointer hover:bg-blue-100 rounded-lg p-1" onClick={() => copyToClipboard(generatedClientKey)} />
            </div>}

        </main>
    );
}
