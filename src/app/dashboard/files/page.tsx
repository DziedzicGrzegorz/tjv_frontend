// src/pages/FilePage.tsx

"use client";
import {FileUpload} from "@/components/ui/file-upload";
import {useState} from "react";
import {FileDto} from "@/types/api/file";

export default function FilePage() {
    // State to keep track of uploaded files and their details
    const [uploadedFiles, setUploadedFiles] = useState<FileDto[]>([]);
    // State to keep track of any global upload errors
    const [globalError, setGlobalError] = useState<string | null>(null);

    /**
     * Handler for when files are uploaded.
     * @param files - Array of FileDto objects returned from the upload.
     */
    const handleFileUpload = (files: FileDto[]) => {
        console.log("Uploaded Files:", files);
        setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
        // Optionally, reset global error if any
        setGlobalError(null);
    };

    /**
     * Handler for upload errors.
     * @param error - Error message string.
     */
    const handleUploadError = (error: string) => {
        console.error("Upload Error:", error);
        setGlobalError(error);
    };

    return (
        <div className="p-6 w-full h-full bg-background">
            <h1 className="text-2xl font-bold pb-20">File Management</h1>
            <div
                className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
                <FileUpload
                    onChange={handleFileUpload} // Expects FileDto[]
                    onError={handleUploadError}
                />
                {/* Display global error if any */}
                {globalError && (
                    <p className="mt-4 text-center text-red-500">{globalError}</p>
                )}
                {/* Display list of uploaded files */}
                {uploadedFiles.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold">Uploaded Files</h2>
                        <ul className="mt-2 space-y-2">
                            {uploadedFiles.map((file) => (
                                <li key={file.id} className="flex justify-between">
                                    <span>{file.filename}</span>
                                    <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}