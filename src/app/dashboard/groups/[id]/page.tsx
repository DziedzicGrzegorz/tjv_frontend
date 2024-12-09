// src/pages/groups/[id]/page.tsx

"use client";

import React, {useEffect} from "react";
import {useParams} from "next/navigation";
import {useGroupWithFiles} from "@/hooks/useGroups";
import {FileList} from "@/components/ui/FileList";

import Link from "next/link";

import useFiles from "@/hooks/useFiles";

const GroupDetailsPage: React.FC = () => {
    const {id} = useParams() as {
        id: string
    };
    const {group, files, loading, error, fetchGroupWithFiles} = useGroupWithFiles();
    const {
        handleDownload,
    } = useFiles();

    useEffect(() => {
        if (id) {
            fetchGroupWithFiles(id);
        }
    }, [id, fetchGroupWithFiles]);

    // const handleDownload = async (file: FileDto) => {
    //     try {
    //         const blob = await apiDownloadFetch(API_ENDPOINTS.files.download(file.id), {method: 'GET'});
    //         const url = window.URL.createObjectURL(blob);
    //         const a = document.createElement('a');
    //         a.href = url;
    //         a.download = file.filename;
    //         document.body.appendChild(a);
    //         a.click();
    //         a.remove();
    //         window.URL.revokeObjectURL(url);
    //     } catch (error: unknown) {
    //         console.error(error);
    //         toast({
    //             title: "Download Error",
    //             description: (error as Error).message || "Failed to download the file.",
    //             variant: "destructive",
    //         });
    //     }
    // };

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
                {/* Link do strony z użytkownikami grupy */}
                <Link
                    href={`${id}/users`}
                    className="text-blue-600 hover:underline mx-auto"
                >
                    View Users
                </Link>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-4">Files in this group</h2>
            <FileList files={files} loading={false} onDownload={handleDownload} disableContextMenu={true}/>
        </div>
    );
};

export default GroupDetailsPage;