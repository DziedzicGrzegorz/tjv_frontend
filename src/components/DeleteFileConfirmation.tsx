"use client"
import React from "react";
import {FileDto} from "@/types/api/file";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface DeleteFileConfirmationProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    file: FileDto;
    onDelete: (fileId: string) => void;
}

const DeleteFileConfirmation: React.FC<DeleteFileConfirmationProps> = ({
                                                                           isOpen,
                                                                           setOpen,
                                                                           file,
                                                                           onDelete,
                                                                       }) => {
    const handleDelete = () => {
        onDelete(file.id);
        setOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete File</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the file <strong>{file.filename}</strong>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
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

export default DeleteFileConfirmation;