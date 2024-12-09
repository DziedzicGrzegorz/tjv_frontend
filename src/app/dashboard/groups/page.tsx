// src/pages/groups/page.tsx

"use client";

import React from "react";
import {HoverEffect} from "@/components/ui/card-hover-effect";
import {Button} from "@/components/ui/button";
import {useGroups} from "@/hooks/useGroups";

export default function GroupsPage() {
    const {ownedGroups, joinedGroups, loading, error, fetchGroups, handleAddGroup} = useGroups();

    // Przygotowanie danych do komponentu HoverEffect
    const prepareItems = (groups: typeof ownedGroups) => groups.map(group => ({
        title: group.name,
        description: group.description || "No description",
        link: `groups/${group.id}`,
    }));

    const ownedItems = prepareItems(ownedGroups);
    const joinedItems = prepareItems(joinedGroups);

    return (
        <div className="relative w-full min-h-full p-5 bg-background">
            <div className="flex items-center justify-end mb-5">
                <Button
                    onClick={handleAddGroup}
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                    Add Group
                </Button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-gray-700 dark:text-gray-300">Loading groups...</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-red-600">{error}</p>
                    <Button onClick={fetchGroups} className="mt-4">
                        Retry
                    </Button>
                </div>
            ) : (
                <div>
                    {/* Sekcja Owned Groups */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Owned Groups</h2>
                        {ownedItems.length > 0 ? (
                            <HoverEffect items={ownedItems}/>
                        ) : (
                            <p className="text-gray-700 dark:text-gray-300">You do not own any groups.</p>
                        )}
                    </section>

                    {/* Sekcja Joined Groups */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Joined Groups</h2>
                        {joinedItems.length > 0 ? (
                            <HoverEffect items={joinedItems}/>
                        ) : (
                            <p className="text-gray-700 dark:text-gray-300">You have not joined any groups.</p>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}