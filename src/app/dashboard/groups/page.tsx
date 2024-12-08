"use client";

import React, {useEffect, useState} from "react";
import {toast} from "@/hooks/use-toast";
import {API_ENDPOINTS} from "@/api/endpoints";
import {apiFetch} from "@/api/client";
import {GroupDto} from "@/types/api/group";
import {HoverEffect} from "@/components/ui/card-hover-effect";

export default function GroupsPage() {
    const [groups, setGroups] = useState<GroupDto[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchGroups = async () => {
            setLoading(true);
            try {
                const data = await apiFetch<GroupDto[]>(API_ENDPOINTS.groups.byCurrentUser());
                setGroups(data);
            } catch (error: unknown) {
                toast({
                    title: "Error",
                    description: (error as Error).message || "Failed to load groups.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const handleAddGroup = () => {
        alert("Add Group clicked!");
    };

    const items = groups.map((group) => ({
        title: group.name,
        description: group.description || "No description",
        link: `groups/${group.id}`,
    }));

    return (
        <div className="relative w-full min-h-full p-5 bg-background">
            <div className="flex items-center justify-end mb-5">
                <button
                    onClick={handleAddGroup}
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                    Add Group
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-gray-700 dark:text-gray-300">Loading groups...</p>
                </div>
            ) : (
                <HoverEffect items={items}/>
            )}
        </div>
    );
}