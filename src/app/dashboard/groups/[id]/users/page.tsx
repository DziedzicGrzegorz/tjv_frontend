"use client"
import {DataTable} from '@/components/DataTable/DataTable';
import {UserDto} from '@/types/api/user';
import {useEffect, useState} from "react";
import useUserColumns from "@/hooks/useUserColumn";
import {apiFetch} from "@/api/client";
import {API_ENDPOINTS} from "@/api/endpoints";
import {useParams} from "next/navigation";
import {toast} from "@/hooks/use-toast";

const UsersPage = () => {
    const [isAddOpen, setAddOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [isUpdateOpen, setUpdateOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
    const [users, setUsers] = useState<UserDto[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    //get id from router
    const {id} = useParams() as {
        id: string
    };

    const fetchGroupUsers = async (page: number, size: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiFetch<UserDto[]>(
                API_ENDPOINTS.groups.usersInGroup(id)
            );
            console.log("Group users data:", data);
            setUsers(data);
        } catch (error: unknown) {
            const errorMessage =
                (error as Error).message || "Failed to load group users.";
            setError(errorMessage);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };
    //fetch group users on component mount
    useEffect(() => {
        fetchGroupUsers(0, 10);
    }, []);
    const handleEdit = (user: UserDto) => {
        setSelectedUser(user);
        setUpdateOpen(true);
    };

    const {userColumns} = useUserColumns(handleEdit);

    if (!users) {
        return <div>Ładowanie...</div>;
    }

    return (
        <div
            className="bg-background h-full"
        >
            <DataTable<UserDto>
                data={users}
                columns={userColumns}
                defaultSorting={[{id: 'username', desc: false}]}
            />

        </div>
    );
};

export default UsersPage;