"use client";
import React from "react";
import {Boxes} from "../ui/background-boxes";
import {cn} from "@/lib/utils";

export function BackgroundBoxesDemo() {
    return (
        <div
            className="absolute inset-0 w-full h-full overflow-hidden bg-background flex flex-col items-center justify-center text-foreground">
            {/* Background overlay */}
            <div
                className="absolute inset-0 w-full h-full bg-background z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none"/>

            {/* Animated Boxes */}
            <Boxes/>

            {/* Centered content */}
            <div className="relative z-20 text-center">
                <h1 className={cn("md:text-4xl text-xl font-bold text-highlight")}>
                    File Management System
                </h1>
                <p className="mt-2 max-w-xl">
                    A robust platform designed for efficient file storage, management, and
                    sharing. It supports user-based ownership, group management, and
                    permission controls with a relational database.
                </p>
            </div>
        </div>
    );
}
