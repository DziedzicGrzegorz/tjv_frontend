// src/pages/groups/[id]/page.tsx

"use client";

import React, {useEffect} from "react";
import {useParams} from "next/navigation";
import {FileList} from "@/components/ui/FileList";

import Link from "next/link";

import useFiles from "@/hooks/useFiles";
import useGroupWithFiles from "@/hooks/UseGroupWithFiles";
import {useCurrentUser} from "@/hooks/useUser";

const GroupDetailsPage: React.FC = () => {
    const {currentUser} = useCurrentUser();
    const {group, files, loading, error, fetchGroupWithFiles} = useGroupWithFiles();


    const isAdminOrFounder = group?.userRoles?.some(role => role.user.id === currentUser?.id && (role.role === 'ADMIN' || role.role === 'FOUNDER')) || false;

    const {id} = useParams() as {
        id: string
    };
    const {
        handleDownload,
    } = useFiles();

    useEffect(() => {
        if (id) {
            fetchGroupWithFiles(id);
        }
    }, [id, fetchGroupWithFiles]);


    if (loading) {
        return (
            <div className="w-full h-full p-5 dark:bg-background flex items-center justify-center">
                <p className="text-gray-700 dark:text-gray-300">Loading group details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full p-5 dark:bg-background flex items-center justify-center">
                <p className="text-red-600">{error}</p>
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
        <div className="w-full min-h-full p-5 dark:bg-background">
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{group.name}</h1>
                    {group.description && (
                        <p className="text-gray-700 dark:text-gray-300 mt-2">
                            {group.description}
                        </p>
                    )}
                </div>
                {isAdminOrFounder && (
                    <Link
                        href={`${id}/users`}
                        className="text-blue-600 hover:underline mx-auto"
                    >
                        View Users
                    </Link>
                )}
            </div>

            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-4">Files in this group</h2>
            <FileList files={files} loading={false} onDownload={handleDownload} disableContextMenu={true}/>
        </div>
    );
};

export default GroupDetailsPage;