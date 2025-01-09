import {useCallback, useState} from "react";
import {toast} from "@/hooks/use-toast";
import {apiFetch} from "@/api/client";
import {GroupDto} from "@/types/api/group";
import {API_ENDPOINTS} from "@/api/endpoints";
import {FileDto} from "@/types/api/file";

const useGroupWithFiles = () => {
    const [group, setGroup] = useState<GroupDto | null>(null);
    const [files, setFiles] = useState<FileDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGroupWithFiles = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiFetch<GroupDto>(API_ENDPOINTS.groups.byId(id));
            setGroup(data);
            const fetchedFiles = data.sharedFiles?.map(sf => sf.file) || [];
            setFiles(fetchedFiles);
        } catch (error: unknown) {
            const errorMessage = (error as Error).message || "Failed to load group details.";
            setError(errorMessage);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        group,
        files,
        loading,
        error,
        fetchGroupWithFiles,
    };
};

export default useGroupWithFiles;

