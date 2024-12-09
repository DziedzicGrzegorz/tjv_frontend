"use client"
import React, {useState} from "react";
import useFiles from "@/hooks/useFiles";
import {FileDto} from "@/types/api/file";
import {FileList} from "@/components/ui/FileList";
import UpdateFileDrawer from "@/components/UpdateFileDrawer";
import DeleteFileConfirmation from "@/components/DeleteFileConfirmation";
import ShareFileDialog from "@/components/ShareFileDialog";


const FilesPage: React.FC = () => {
    const {files, loading, handleDownload, handleDelete, handleUpdate, handleShareWithUser} = useFiles();

    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [isUpdateOpen, setUpdateOpen] = useState(false);
    const [isShareOpen, setShareOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<FileDto | null>(null);

    const openUpdateModal = (file: FileDto) => {
        setSelectedFile(file);
        setUpdateOpen(true);
    };

    const openDeleteModal = (file: FileDto) => {
        setSelectedFile(file);
        setDeleteOpen(true);
    };
    const openShareModal = (file: FileDto) => {
        setSelectedFile(file);
        setShareOpen(true);
    };

    const shareFile = async (fileId: string, userId: string, permission: 'READ' | 'WRITE') => {
        await handleShareWithUser({fileId, userId, permission});
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
                    onShare={openShareModal}
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
            {isShareOpen && selectedFile && (
                <ShareFileDialog
                    isOpen={isShareOpen}
                    setOpen={setShareOpen}
                    file={selectedFile}
                    onShare={shareFile}
                />
            )}
        </div>
    );
};

export default FilesPage;