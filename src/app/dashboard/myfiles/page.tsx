"use client"
import React, {useState} from "react";
import useFiles from "@/hooks/useFiles";
import {FileDto} from "@/types/api/file";
import {FileList} from "@/components/ui/FileList";
import UpdateFileDrawer from "@/components/UpdateFileDrawer";
import DeleteFileConfirmation from "@/components/DeleteFileConfirmation";


const FilesPage: React.FC = () => {
    const {files, loading, handleDownload, handleDelete, handleUpdate} = useFiles();

    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [isUpdateOpen, setUpdateOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<FileDto | null>(null);

    const openUpdateModal = (file: FileDto) => {
        setSelectedFile(file);
        setUpdateOpen(true);
    };

    const openDeleteModal = (file: FileDto) => {
        setSelectedFile(file);
        setDeleteOpen(true);
    };

    const userCanEditAndDelete = true;

    return (
        <div className="w-full h-full p-10 dark:bg-background">
            <div className="h-4/5 overflow-y-auto pt-20">
                <FileList
                    files={files}
                    loading={loading}
                    onDownload={handleDownload}
                    onEdit={openUpdateModal}
                    onDelete={openDeleteModal}
                    disableContextMenu={!userCanEditAndDelete}
                />
            </div>
            {isUpdateOpen && selectedFile && (
                <UpdateFileDrawer
                    isOpen={isUpdateOpen}
                    setOpen={setUpdateOpen}
                    file={selectedFile}
                    refetchFiles={handleUpdate}
                    // onFileUpdated={handleUpdate}
                />
            )}
            {isDeleteOpen && selectedFile && (
                <DeleteFileConfirmation
                    isOpen={isDeleteOpen}
                    setOpen={setDeleteOpen}
                    file={selectedFile}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default FilesPage;