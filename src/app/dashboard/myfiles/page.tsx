// src/pages/myfiles/page.tsx
"use client";

import React, {useEffect, useState} from "react";
import useFiles from "@/hooks/useFiles";
import {FileDto, FileSharingRequest, SharedFileWithGroupDto, SharedFileWithUserDto} from "@/types/api/file";
import {FileList} from "@/components/ui/FileList";
import UpdateFileDrawer from "@/components/UpdateFileDrawer";
import DeleteFileConfirmation from "@/components/DeleteFileConfirmation";
import ShareFileDialog from "@/components/ShareFileDialog";
import StopSharingDialog from "@/components/StopSharingDialog";

const FilesPage: React.FC = () => {
    const {
        files,
        loading,
        handleDownload,
        handleDelete,
        handleShareWithUser,
        getSharedUsers,
        fetchUserFiles,
        handleShareWithGroup,
        getSharedFileWithGroups
    } = useFiles();

    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [isUpdateOpen, setUpdateOpen] = useState(false);
    const [isShareOpen, setShareOpen] = useState(false);
    const [isStopSharingOpen, setStopSharingOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<FileDto | null>(null);
    const [sharedUsers, setSharedUsers] = useState<SharedFileWithUserDto[]>([]);
    const [sharedFileIds, setSharedFileIds] = useState<Set<string>>(new Set());
    const [loadingSharedUsers, setLoadingSharedUsers] = useState(false);
    const [sharedGroups, setSharedGroups] = useState<SharedFileWithGroupDto[]>([]);
    const [sharedFileWithGroupIds, setSharedFileWithGroupIds] = useState<Set<string>>(new Set());


    useEffect(() => {
        const fetchSharedFileIds = async () => {
            const sharedIds = new Set<string>();
            const groupSharedIds = new Set<string>();

            await Promise.all(
                files.map(async (file) => {
                    const [sharedUsers, sharedGroups] = await Promise.all([
                        getSharedUsers(file.id),
                        getSharedFileWithGroups(file.id),
                    ]);
                    if (sharedUsers.length > 0) {
                        sharedIds.add(file.id);
                    }
                    if (sharedGroups.length > 0) {
                        groupSharedIds.add(file.id);
                    }
                })
            );

            setSharedFileIds(sharedIds);
            setSharedFileWithGroupIds(groupSharedIds);
        };

        if (files.length > 0) {
            fetchSharedFileIds();
        } else {
            setSharedFileIds(new Set());
            setSharedFileWithGroupIds(new Set());
        }
    }, [files, getSharedUsers, getSharedFileWithGroups]);


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

    const shareFile = async (shareData: FileSharingRequest) => {
        if ('userId' in shareData) {
            // Handle sharing with a user
            const {fileId, userId, permission} = shareData;
            await handleShareWithUser({fileId, userId, permission});
        } else if ('groupId' in shareData) {
            // Handle sharing with a group
            const {fileId, groupId, permission} = shareData;
            await handleShareWithGroup({fileId, groupId, permission}); // Assuming you have this function
        }
        setSharedFileIds((prev) => new Set(prev).add(shareData.fileId));
    };


    const openStopSharingModal = async (file: FileDto) => {
        setSelectedFile(file);
        setStopSharingOpen(true);
        setLoadingSharedUsers(true);

        const [sharedUsersData, sharedGroupsData] = await Promise.all([
            getSharedUsers(file.id),
            getSharedFileWithGroups(file.id),
        ]);
        console.log({sharedGroupsData});

        setSharedUsers(sharedUsersData);
        setSharedGroups(sharedGroupsData);
        setLoadingSharedUsers(false);
    };


    const handleFilesRefresh = () => {
        fetchUserFiles();
    };

    const userCanEditAndDelete = true;

    return (
        <div className="w-full h-full p-10 dark:bg-background">
            <div className="h-4/5 overflow-y-hidden pt-20">
                <FileList
                    files={files}
                    loading={loading}
                    onDownload={handleDownload}
                    onEdit={openUpdateModal}
                    onDelete={openDeleteModal}
                    onShare={openShareModal}
                    onStopShare={openStopSharingModal}
                    disableContextMenu={!userCanEditAndDelete}
                    sharedFileIds={sharedFileIds}
                    sharedFileWithGroupIds={sharedFileWithGroupIds}
                />
            </div>
            {isUpdateOpen && selectedFile && (
                <UpdateFileDrawer
                    isOpen={isUpdateOpen}
                    setOpen={setUpdateOpen}
                    file={selectedFile}
                    refetchFiles={handleFilesRefresh}
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
            {isStopSharingOpen && selectedFile && (
                <StopSharingDialog
                    isOpen={isStopSharingOpen}
                    setOpen={setStopSharingOpen}
                    file={selectedFile}
                    sharedUsers={sharedUsers}
                    refreshFiles={handleFilesRefresh}
                    sharedGroups={sharedGroups}
                />
            )}
        </div>
    );
};

export default FilesPage;
