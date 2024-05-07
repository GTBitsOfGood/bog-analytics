"use client"
import { useContext, useEffect, useState } from "react";
import { CustomEventType } from "@/utils/types";
import { getCustomEventTypesByProject } from "@/actions/CustomEventType";
import { DashboardContext } from "@/contexts/DashboardContext";


function CustomEventTypesTable({ projectId }: { projectId: string }) {
    const [customEventTypes, setCustomEventTypes] = useState<CustomEventType[]>([])
    const { customEventTypeRefreshKey } = useContext(DashboardContext);
    const [loaded, setLoaded] = useState<boolean>(false);
    useEffect(() => {
        const customEventTypeGetter = async () => {
            const retrievedEventTypes = await getCustomEventTypesByProject(projectId);
            setCustomEventTypes([...retrievedEventTypes]);
            setLoaded(true);
        }

        customEventTypeGetter().then().catch();
    }, [customEventTypeRefreshKey])

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
                                            <span className="underline font-bold">Properties:</span> {eventType.properties.map((property: string, propIndex: number) => {
                                                return (<div className="rounded-lg p-1 text-white odd:bg-[#FF7574] even:bg-[#FFC55A] ">{property}</div>)
                                            })}
                                        </div>
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