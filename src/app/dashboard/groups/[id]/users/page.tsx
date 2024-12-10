// src/pages/groups/[id]/users/page.tsx
"use client";

import React, {useEffect, useState} from "react";
import {DataTable} from '@/components/DataTable/DataTable';
import {UserDto} from '@/types/api/user';
import useUserColumns from "@/hooks/useUserColumn";
import {useParams} from "next/navigation";
import {toast} from "@/hooks/use-toast";
import {Button} from '@/components/ui/button';
import {useGroups} from '@/hooks/useGroups';
import ManageUsersDialog from '@/components/ui/ManageUsersDialog';
import ConfirmDeleteDialog from "@/components/ui/ConfirmDeleteDialog";
import useGroupDetails from "@/hooks/useGroupDetails";
import {useCurrentUser} from "@/hooks/useUser";
import DeleteUsersDialog from "@/components/DeleteUsersDialog";

/**
 * UsersPage Component
 * Displays and manages users within a specific group.
 */
const UsersPage = () => {
    const [isAddOpen, setAddOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<UserDto | null>(null);
    const [users, setUsers] = useState<UserDto[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get group ID from router
    const {id} = useParams() as {
        id: string
    };

    const {
        addUserToGroup,
        removeUserFromGroup,
        loading: groupLoading,
        error: groupError
    } = useGroups();
    const {currentUser, loading: userLoading, error: userError} = useCurrentUser();
    const {group, loading: groupDetailsLoading, error: groupDetailsError, fetchGroupDetails} = useGroupDetails();

    useEffect(() => {
        if (id) {
            fetchGroupDetails(id);
        }
    }, [id, fetchGroupDetails]);

    useEffect(() => {
        if (group) {
            const fetchedUsers = group.userRoles?.map(role => ({
                id: role.user.id,
                username: role.user.username,
                email: role.user.email,
            })) || [];
            setUsers(fetchedUsers);
        }
    }, [group]);

    // Determine if the current user is an admin or founder
    const isAdminOrFounder = group?.userRoles?.some(role => role.user.id === currentUser?.id && (role.role === 'ADMIN' || role.role === 'FOUNDER')) || false;

    /**
     * Handles the removal of a single user.
     */
    const handleRemove = (user: UserDto) => {
        setUserToDelete(user);
    };

    /**
     * Handles adding a new user to the group.
     */
    const handleAddUser = async (userId: string, role: "MEMBER" | "ADMIN") => {
        try {
            const newUser = await addUserToGroup(id, userId, role);
            setUsers(prevUsers => prevUsers ? [...prevUsers, newUser] : [newUser]);
            toast({
                title: "Success",
                description: "User has been added to the group.",
                variant: "default",
            });
        } catch (error) {
            console.error("Failed to add user:", error);
            toast({
                title: "Error",
                description: "Failed to add user to the group.",
                variant: "destructive",
            });
        }
    };

    /**
     * Confirms the removal of a user.
     */
    const confirmRemove = () => {
        if (userToDelete) {
            removeUserFromGroup(id, userToDelete.id)
                .then(() => {
                    setUsers(prevUsers => prevUsers?.filter(u => u.id !== userToDelete.id) || null);
                    toast({
                        title: "Success",
                        description: "User has been removed from the group.",
                        variant: "default",
                    });
                })
                .catch(error => {
                    console.error("Failed to remove user:", error);
                    toast({
                        title: "Error",
                        description: "Failed to remove user from the group.",
                        variant: "destructive",
                    });
                })
                .finally(() => {
                    setUserToDelete(null);
                });
        }
    };


    /**
     * Callback to handle successful bulk deletion.
     * Removes deleted users from the state.
     */
    const handleBulkDeleteSuccess = (deletedUserIds: string[]) => {
        setUsers(prevUsers => prevUsers?.filter(user => !deletedUserIds.includes(user.id)) || null);
        toast({
            title: "Success",
            description: "Selected users have been removed from the group.",
            variant: "default",
        });
    };

    /**
     * Get user columns for the DataTable.
     */
    const {userColumns} = useUserColumns({
        isAdminOrFounder,
        handleRemove,
    });

    // Handle loading state with Spinner
    if (groupDetailsLoading || userLoading) {
        return (
            <div className="w-full h-full p-5 dark:bg-background flex items-center justify-center">
                <p className="text-gray-700 dark:text-gray-300 ml-2">Loading group details...</p>
            </div>
        );
    }

    if (error || groupError || userError || groupDetailsError) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <p className="text-red-600">{error || groupError || userError || groupDetailsError}</p>
                <Button onClick={() => fetchGroupDetails(id)} className="mt-4">
                    Retry
                </Button>
            </div>
        );
    }

    if (!users || users.length === 0) {
        return <div>No users in this group.</div>;
    }

    return (
        <div className="bg-background h-full p-5">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-bold">Group Users</h1>
            </div>

            {isAdminOrFounder && (
                <ManageUsersDialog
                    isOpen={isAddOpen}
                    setOpen={setAddOpen}
                    groupId={id}
                    onAddUser={handleAddUser}
                />
            )}

            {isAdminOrFounder && (
                <DataTable<UserDto>
                    data={users}
                    columns={userColumns}
                    defaultSorting={[{id: 'username', desc: false}]}
                    createButton={
                        <Button onClick={() => setAddOpen(true)} className="bg-green-600 text-white hover:bg-green-700">
                            Add User
                        </Button>

                    }
                    deleteButton={
                        <DeleteUsersDialog
                            groupId={id}
                            onDeleteSuccess={handleBulkDeleteSuccess}
                        />
                    }
                >

                </DataTable>
            )
            }

            {userToDelete && (
                <ConfirmDeleteDialog
                    isOpen={!!userToDelete}
                    setOpen={() => setUserToDelete(null)}
                    onConfirm={confirmRemove}
                    user={userToDelete}
                />
            )}
        </div>
    );

};

export default UsersPage;