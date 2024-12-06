"use client"
import {toast} from "@/hooks/use-toast";
import {API_ENDPOINTS} from "@/api/endpoints";
import {FileDto} from "@/types/api/file";
import {apiFetch} from "@/api/client";
import React, {useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";
import {cn} from "@/lib/utils";
import {IconDownload, IconFile} from "@tabler/icons-react";
import {apiDownloadFetch} from "@/api/blobFetch";

async function downloadFile(fileId: string): Promise<Blob> {
    return apiDownloadFetch(API_ENDPOINTS.files.download(fileId), {method: 'GET'});
}

const FilesPage: React.FC = () => {
    const [files, setFiles] = useState<FileDto[]>([]);
    const [loading, setLoading] = useState(false);
    const filesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchUserFiles = async () => {
            setLoading(true);
            try {
                const data = await apiFetch<FileDto[]>(API_ENDPOINTS.files.userFiles());
                setFiles(data);
            } catch (error: unknown) {
                toast({
                    title: "Error",
                    description: (error as Error).message || "Failed to load files.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserFiles();
    }, []);

    useEffect(() => {
        if (filesContainerRef.current) {
            filesContainerRef.current.scrollTop = 0;
        }
    }, [files]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-background">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Loading Files</h1>
                <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded shadow-md w-full max-w-md">
                    <p className="text-gray-700 dark:text-gray-300">Please wait...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full p-10 dark:bg-background">
            <div className="relative w-full max-w-xl mx-auto h-full">
                <div className="h-full overflow-y-auto" ref={filesContainerRef}>
                    {files.length > 0 ? (
                        files.map((file) => (
                            <motion.div
                                key={file.id}
                                layoutId={`file-${file.id}`}
                                className={cn(
                                    "relative overflow-hidden z-40 bg-white dark:bg-deepBlue flex flex-row items-stretch justify-between p-4 mt-4 w-full mx-auto rounded-md",
                                    "shadow-sm"
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

                                {/* FileDownload po prawej stronie, dopasowany do wysokości */}
                                <FileDownload file={file}/>
                            </motion.div>
                        ))
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
        </div>
    );
};

export default FilesPage;

interface FileDownloadProps {
    file: FileDto;
}

const FileDownload: React.FC<FileDownloadProps> = ({file}) => {
    const [hovered, setHovered] = useState(false);

    const handleDownload = async () => {
        try {
            const blob = await downloadFile(file.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error: unknown) {
            console.error(error);
            toast({
                title: "Download Error",
                description: (error as Error).message || "Failed to download the file.",
                variant: "destructive",
            });
        }
    };

    return (
        <div
            className={cn(
                "relative group/file z-40 w-32 rounded-md flex-shrink-0 pl-4"
            )}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {hovered && (
                <motion.div
                    variants={secondaryVariant}
                    initial="initial"
                    animate="animate"
                    className="pointer-events-none absolute inset-0 z-30 border border-dashed border-pink-600 dark:border-sky-400 bg-transparent rounded-md ml-2"
                />
            )}

            <motion.div
                layoutId={`file-download-${file.id}`}
                variants={mainVariant}
                whileHover="animate"
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                }}
                className={cn(
                    "relative bg-white dark:bg-cardBackground flex items-center justify-center w-full h-full rounded-md",
                    "shadow-[0px_10px_50px_rgba(0,0,0,0.1)] cursor-pointer"
                )}
                onClick={handleDownload}
            >
                <IconDownload className="h-5 w-5 text-neutral-600 dark:text-neutral-300 mb-2"/>
                <span className="text-neutral-600 dark:text-neutral-300 bg-de">Download</span>
            </motion.div>
        </div>
    )
};

const mainVariant = {
    initial: {
        x: 0,
        y: 0,
    },
    animate: {
        x: 7,
        y: 7,
        opacity: 0.9,
    },
};

const secondaryVariant = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
    },
};