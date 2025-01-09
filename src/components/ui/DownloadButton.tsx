"use client"
import React, {useState} from "react";
import {cn} from "@/lib/utils";
import {motion} from "framer-motion";
import {FileDto} from "@/types/api/file";
import {IconDownload} from "@tabler/icons-react";

interface DownloadButtonProps {
    file: FileDto;
    onDownload: (file: FileDto) => void;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({file, onDownload}) => {
    const [hovered, setHovered] = useState(false);

    const handleClick = () => {
        onDownload(file);
    };

    return (
        <div
            className={cn(
                "relative group/file z-40 h-full rounded-md flex-shrink-1"
            )}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={handleClick}
        >
            {hovered && (
                <motion.div
                    variants={secondaryVariant}
                    initial="initial"
                    animate="animate"
                    className="pointer-events-none absolute inset-0 z-30 border border-dashed border-pink-600 dark:border-sky-400 bg-transparent rounded-md"
                />
            )}

            <motion.div
                layoutId={`file-download-${file.id}`}
                variants={mainVariant}
                whileHover="animate"
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                }}
                className={cn(
                    "relative bg-white dark:bg-cardBackground flex items-center justify-center w-full h-full rounded-md",
                    "shadow-[0px_10px_50px_rgba(0,0,0,0.1)] cursor-pointer"
                )}
            >
                <IconDownload className="h-5 w-5 text-neutral-600 dark:text-neutral-300 mb-2"/>
                <span className="text-neutral-600 dark:text-neutral-300">Download</span>
            </motion.div>
        </div>
    )
};

const mainVariant = {
    initial: {
        x: 0,
        y: 0,
    },
    animate: {
        x: 7,
        y: 7,
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