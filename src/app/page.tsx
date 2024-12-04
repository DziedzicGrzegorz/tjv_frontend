"use client";

import {BackgroundBoxesDemo} from "@/components/ui/BackgroundBoxesDemo";


export default function Home() {
    return (
        <div
            className="relative min-h-screen flex items-center justify-center font-[family-name:var(--font-geist-sans)]">


            {/* Full-screen background */}
            <BackgroundBoxesDemo/>

            {/* Main content */}
            <main className="relative z-30">
            </main>
        </div>
    );
}
