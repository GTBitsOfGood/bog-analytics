"use client"

import { AuthContext } from "@/contexts/AuthContext";
import { CustomEventType, EventEnvironment } from "bog-analytics";
import { useContext, useEffect, useState } from "react";
import { getCustomEventTypesByProject } from "@/actions/CustomEventType";
import { getCustomEventCount } from "@/actions/CustomEvent";

interface CustomEventTypeCounter extends CustomEventType {
    weekly: number;
    monthly: number;
    yearly: number;
}
export default function CustomEventCountTable({ projectId }: { projectId: string }) {

    const [customEventTypeCounter, setCustomEventTypeCounter] = useState<CustomEventTypeCounter[]>([]);
    const [selectedEnvironment, setSelectedEnvironment] = useState<EventEnvironment>(EventEnvironment.PRODUCTION);
    const { isVerified } = useContext(AuthContext);

    useEffect(() => {
        const customEventTypeSetter = async () => {
            const customEventTypesRes: CustomEventTypeCounter[] = await Promise.all((await getCustomEventTypesByProject(projectId))
                .map(async (customEventType: CustomEventType) => {
                    return {
                        weekly: await getCustomEventCount(customEventType.category, customEventType.subcategory,
                            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), selectedEnvironment, projectId
                        ),
                        monthly: await getCustomEventCount(customEventType.category, customEventType.subcategory,
                            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), selectedEnvironment, projectId
                        ),
                        yearly: await getCustomEventCount(customEventType.category, customEventType.subcategory,
                            new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), selectedEnvironment, projectId
                        ),
                        ...customEventType
                    }
                }))
            setCustomEventTypeCounter([...customEventTypesRes]);

        }
        customEventTypeSetter().then().catch()
    }, [selectedEnvironment])

    return (
        <main className="text-black text-sm flex gap-y-2 flex-col">
            <p className="text-sm"><span className="font-semibold">Custom Events Count Table:</span> See how many times each custom event has been logged. <b>Note:</b> the counts will reflect the number of custom events to the extent of your deletion policy.</p>
            <div className="flex flex-row gap-x-2 text-white">
                {Object.values(EventEnvironment).map((environemnt: EventEnvironment, index: number) => {
                    return (
                        <button key={index} className={`px-2 py-1 bg-black rounded-lg ${selectedEnvironment === environemnt ? 'opacity-100' : 'opacity-50'}`}
                            onClick={() => {
                                setSelectedEnvironment(environemnt)
                            }}
                            disabled={selectedEnvironment === environemnt}
                        >{environemnt}</button>

                    )
                })}
            </div>

            <div className="h-full w-full flex flex-col gap-y-2">
                {
                    isVerified !== null && !isVerified && <div className="text-xs text-red-500 uppercase py-2 rounded-lg font-bold">You must be verified to view custom event counts</div>
                }
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-full w-full overflow-x-scroll">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 h-full">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Event Category
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Event Subcategory
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    7 Day Count
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    30 Day Count
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    365 Day Count
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                isVerified && customEventTypeCounter.map((customEventTypeCount: CustomEventTypeCounter, index: number) => {
                                    return (
                                        <tr className="odd:bg-white even:bg-gray-50 border-b" key={index}>
                                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                {customEventTypeCount.category}
                                            </td>
                                            <td className="px-6 py-4">
                                                {customEventTypeCount.subcategory}
                                            </td>
                                            <td className="px-6 py-4">
                                                {customEventTypeCount.weekly}
                                            </td>
                                            <td className="px-6 py-4">
                                                {customEventTypeCount.monthly}

                                            </td>
                                            <td className="px-6 py-4">
                                                {customEventTypeCount.yearly}

                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
