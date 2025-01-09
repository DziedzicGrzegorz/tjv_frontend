// src/hooks/useGroupDetails.tsx
"use client";

import {useCallback, useState} from "react";
import {toast} from "@/hooks/use-toast";
import {API_ENDPOINTS} from "@/api/endpoints";
import {apiFetch} from "@/api/client";
import {GroupDto} from "@/types/api/group";

/**
 * Hook to fetch and manage the details of a specific group by ID.
 */
const useGroupDetails = () => {
    const [group, setGroup] = useState<GroupDto | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetches the group details by ID.
     * @param id - The ID of the group to fetch.
     */
    const fetchGroupDetails = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiFetch<GroupDto>(`${API_ENDPOINTS.groups.byId(id)}`);
            setGroup(data);
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
        loading,
        error,
        fetchGroupDetails,
    };
};

export default useGroupDetails;