// src/components/ui/EditFileUpload.tsx

"use client";

import {cn} from "@/lib/utils";
import React, {useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";
import {IconUpload} from "@tabler/icons-react";
import {useDropzone} from "react-dropzone";
import {FileDto} from "@/types/api/file";
import {editFile} from "@/api/file";

interface EditFileUploadProps {
    existingFile: FileDto; // Informacje o istniejącym pliku
    onFileUpdated: (updatedFile: FileDto) => void; // Callback po udanej aktualizacji
    onError: (error: string) => void;
    refetchFiles: () => void;
}

interface UploadFile {
    file: File;
    id: string; // Unikalny identyfikator dla pliku
    uploading: boolean;
    error: string | null;
    success: boolean;
    fileDto?: FileDto | null; // Opcjonalne, ustawiane po udanym przesłaniu

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

export const EditFile: React.FC<EditFileUploadProps> = ({
                                                            existingFile,
                                                            onFileUpdated,
                                                            onError,
                                                            refetchFiles
                                                        }) => {
    const [file, setFile] = useState<UploadFile | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const filesContainerRef = useRef<HTMLDivElement>(null); // Referencja do kontenera pliku

    const handleFileChange = async (newFile: File) => {

        const uploadFileMeta: UploadFile = {
            file: newFile,
            id: `${newFile.name}-${newFile.size}-${newFile.lastModified}-${Math.random()}`,
            uploading: true,
            error: null,
            success: false,
        };

        setFile(uploadFileMeta);

        try {
            const updatedFileDto = await editFile(newFile, existingFile.id);
            if (!updatedFileDto) {
                throw new Error("Failed to replace file");
            }
            console.log("File replaced successfully:", uploadFileMeta);

            // Aktualizacja stanu
            setFile({...uploadFileMeta, uploading: false, success: true, fileDto: updatedFileDto});

            refetchFiles()
            // Callback do rodzica
            onFileUpdated(updatedFileDto);
        } catch (uploadError: any) {
            console.error("Failed to replace file:", uploadError);

            // Opcjonalnie, wywołanie callbacka błędu
            onError(uploadError.message || "Failed to replace file");

            // Aktualizacja stanu z błędem
            setFile({
                ...uploadFileMeta,
                uploading: false,
                error: uploadError.message || "Failed to replace file",
            });
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        multiple: false, // Pozwól tylko na jeden plik
        noClick: true,

        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                handleFileChange(acceptedFiles[0]);
            }
        },
        onDropRejected: (error) => {
            console.log(error);
            onError("File rejected. Please try again.");
        },
    });

    // Efekt przewijania do góry przy zmianie pliku
    useEffect(() => {
        if (filesContainerRef.current) {
            filesContainerRef.current.scrollTop = 0; // Przewiń do góry
        }
    }, [file]);

    return (
        <div className="w-full h-full" {...getRootProps()}>
            <input
                {...getInputProps()}
                ref={fileInputRef}
                id="file-upload-handle"
                type="file"
                multiple={false}
                className="hidden"
                onChange={(e) => {
                    const selectedFiles = Array.from(e.target.files || []);
                    if (selectedFiles.length > 0) {
                        handleFileChange(selectedFiles[0]);
                    }
                }}
            />
            <motion.div
                onClick={handleClick}
                whileHover="animate"
                className="p-10 group/file block rounded-lg cursor-pointer w-full h-full relative overflow-hidden border border-dashed border-gray-300 dark:border-neutral-700"
            >
                <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
                    <GridPattern/>
                </div>
                <div className="flex flex-col items-center justify-center h-full">
                    <p className="relative z-20 mt-4 text-xl font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
                        Upload file
                    </p>
                    <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
                        Drag or drop your file here or click to upload
                    </p>
                    <div className="relative w-full mt-2 mx-auto h-full">
                        <div className="h-full" ref={filesContainerRef}>
                            {file && (
                                <motion.div
                                    key={file.id}
                                    layoutId={`file-upload-${file.id}`}
                                    className={cn(
                                        "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start p-4 mt-4 w-full mx-auto rounded-md",
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
                                            {file.file.name}
                                        </motion.p>
                                        <motion.p
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            layout
                                            className="rounded-lg px-2 py-1 w-fit flex-shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"
                                        >
                                            {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                                        </motion.p>
                                    </div>

                                    <div
                                        className="flex text-sm flex-col items-start w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                                        <motion.p
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            layout
                                            className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800"
                                        >
                                            {file.file.type || "Unknown Type"}
                                        </motion.p>

                                        <motion.p initial={{opacity: 0}} animate={{opacity: 1}} layout>
                                            Modified:{" "}
                                            {new Date(file.file.lastModified).toLocaleDateString()}
                                        </motion.p>
                                    </div>

                                    {/* Status Przesyłania */}
                                    <div className="mt-2 w-full">
                                        {file.uploading && (
                                            <p className="text-blue-500 text-sm">Uploading...</p>
                                        )}
                                        {file.success && (
                                            <p className="text-green-500 text-sm">Upload successful!</p>
                                        )}
                                        {file.error && (
                                            <p className="text-red-500 text-sm">Error: {file.error}</p>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {!file && (
                                <motion.div
                                    layoutId="file-upload-placeholder"
                                    variants={mainVariant}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 20,
                                    }}
                                    className={cn(
                                        "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
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
                                            <IconUpload
                                                className="overflow-hidden  h-4 w-4 text-neutral-600 dark:text-neutral-400"/>
                                        </motion.p>
                                    ) : (
                                        <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300"/>
                                    )}
                                </motion.div>
                            )}

                            {!file && (
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
            className="flex bg-gray-100 dark:bg-neutral-900 flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105"
        >
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