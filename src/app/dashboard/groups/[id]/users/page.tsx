"use client";

import React, {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {toast} from "@/hooks/use-toast";
import {API_ENDPOINTS} from "@/api/endpoints";
import {apiFetch} from "@/api/client";
import {GroupDto} from "@/types/api/group";

export default function GroupUsersPage() {
    const {id} = useParams() as {
        id: string
    };
    const [group, setGroup] = useState<GroupDto | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchGroup = async () => {
            setLoading(true);
            try {
                const data = await apiFetch<GroupDto>(API_ENDPOINTS.groups.byId(id));
                setGroup(data);
            } catch (error: unknown) {
                toast({
                    title: "Error",
                    description: (error as Error).message || "Failed to load group users.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchGroup();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="w-full h-full p-5 dark:bg-background flex items-center justify-center">
                <p className="text-gray-700 dark:text-gray-300">Loading users...</p>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="w-full h-full p-5 dark:bg-background flex items-center justify-center">
                <p className="text-gray-700 dark:text-gray-300">Group not found.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full p-5 dark:bg-background">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Users in {group.name}
            </h1>
            {group.userRoles && group.userRoles.length > 0 ? (
                <table className="min-w-full border-collapse bg-white dark:bg-neutral-800">
                    <thead>
                    <tr className="border-b dark:border-neutral-700">
                        <th className="text-left p-2 text-gray-700 dark:text-gray-200">ID</th>
                        <th className="text-left p-2 text-gray-700 dark:text-gray-200">Role</th>
                        <th className="text-left p-2 text-gray-700 dark:text-gray-200">Joined At</th>
                    </tr>
                    </thead>
                    <tbody>
                    {group.userRoles.map((role) => (
                        <tr key={role.id}
                            className="border-b dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-700 transition">
                            <td className="p-2 text-gray-700 dark:text-gray-300">{role.id}</td>
                            <td className="p-2 text-gray-700 dark:text-gray-300">{role.role}</td>
                            <td className="p-2 text-gray-700 dark:text-gray-300">{role.joinedAt}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-700 dark:text-gray-300">No users found.</p>
            )}
        </div>
    );
}