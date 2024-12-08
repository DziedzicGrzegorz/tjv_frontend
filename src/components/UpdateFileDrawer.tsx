"use client"

import * as React from "react"

import {Button} from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import {FileDto} from "@/types/api/file";
import {EditFile} from "@/components/ui/EditFile";

interface UpdateFileProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    file: FileDto;
}

const handleFileUpload = (file: FileDto) => {
    console.log("Uploaded Files:", file);
    // Optionally, reset global error if any
};
const handleUploadError = (error: string) => {
    console.error("Upload Error:", error);
};
export default function UpdateFileDrawer({isOpen, setOpen, file}: UpdateFileProps) {

    return (
        <Drawer open={isOpen} onOpenChange={setOpen}>
            <DrawerContent>
                <div className="mx-auto w-full max-w-xl">
                    <DrawerHeader>
                        <DrawerTitle>Upload File</DrawerTitle>
                        <DrawerDescription>This file will be replaced with existing one</DrawerDescription>
                    </DrawerHeader>
                    <EditFile
                        existingFile={file}
                        onFileUpdated={handleFileUpload}
                        onError={handleUploadError}
                    />

                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
