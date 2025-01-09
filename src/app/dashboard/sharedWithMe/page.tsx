"use client"
import React, {useEffect, useState} from "react";
import {API_ENDPOINTS} from "@/api/endpoints";
import {SharedFileWithUserDto} from "@/types/api/file";
import {apiFetch} from "@/api/client";
import {FileList} from "@/components/ui/FileList";
import useFiles from "@/hooks/useFiles";

const FilesPage: React.FC = () => {
    const [sharedFiles, setSharedFiles] = useState<SharedFileWithUserDto[]>([]);
    const [loading, setLoading] = useState(false);
    const {handleDownload} = useFiles();

    useEffect(() => {
        const fetchUserFiles = async () => {
            setLoading(true);
            try {
                const data = await apiFetch<SharedFileWithUserDto[]>(API_ENDPOINTS.sharedFiles.user);
                console.log(data);
                setSharedFiles(data);
            } catch (error: unknown) {
                // toast({
                //     title: "Error",
                //     description: (error as Error).message || "Failed to load files.",
                //     variant: "destructive",
                // });
            } finally {
                setLoading(false);
            }
        };

        fetchUserFiles();
    }, []);

    const files = sharedFiles.map(shared => shared.file);

    return (
        <div className="w-full h-full p-5 dark:bg-background">
            <FileList files={files} loading={loading} onDownload={handleDownload} disableContextMenu={true}/>
        </div>
    );
};

export default FilesPage;