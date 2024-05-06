"use client"

import { deleteUser, demoteUser, getUsers, promoteUser, unverifyUser, verifyUser } from "@/actions/User";
import { AuthContext } from "@/contexts/AuthContext";
import { InternalUser, Role } from "@/utils/types";
import { useContext, useEffect, useState } from "react";

export default function UserManagement() {

    const [users, setUsers] = useState<InternalUser[]>([]);
    const { sessionExists } = useContext(AuthContext);

    const [isUpdatingUser, setIsUpdatingUser] = useState<boolean>(false);
    const [refreshKey, setRefreshKey] = useState<boolean>(false);

    const verifyHandler = async (email: string) => {
        setIsUpdatingUser(true);
        await verifyUser(email);
        setRefreshKey(!refreshKey)
        setIsUpdatingUser(false)
    }

    const unverifyHandler = async (email: string) => {
        setIsUpdatingUser(true);
        await unverifyUser(email);
        setRefreshKey(!refreshKey)
        setIsUpdatingUser(false)
    }

    const promoteHandler = async (email: string) => {
        setIsUpdatingUser(true);
        await promoteUser(email);
        setRefreshKey(!refreshKey)
        setIsUpdatingUser(false)
    }

    const demoteHandler = async (email: string) => {
        setIsUpdatingUser(true);
        await demoteUser(email);
        setRefreshKey(!refreshKey)
        setIsUpdatingUser(false)
    }

    const deleteHandler = async (email: string) => {
        setIsUpdatingUser(true);
        await deleteUser(email);
        setRefreshKey(!refreshKey)
        setIsUpdatingUser(false)
    }


    useEffect(() => {
        const userSetter = async () => {
            const retrievedUsers = await getUsers();
            setUsers([...retrievedUsers]);
        }

        if (sessionExists) {
            userSetter().then().catch();
        }
    }, [sessionExists, refreshKey])

    return (
        <main className="h-full w-full flex flex-col gap-y-2">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-full w-full overflow-x-scroll overflow-y-scroll">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 h-full">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                User Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Roles
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Verified
                            </th>
                            <th scope="col" className="px-6 py-3">
                                User Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((user: InternalUser, index: number) => {
                                return (
                                    <tr className="odd:bg-white even:bg-gray-50 border-b" key={index}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {user.email}
                                        </th>
                                        <td className="px-6 py-4">
                                            {user.roles.join(', ')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.verified ? "✅" : "❌"}
                                        </td>
                                        <td className="px-6 py-4 flex flex-row gap-x-2">
                                            {!user.verified && <button disabled={isUpdatingUser} className={`${isUpdatingUser ? "opacity-50" : ""} font-medium text-green-600 hover:underline`} onClick={async () => await verifyHandler(user.email)}>Verify</button>}
                                            {user.verified && <button disabled={isUpdatingUser} className={`${isUpdatingUser ? "opacity-50" : ""} font-medium text-orange-600 hover:underline`} onClick={async () => await unverifyHandler(user.email)}>Unverify</button>}
                                            <button className={`${isUpdatingUser ? "opacity-50" : ""} font-medium text-red-600 hover:underline`} onClick={async () => await deleteHandler(user.email)}>Delete</button>
                                            {!user.roles.includes(Role.ADMIN) && <button disabled={isUpdatingUser} className={`${isUpdatingUser ? "opacity-50" : ""} font-medium text-blue-600 hover:underline`} onClick={async () => await promoteHandler(user.email)}>Promote</button>}
                                            {user.roles.includes(Role.ADMIN) && <button disabled={isUpdatingUser} className={`${isUpdatingUser ? "opacity-50" : ""} font-medium text-blue-600 hover:underline`} onClick={async () => await demoteHandler(user.email)}>Demote</button>}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </main>
    );
}
