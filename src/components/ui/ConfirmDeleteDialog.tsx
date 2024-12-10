// src/components/ui/ConfirmDeleteDialog.tsx
"use client";

import React from "react";
import {Button} from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {UserDto} from "@/types/api/user";

interface ConfirmDeleteDialogProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    onConfirm: () => void;
    user: UserDto;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({isOpen, setOpen, onConfirm, user}) => {
    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Usuń Użytkownika</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the user <strong>{user.username}</strong> from the group?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDeleteDialog;