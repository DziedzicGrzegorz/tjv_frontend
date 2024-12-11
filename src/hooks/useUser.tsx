"use client";

import {useCallback, useEffect, useState} from "react";
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
            return data;
        } catch (error: unknown) {
            const message = (error as Error).message || "Failed to load user.";
            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            });
            setError(message);
            setUser(null);
            throw new Error(message);
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
const useCurrentUser = () => {
    const [currentUser, setCurrentUser] = useState<UserDto | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCurrentUser = useCallback(async () => {
        setLoading(true);
        setError(null);
        setCurrentUser(null);

        try {
            const data = await apiFetch<UserDto>(API_ENDPOINTS.users.current); // Fetch current user
            console.log("Current user data:", data);
            setCurrentUser(data);
            return data;
        } catch (err: unknown) {
            setError((err as Error).message || "An unknown error occurred");
            toast({
                title: "Error",
                description: (err as Error).message || "An unknown error occurred",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    return {
        currentUser,
        loading,
        error,
        fetchCurrentUser,
    };
};
export {useUser, useCurrentUser};