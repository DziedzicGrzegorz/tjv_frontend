"use client"
import {useCallback, useEffect, useState} from "react";
import {toast} from "@/hooks/use-toast";
import {API_ENDPOINTS} from "@/api/endpoints";
import {FileDto} from "@/types/api/file";
import {apiFetch} from "@/api/client";
import {apiDownloadFetch} from "@/api/blobFetch";

const useFiles = () => {
    const [files, setFiles] = useState<FileDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUserFiles = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiFetch<FileDto[]>(API_ENDPOINTS.files.userFiles());
            setFiles(data);
        } catch (error: unknown) {
            const message = (error as Error).message || "Failed to load files.";
            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            });
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserFiles();
    }, [fetchUserFiles]);

    const handleDownload = useCallback(async (file: FileDto) => {
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
    }, []);

    const handleDelete = useCallback(async (fileId: string) => {
        setLoading(true);
        try {
            await apiFetch(API_ENDPOINTS.files.delete(fileId), {method: 'DELETE'});
            setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
            toast({
                title: "Success",
                description: "File deleted successfully.",
                variant: "default",
            });
        } catch (error: unknown) {
            const message = (error as Error).message || "Failed to delete the file.";
            toast({
                title: "Delete Error",
                description: message,
                variant: "destructive",
            });
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleUpdate = useCallback(async (updatedFile: FileDto) => {
        setLoading(true);
        try {
            const response = await apiFetch<FileDto>(API_ENDPOINTS.files.update(updatedFile.id), {
                method: 'PUT',
                body: JSON.stringify(updatedFile),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setFiles(prevFiles => prevFiles.map(file => file.id === response.id ? response : file));
            toast({
                title: "Success",
                description: "File updated successfully.",
                variant: "default",
            });
        } catch (error: unknown) {
            const message = (error as Error).message || "Failed to update the file.";
            toast({
                title: "Update Error",
                description: message,
                variant: "destructive",
            });
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        files,
        loading,
        error,
        fetchUserFiles,
        handleDownload,
        handleDelete,
        handleUpdate,
    };
};

export default useFiles;