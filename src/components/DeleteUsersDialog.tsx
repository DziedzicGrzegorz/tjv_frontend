// src/components/ui/DeleteUsersDialog.tsx
"use client";

import React, {useContext} from "react";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {UserDto} from "@/types/api/user";
import {toast} from "@/hooks/use-toast";
import DataTableContext from "@/components/DataTable/dataTableContext";
import {useGroups} from "@/hooks/useGroups";

interface DeleteUsersDialogProps {
    groupId: string;
    onDeleteSuccess: (deletedUserIds: string[]) => void;
}

const DeleteUsersDialog: React.FC<DeleteUsersDialogProps> = ({
                                                                 groupId,
                                                                 onDeleteSuccess,
                                                             }) => {
    const {table} = useContext(DataTableContext);
    const {removeMultipleUsersFromGroup} = useGroups();

    const numberOfSelectedRows = table?.getSelectedRowModel().rows.length || 0;

    const handleDelete = async () => {
        const selectedRows = table
            ?.getSelectedRowModel()
            .rows.map((row: {
                original: unknown
            }) => row.original as UserDto);

        if (selectedRows && selectedRows.length > 0) {
            const userIds = selectedRows.map(user => user.id);
            try {
                await removeMultipleUsersFromGroup(groupId, userIds);
                toast({
                    title: "Success",
                    description: "Selected users have been removed from the group.",
                    variant: "default",
                });
                onDeleteSuccess(userIds);
                if (table) {
                    table.resetRowSelection();
                }
            } catch (error) {
                console.error("Failed to delete users:", error);
                toast({
                    title: "Error",
                    description: "Failed to delete selected users.",
                    variant: "destructive",
                });
            }
        }
    };

    return (
        <Dialog>
            <DialogTrigger
                asChild
                // Disable button if no rows are selected
                className={numberOfSelectedRows === 0 ? "pointer-events-none opacity-50" : ""}
            >
                <Button variant="destructive">Delete Selected</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the
                        selected {numberOfSelectedRows} user{numberOfSelectedRows > 1 ? 's' : ''}? This action cannot be
                        undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => table?.resetRowSelection()}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteUsersDialog;