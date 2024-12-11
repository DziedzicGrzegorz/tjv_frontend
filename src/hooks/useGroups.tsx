"use client";

import {useCallback, useEffect, useState} from "react";
import {toast} from "@/hooks/use-toast";
import {API_ENDPOINTS} from "@/api/endpoints";
import {apiFetch} from "@/api/client";
import {CreateGroupRequest, GroupDto} from "@/types/api/group";
import {UserDto} from "@/types/api/user";
import {useUser} from "@/hooks/useUser";

/**
 * Hook to manage fetching and modifying groups for the current user.
 */
const useGroups = () => {
    const [ownedGroups, setOwnedGroups] = useState<GroupDto[]>([]);
    const [joinedGroups, setJoinedGroups] = useState<GroupDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const {fetchUserByEmail} = useUser();

    /**
     * Fetches all groups associated with the current user.
     */
    const fetchGroups = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const currentUser = await apiFetch<UserDto>(API_ENDPOINTS.users.current);
            const {id} = currentUser;

            const data = await apiFetch<GroupDto[]>(API_ENDPOINTS.groups.byCurrentUser());

            const owned: GroupDto[] = [];
            const joined: GroupDto[] = [];

            data.forEach(group => {
                const isOwnerOrAdmin = group.userRoles?.some(role => role.user.id === id && (role.role === 'ADMIN' || role.role === 'FOUNDER'));
                if (isOwnerOrAdmin) {
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

    /**
     * Adds a new group.
     * @param createGroupRequest - The details of the group to create.
     */
    const addGroup = useCallback(async (createGroupRequest: CreateGroupRequest) => {
        setLoading(true);
        setError(null);
        try {
            await apiFetch<GroupDto>(API_ENDPOINTS.groups.create, {
                method: 'POST',
                body: JSON.stringify(createGroupRequest),
            });

            // Fetch groups again to include the new group
            await fetchGroups();

            toast({
                title: "Success",
                description: "Group added successfully.",
                variant: "default",
            });
        } catch (error: unknown) {
            const errorMessage = (error as Error).message || "Failed to add group.";
            setError(errorMessage);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [fetchGroups]);

    /**
     * Adds a user to a group with a specified role.
     * @param groupId - The ID of the group.
     * @param userId - The ID of the user to add.
     * @param role - The role to assign to the user ('MEMBER' | 'ADMIN').
     */
    const addUserToGroup = useCallback(async (groupId: string, userId: string, role: 'MEMBER' | 'ADMIN'): Promise<UserDto> => {
        //fetch user by id to check if user exists and map email to id
        const user = await fetchUserByEmail(userId);
        console.log("User:", user);
        if (!user) {
            toast({
                title: "Error",
                description: "User not found.",
                variant: "destructive",
            })
            throw new Error("User not found.");
        }
        setLoading(true);
        setError(null);
        try {
            const response = await apiFetch<UserDto>(`${API_ENDPOINTS.groups.byId(groupId)}/add-users`, {
                method: 'POST',
                body: JSON.stringify([user.id]), // Assuming the API expects an array of IDs even for single addition
            });

            await fetchGroups();

            toast({
                title: "Success",
                description: "User added to group successfully.",
                variant: "default",
            });

            return response;
        } catch (error: unknown) {
            const errorMessage = (error as Error).message || "Failed to add user to group.";
            setError(errorMessage);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Removes a user from a group.
     * @param groupId - The ID of the group.
     * @param userId - The ID of the user to remove.
     */
    const removeUserFromGroup = useCallback(async (groupId: string, userId: string) => {
        setLoading(true);
        setError(null);
        try {
            await apiFetch(`${API_ENDPOINTS.groups.byId(groupId)}/remove-users`, {
                method: 'DELETE',
                body: JSON.stringify([userId]), // Assuming the API expects an array of IDs even for single removal
            });

            await fetchGroups();

            toast({
                title: "Success",
                description: "User removed from group successfully.",
                variant: "default",
            });
        } catch (error: unknown) {
            const errorMessage = (error as Error).message || "Failed to remove user from group.";
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

    /**
     * Removes multiple users from a group.
     * @param groupId - The ID of the group.
     * @param userIds - An array of user IDs to remove.
     */
    const removeMultipleUsersFromGroup = useCallback(async (groupId: string, userIds: string[]) => {
        setLoading(true);
        setError(null);
        try {
            await apiFetch(`${API_ENDPOINTS.groups.byId(groupId)}/remove-users`, {
                method: 'DELETE',
                body: JSON.stringify(userIds),
            });

            // Update the group iby fetching groups again to include the new groupn state by removing the users
            await fetchGroups();

            toast({
                title: "Success",
                description: "Users removed from group successfully.",
                variant: "default",
            });
        } catch (error: unknown) {
            const errorMessage = (error as Error).message || "Failed to remove users from group.";
            setError(errorMessage);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        ownedGroups,
        joinedGroups,
        loading,
        error,
        fetchGroups,
        addGroup,
        addUserToGroup,
        removeUserFromGroup,
        removeMultipleUsersFromGroup,
    };
};

export {useGroups};