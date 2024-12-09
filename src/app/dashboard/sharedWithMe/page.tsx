"use client"
import React, {useEffect, useState} from "react";
import {toast} from "@/hooks/use-toast";
import {API_ENDPOINTS} from "@/api/endpoints";
import {FileDto, SharedFileWithUserDto} from "@/types/api/file";
import {apiFetch} from "@/api/client";
import {FileList} from "@/components/ui/FileList";
import {apiDownloadFetch} from "@/api/blobFetch";

const FilesPage: React.FC = () => {
    const [sharedFiles, setSharedFiles] = useState<SharedFileWithUserDto[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserFiles = async () => {
            setLoading(true);
            try {
                const data = await apiFetch<SharedFileWithUserDto[]>(API_ENDPOINTS.sharedFiles.user);
                console.log(data);
                setSharedFiles(data);
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

    const handleDownload = async (file: FileDto) => {
        try {
            const blob = await apiDownloadFetch(API_ENDPOINTS.files.download(file.id), {method: 'GET'});
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

    // Wyciągamy z sharedFiles tablicę FileDto:
    const files = sharedFiles.map(shared => shared.file);

    return (
        <div className="w-full h-full p-5 dark:bg-background">
            {/* Teraz przekazujemy FileDto[] do FileList */}
            <FileList files={files} loading={loading} onDownload={handleDownload} disableContextMenu={true}/>
        </div>
    );
};

export default FilesPage;