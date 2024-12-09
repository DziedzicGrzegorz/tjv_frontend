// src/hooks/useGroups.ts

"use client";

import {useCallback, useEffect, useState} from "react";
import {toast} from "@/hooks/use-toast";
import {API_ENDPOINTS} from "@/api/endpoints";
import {apiFetch} from "@/api/client";
import {GroupDto} from "@/types/api/group";
import {FileDto, SharedFileWithUserDto} from "@/types/api/file";
import {UserDto} from "@/types/api/user";

/**
 * Hook to manage fetching all groups for the current user.
 */
const useGroups = () => {
    const [ownedGroups, setOwnedGroups] = useState<GroupDto[]>([]);
    const [joinedGroups, setJoinedGroups] = useState<GroupDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGroups = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {

            const {id} = await apiFetch<UserDto>(API_ENDPOINTS.users.current);

            const data = await apiFetch<GroupDto[]>(API_ENDPOINTS.groups.byCurrentUser());

            // Kategoryzacja grup
            const owned: GroupDto[] = [];
            const joined: GroupDto[] = [];

            data.forEach(group => {
                const adminOrFounder
                    = group.userRoles?.find(role => role.user.id === id && (role.role === 'ADMIN' || role.role === 'FOUNDER'));
                if (adminOrFounder) {
                    owned.push(group);
                } else {
                    joined.push(group);
                }
            });

            setOwnedGroups(owned);
            setJoinedGroups(joined);
        } catch (error: unknown) {
            const errorMessage = (error as Error).message || "Failed to load groups.";
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

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const handleAddGroup = useCallback(() => {
        alert("Add Group clicked!");
        // TODO: Implementacja dodawania grupy
    }, []);

    return {
        ownedGroups,
        joinedGroups,
        loading,
        error,
        fetchGroups,
        handleAddGroup,
    };
};

/**
 * Hook to manage fetching details of a specific group by ID.
 */
const useGroupDetails = () => {
    const [group, setGroup] = useState<GroupDto | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGroup = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiFetch<GroupDto>(API_ENDPOINTS.groups.byId(id));
            setGroup(data);
        } catch (error: unknown) {
            const errorMessage = (error as Error).message || "Failed to load group.";
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

    useEffect(() => {
        // This hook expects the caller to provide the ID and call fetchGroup accordingly
    }, []);

    return {
        group,
        loading,
        error,
        fetchGroup,
    };
};

/**
 * Hook to manage fetching users in a specific group by Group ID.
 */
const useGroupUsers = () => {
    const [users, setUsers] = useState<SharedFileWithUserDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGroupUsers = useCallback(async (groupId: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiFetch<SharedFileWithUserDto[]>(API_ENDPOINTS.groups.usersInGroup(groupId));
            setUsers(data);
        } catch (error: unknown) {
            const errorMessage = (error as Error).message || "Failed to load group users.";
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

    useEffect(() => {
        // This hook expects the caller to provide the Group ID and call fetchGroupUsers accordingly
    }, []);

    return {
        users,
        loading,
        error,
        fetchGroupUsers,
    };
};

/**
 * Hook to manage fetching details of a specific group along with its shared files.
 */
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

    useEffect(() => {
        // This hook expects the caller to provide the ID and call fetchGroupWithFiles accordingly
    }, []);

    return {
        group,
        files,
        loading,
        error,
        fetchGroupWithFiles,
    };
};

export {useGroups, useGroupDetails, useGroupUsers, useGroupWithFiles};