"use client"
import { useContext, useEffect, useState } from "react";
import { CustomEventType } from "bog-analytics";
import { deleteCustomEventType, getCustomEventTypesByProject } from "@/actions/CustomEventType";
import { DashboardContext } from "@/contexts/DashboardContext";


function CustomEventTypesTable({ projectId }: { projectId: string }) {
    const [customEventTypes, setCustomEventTypes] = useState<CustomEventType[]>([])
    const { customEventTypeRefreshKey, setCustomEventTypeRefreshKey } = useContext(DashboardContext);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [deletingEventType, setDeletingEventType] = useState(false);

    const deleteEventTypeHandler = async (category: string, subcategory: string) => {
        setDeletingEventType(true);

        await deleteCustomEventType(projectId, category, subcategory);

        setCustomEventTypeRefreshKey(!customEventTypeRefreshKey)
        setDeletingEventType(false);
    }
    useEffect(() => {
        const customEventTypeGetter = async () => {
            const retrievedEventTypes = await getCustomEventTypesByProject(projectId);
            setCustomEventTypes([...retrievedEventTypes]);
            setLoaded(true);
        }

        customEventTypeGetter().then().catch();
    }, [customEventTypeRefreshKey, projectId])

    return (<main className="text-black overflow-y-scroll">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full overflow-x-scroll overflow-y-scroll">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 h-full">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Custom Event Types
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {customEventTypes.map((eventType: CustomEventType, index: number) => {
                        return (
                            <tr className="odd:bg-white even:bg-gray-50 border-b" key={index}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    <div className="rounded-lg flex flex-col gap-y-2">
                                        <p className="font-light"><span className="underline font-bold">Category:</span> {eventType.category}</p>
                                        <p className="font-light"><span className="underline font-bold">Subcategory:</span> {eventType.subcategory}</p>
                                        <div className="flex flex-row gap-x-2 items-center flex-wrap gap-y-2">
                                            <span className="underline font-bold">Properties:</span> {eventType.properties.map((property: string, index: number) => {
                                                return (<div className="rounded-lg p-1 text-white odd:bg-[#FF7574] even:bg-[#FFC55A] " key={index}>{property}</div>)
                                            })}
                                        </div>
                                        <button className={`w-fit rounded-lg bg-red-500 p-1 text-white hover:opacity-75 ${deletingEventType ? "opacity-50" : ""}`}
                                            disabled={deletingEventType}
                                            onClick={async () => { await deleteEventTypeHandler(eventType.category, eventType.subcategory) }}>Delete Event Type</button>
                                    </div>
                                </th>
                            </tr>
                        )
                    })}
                    {customEventTypes.length === 0 && loaded && <tr><th className="odd:bg-white even:bg-gray-50 text-xs text-red-500 uppercase bg-gray-50 px-6 py-4">No custom events have been registered</th></tr>}
                </tbody>
            </table>
        </div>

    </main>
    )
}

export default CustomEventTypesTable;