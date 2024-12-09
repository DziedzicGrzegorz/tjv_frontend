// src/hooks/useUser.tsx
"use client";

import {useCallback, useState} from "react";
import {toast} from "@/hooks/use-toast";
import {API_ENDPOINTS} from "@/api/endpoints";
import {apiFetch} from "@/api/client";
import {UserDto} from "@/types/api/user";

const useUser = () => {
    const [user, setUser] = useState<UserDto | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUserByEmail = useCallback(async (email: string) => {
        setLoading(true);
        try {
            const data = await apiFetch<UserDto>(API_ENDPOINTS.users.byEmail(email));
            setUser(data);
            setError(null);
            return data; // Zwróć dane użytkownika po udanym pobraniu
        } catch (error: unknown) {
            const message = (error as Error).message || "Failed to load user.";
            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            });
            setError(message);
            setUser(null);
            throw new Error(message); // Rzucenie błędu, aby można było go obsłużyć w komponencie
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        user,
        loading,
        error,
        fetchUserByEmail,
    };
};

export default useUser;