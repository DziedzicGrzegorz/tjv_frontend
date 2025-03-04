"use client"
import React, {useEffect, useRef} from "react";
import {FileDto} from "@/types/api/file";
import {motion} from "framer-motion";
import {cn} from "@/lib/utils";
import {IconFile} from "@tabler/icons-react";
import {DownloadButton} from "./DownloadButton";
import {ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger} from "@/components/ui/context-menu";

interface FileListProps {
    files: FileDto[];
    loading?: boolean;
    onDownload: (file: FileDto) => void;
    onEdit?: (file: FileDto) => void;
    onDelete?: (file: FileDto) => void;
    onShare?: (file: FileDto) => void;
    onStopShare?: (file: FileDto) => void;
    disableContextMenu?: boolean;
    className?: string;
    sharedFileIds?: Set<string>; // Files shared with users
    sharedFileWithGroupIds?: Set<string>; // Files shared with groups
}

export const FileList: React.FC<FileListProps> = ({
                                                      files,
                                                      loading = false,
                                                      onDownload,
                                                      onEdit,
                                                      onDelete,
                                                      onShare,
                                                      onStopShare,
                                                      disableContextMenu = false,
                                                      className,
                                                      sharedFileIds = new Set(), // Domyślna wartość
                                                      sharedFileWithGroupIds = new Set(), // Domyślna wartość
                                                  }) => {
    const filesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (filesContainerRef.current) {
            filesContainerRef.current.scrollTop = 0;
        }
    }, [files]);

    if (loading) {
        return (
            <div
                className={cn("flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-background", className)}>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Loading Files</h1>
                <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded shadow-md w-full max-w-md">
                    <p className="text-gray-700 dark:text-gray-300">Please wait...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("relative w-full md:w-3/4 mx-auto h-full", className)}>
            <div
                className="h-full overflow-y-auto"
                ref={filesContainerRef}
            >
                {files.length > 0 ? (
                    files.map((file) => {
                        const isShared = sharedFileIds.has(file.id) || sharedFileWithGroupIds.has(file.id);
                        const fileContent = (
                            <motion.div
                                key={file.id}
                                layoutId={`file-${file.id}`}
                                className={cn(
                                    "relative overflow-hidden z-40 bg-white dark:bg-deepBlue flex flex-col sm:flex-row items-stretch justify-between py-4 px-2 mt-4 w-full mx-auto rounded-md shadow-sm"
                                )}
                            >
                                <div className="flex-1 flex flex-col">
                                    <div className="flex justify-between w-full items-center gap-4">
                                        <motion.div
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            layout
                                            className="flex items-center gap-2 text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs"
                                        >
                                            <IconFile className="h-5 w-5 text-neutral-600 dark:text-neutral-300"/>
                                            <span>{file.filename}</span>
                                        </motion.div>
                                        <motion.p
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            layout
                                            className="rounded-lg px-2 py-1 w-fit flex-shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"
                                        >
                                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                                        </motion.p>
                                    </div>

                                    <div
                                        className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                                        <motion.p
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            layout
                                            className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800"
                                        >
                                            {file.fileType || "Unknown Type"}
                                        </motion.p>
                                        <motion.p initial={{opacity: 0}} animate={{opacity: 1}} layout>
                                            Owner: {file.owner.username}
                                        </motion.p>
                                    </div>

                                    <div
                                        className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                                        <motion.p initial={{opacity: 0}} animate={{opacity: 1}} layout>
                                            Version: {file.version}
                                        </motion.p>
                                        <motion.p initial={{opacity: 0}} animate={{opacity: 1}} layout>
                                            Created: {new Date(file.createdAt).toLocaleDateString()}
                                        </motion.p>
                                        <motion.p initial={{opacity: 0}} animate={{opacity: 1}} layout>
                                            Updated: {new Date(file.updatedAt).toLocaleDateString()}
                                        </motion.p>
                                    </div>
                                </div>
                                <div className="order-last sm:order-none mt-2 sm:mt-0 ml-0 sm:ml-2 w-full sm:w-32">
                                    <DownloadButton file={file} onDownload={onDownload}/>
                                </div>

                            </motion.div>
                        )

                        if (disableContextMenu) {
                            return fileContent
                        }

                        return (
                            <ContextMenu key={file.id}>
                                <ContextMenuTrigger asChild>
                                    {fileContent}
                                </ContextMenuTrigger>
                                <ContextMenuContent className="w-48">
                                    {onEdit && (
                                        <ContextMenuItem
                                            className="text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-700 dark:text-yellow-500"
                                            onSelect={() => onEdit(file)}
                                        >
                                            Edit
                                        </ContextMenuItem>
                                    )}
                                    {onDelete && (
                                        <ContextMenuItem
                                            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-700 dark:text-red-500"
                                            onSelect={() => onDelete(file)}
                                        >
                                            Delete
                                        </ContextMenuItem>
                                    )}
                                    {onShare && (
                                        <ContextMenuItem
                                            className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-700 dark:text-blue-500"
                                            onSelect={() => onShare(file)}
                                        >
                                            Share
                                        </ContextMenuItem>
                                    )}
                                    {onStopShare && isShared && (
                                        <ContextMenuItem
                                            className="text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-700 dark:text-indigo-500"
                                            onSelect={() => onStopShare(file)}
                                        >
                                            Stop Sharing
                                        </ContextMenuItem>
                                    )}
                                </ContextMenuContent>
                            </ContextMenu>
                        );
                    })
                ) : (
                    <motion.div
                        layoutId="file-list-empty"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        className="flex flex-col items-center justify-center h-32 mt-4 w-full mx-auto rounded-md bg-white dark:bg-neutral-900 shadow-sm"
                    >
                        <p className="text-neutral-600 dark:text-neutral-300">No files available</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};