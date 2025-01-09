// src/components/ui/file-upload.tsx

import {cn} from "@/lib/utils";
import React, {useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";
import {IconUpload} from "@tabler/icons-react";
import {useDropzone} from "react-dropzone";
import {uploadFile} from "@/api/file";
import {FileDto} from "@/types/api/file";

// Define the props interface with correct types
interface FileUploadProps {
    onChange: (files: FileDto[]) => void; // Expect FileDto[] instead of File[]
    onError: (error: string) => void;
}

interface UploadFile {
    file: File;
    id: string; // Unique identifier for the file
    uploading: boolean;
    error: string | null;
    success: boolean;
    fileDto?: FileDto | null; // Optional, will be set upon successful upload
}

const mainVariant = {
    initial: {
        x: 0,
        y: 0,
    },
    animate: {
        x: 20,
        y: -20,
        opacity: 0.9,
    },
};

const secondaryVariant = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
    },
};

export const FileUpload: React.FC<FileUploadProps> = ({onChange, onError}) => {
    const [files, setFiles] = useState<UploadFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const filesContainerRef = useRef<HTMLDivElement>(null); // Reference to the uploadFiles container

    const handleFileChange = async (newFiles: File[]) => {
        // Assign a unique ID to each file
        const filesWithMeta: UploadFile[] = newFiles.map((file) => ({
            file,
            id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
            uploading: true,
            error: null,
            success: false,
        }));

        // Prepend new uploadFiles to the beginning of the list
        setFiles((prevFiles) => [...filesWithMeta, ...prevFiles]);

        // Upload all uploadFiles in parallel
        const uploadPromises = filesWithMeta.map(async (uploadFileMeta) => {
            try {
                const fileDto = await uploadFile(uploadFileMeta.file);
                console.log("File uploaded successfully:", fileDto);

                // Return updated UploadFile object
                return {...uploadFileMeta, uploading: false, success: true, fileDto};
            } catch (uploadError: any) {
                console.error("Failed to upload file:", uploadError);

                // Optionally, call the onError prop
                onError(uploadError.message || "Failed to upload file");

                // Return updated UploadFile object with error
                return {
                    ...uploadFileMeta,
                    uploading: false,
                    error: uploadError.message || "Failed to upload file",
                };
            }
        });

        // Wait for all uploads to finish
        const uploadResults = await Promise.all(uploadPromises);

        // Update state with all upload results at once
        setFiles((prevFiles) =>
            prevFiles.map((prevFile) => {
                const updatedFile = uploadResults.find((res) => res.id === prevFile.id);
                return updatedFile || prevFile;
            })
        );

        // Collect successful FileDtos
        const successfulUploads = uploadResults
            .filter((result) => result.success && result.fileDto)
            .map((result) => result.fileDto as FileDto);

        // After all uploads, notify the parent with the successful FileDto[]
        if (successfulUploads.length > 0) {
            onChange(successfulUploads);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        multiple: true, // Allow multiple uploadFiles
        noClick: true,
        onDrop: handleFileChange,
        onDropRejected: (error) => {
            console.log(error);
            onError("File rejected. Please try again.");
        },
    });

    // Effect to scroll to the top whenever 'uploadFiles' changes
    useEffect(() => {
        if (filesContainerRef.current) {
            filesContainerRef.current.scrollTop = 0; // Scroll to top
        }
    }, [files]);

    return (
        <div className="w-full h-full" {...getRootProps()}>
            <input
                {...getInputProps()}
                ref={fileInputRef}
                id="file-upload-handle"
                type="file"
                multiple
                onChange={(e) => {
                    const selectedFiles = Array.from(e.target.files || []);
                    if (selectedFiles.length > 0) {
                        handleFileChange(selectedFiles);
                    }
                }}
                className="hidden"
            />
            <motion.div
                onClick={handleClick}
                whileHover="animate"
                className="p-10 group/file block rounded-lg cursor-pointer w-full h-full relative overflow-hidden"
            >
                <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
                    <GridPattern/>
                </div>
                <div className="flex flex-col items-center justify-center h-full">
                    <p className="relative z-20 mt-4 text-xl font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
                        Upload file
                    </p>
                    <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
                        Drag or drop your files here or click to upload
                    </p>
                    <div className="relative w-full mt-2 max-w-xl mx-auto h-full">
                        {/* Added a scrollbar for the list of uploadFiles */}
                        <div className="h-full overflow-y-auto" ref={filesContainerRef}>
                            {files.length > 0 &&
                                files.map((uploadFileMeta) => (
                                    <motion.div
                                        key={uploadFileMeta.id}
                                        layoutId={`file-upload-${uploadFileMeta.id}`} // Ensure unique layoutId
                                        className={cn(
                                            "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-28 p-4 mt-4 w-full mx-auto rounded-md",
                                            "shadow-sm"
                                        )}
                                    >
                                        <div className="flex justify-between w-full items-center gap-4">
                                            <motion.p
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                layout
                                                className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs"
                                            >
                                                {uploadFileMeta.file.name}
                                            </motion.p>
                                            <motion.p
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                layout
                                                className="rounded-lg px-2 py-1 w-fit flex-shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"
                                            >
                                                {(uploadFileMeta.file.size / (1024 * 1024)).toFixed(2)} MB
                                            </motion.p>
                                        </div>

                                        <div
                                            className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                                            <motion.p
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                layout
                                                className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 "
                                            >
                                                {uploadFileMeta.file.type || "Unknown Type"}
                                            </motion.p>

                                            <motion.p initial={{opacity: 0}} animate={{opacity: 1}} layout>
                                                Modified{" "}
                                                {new Date(uploadFileMeta.file.lastModified).toLocaleDateString()}
                                            </motion.p>
                                        </div>

                                        {/* Upload Status */}
                                        <div className="mt-2 w-full">
                                            {uploadFileMeta.uploading && (
                                                <p className="text-blue-500 text-sm">Uploading...</p>
                                            )}
                                            {uploadFileMeta.success && (
                                                <p className="text-green-500 text-sm">Upload successful!</p>
                                            )}
                                            {uploadFileMeta.error && (
                                                <p className="text-red-500 text-sm">Error: {uploadFileMeta.error}</p>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}

                            {!files.length && (
                                <motion.div
                                    layoutId="file-upload-placeholder"
                                    variants={mainVariant}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 20,
                                    }}
                                    className={cn(
                                        " relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                                        "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                                    )}
                                >
                                    {isDragActive ? (
                                        <motion.p
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            className="text-neutral-600 flex flex-col items-center"
                                        >
                                            Drop it
                                            <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400"/>
                                        </motion.p>
                                    ) : (
                                        <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300"/>
                                    )}
                                </motion.div>
                            )}

                            {!files.length && (
                                <motion.div
                                    variants={secondaryVariant}
                                    className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
                                ></motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export function GridPattern() {
    const columns = 41;
    const rows = 11;
    return (
        <div
            className="flex bg-gray-100 dark:bg-neutral-900 flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
            {Array.from({length: rows}).map((_, row) =>
                Array.from({length: columns}).map((_, col) => {
                    const index = row * columns + col;
                    return (
                        <div
                            key={`${col}-${row}`}
                            className={`w-10 h-10 flex flex-shrink-0 rounded-[2px] ${
                                index % 2 === 0
                                    ? "bg-gray-50 dark:bg-neutral-950"
                                    : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
                            }`}
                        />
                    );
                })
            )}
        </div>
    );
}