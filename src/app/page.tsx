"use client";

import {BackgroundBoxesDemo} from "@/components/ui/BackgroundBoxesDemo";
import React from "react";
import {LoginButton} from "@/app/loginButton";


export default function Home() {
    return (
        <div
            className="relative min-h-screen flex items-center justify-center font-[family-name:var(--font-geist-sans)]">


            {/* Full-screen background */}
            <BackgroundBoxesDemo/>

            {/* Login button in the top-right corner */}
            <div className="fixed top-7 right-20 z-40">
                <LoginButton/>
            </div>

            {/* Main content */}
            <main className="relative z-30">
            </main>
        </div>
    );
}
