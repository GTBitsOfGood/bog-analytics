"use client"

import { createCustomEventType } from "@/actions/CustomEventType";
import { DashboardContext } from "@/contexts/DashboardContext";
import { IconTablePlus, IconTrash } from "@tabler/icons-react";
import { useContext, useState } from "react";


function CreateCustomEventTypeWidget({ projectId }: { projectId: string }) {
    const [inCreation, setInCreation] = useState<boolean>(false);
    const [creationInProgress, setCreationInProgress] = useState<boolean>(false);
    const [categoryName, setCategoryName] = useState<string>("");
    const [subcategoryName, setSubcategoryName] = useState<string>("");
    const [customProperties, setCustomProperties] = useState<string[]>([]);
    const [currentProperty, setCurrentProperty] = useState<string>("");
    const [error, setError] = useState<string>("");

    const { setCustomEventTypeRefreshKey, customEventTypeRefreshKey } = useContext(DashboardContext);


    const createCustomEventTypeHandler = async () => {
        setError("")
        if (!categoryName || !subcategoryName) {
            setError("You must specify a category and subcategory");
            setCreationInProgress(false);
            return;
        }
        setCreationInProgress(true);
        await createCustomEventType(projectId, categoryName, subcategoryName, customProperties)

        setCategoryName("");
        setSubcategoryName("");
        setCurrentProperty("");
        setCustomProperties([]);
        setCustomEventTypeRefreshKey(!customEventTypeRefreshKey);
        setCreationInProgress(false);
        setInCreation(false);
    }

    return (<main className="text-black">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-full w-full overflow-x-scroll overflow-y-scroll bg-white ">

            {!inCreation && <div className="flex flex-row justify-center gap-x-2 items-center text-gray-600 cursor-pointer p-4" onClick={() => setInCreation(true)}>
                <p>Create Custom Event Type</p>
                <IconTablePlus></IconTablePlus>
            </div>}

            {inCreation && <div className="flex flex-col gap-y-4">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 h-full">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Create custom event type
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="odd:bg-white even:bg-gray-50 border-b">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex flex-col gap-y-2">
                                <div className="flex flex-col gap-y-4">
                                    <div className="flex flex-row gap-x-4">
                                        <div className="flex flex-col gap-y-2">
                                            <label className="font-light">Category Name:</label>
                                            <input className="py-2 px-4 rounded-md outline outline-gray-400 outline-2 bg-[#fffcf4] w-fit" placeholder="your category name"
                                                value={categoryName}
                                                onChange={({ target }) => setCategoryName(target.value)}></input>

                                        </div>
                                        <div className="flex flex-col gap-y-2">
                                            <label className="font-light">Subcategory Name:</label>
                                            <input className="py-2 px-4 rounded-md outline outline-gray-400 outline-2 bg-[#fffcf4] w-fit" placeholder="your subcategory name"
                                                value={subcategoryName}
                                                onChange={({ target }) => setSubcategoryName(target.value)}></input>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-y-2">
                                        <p className="font-light">Event Property:</p>
                                        <div className="flex flex-row gap-x-2 items-center flex-wrap gap-y-2">
                                            <input className="py-2 px-4 rounded-md outline outline-gray-400 outline-2 bg-[#fffcf4] w-fit" placeholder="your property name" value={currentProperty}

                                                onChange={({ target }) => setCurrentProperty(target.value)}></input>
                                            <button className="p-2 hover:from-[#FFC55A] hover:to-[#FF7574] hover:bg-gradient-to-r bg-[#FF7574] hover:duration-500 w-fit rounded-lg text-white"
                                                onClick={() => {
                                                    if (!currentProperty || customProperties.includes(currentProperty)) {
                                                        return;
                                                    }
                                                    setCustomProperties([...customProperties, currentProperty])
                                                    setCurrentProperty("");
                                                }}>Add Property</button>
                                            {customProperties.map((property: string, index: number) => {
                                                return (
                                                    <div className="rounded-lg p-2 text-white odd:bg-[#FFC55A] even:bg-[#FF7574] text-center flex flex-row gap-x-2 items-center" key={index}>
                                                        <p>{property}</p>
                                                        <IconTrash className="h-4 w-4 cursor-pointer" onClick={() => {
                                                            const filteredList = customProperties.filter((prop: string) => prop !== property);
                                                            setCustomProperties([...filteredList])
                                                        }} />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <button className={`p-2 from-[#FFC55A] to-[#FF7574] bg-gradient-to-r bg-[#FFC55A] hover:duration-500 w-fit rounded-lg text-white hover:opacity-75 ${creationInProgress ? "opacity-50" : ""}`}
                                        disabled={creationInProgress}
                                        onClick={async () => await createCustomEventTypeHandler()}>Create Custom Event</button>
                                </div>
                                {error && <div className="text-sm text-red-500">
                                    {error}
                                </div>}

                            </th>
                        </tr>
                    </tbody>
                </table>



            </div>}
        </div>
    </main>
    )
}

export default CreateCustomEventTypeWidget;