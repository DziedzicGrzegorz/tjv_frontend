// src/pages/FilePage.tsx

"use client";
import {FileUpload} from "@/components/ui/file-upload";
import {useState} from "react";
import {FileDto} from "@/types/api/file";

export default function FilePage() {
    // State to keep track of uploaded files and their details
    const [globalError, setGlobalError] = useState<string | null>(null);

    /**
     * Handler for when files are uploaded.
     * @param files - Array of FileDto objects returned from the upload.
     */
    const handleFileUpload = (files: FileDto[]) => {
        console.log("Uploaded Files:", files);
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
        <div
            //center this
            className="flex items-center justify-center h-screen bg-gray-100 dark:bg-background"
        >
            <div
                className="w-full max-w-4xl mx-auto min-h-96 h-4/5 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
                <FileUpload
                    onChange={handleFileUpload} // Expects FileDto[]
                    onError={handleUploadError}
                />
                {globalError && (
                    <p className="mt-4 text-center text-red-500">{globalError}</p>
                )}
            </div>
        </div>
    )
}