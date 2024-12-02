"use client";

import {BackgroundBoxesDemo} from "@/components/ui/BackgroundBoxesDemo";
import {ModeToggle} from "@/components/ui/ModeToggle";


export default function Home() {
  return (
      <div className="relative min-h-screen flex items-center justify-center font-[family-name:var(--font-geist-sans)]">

          <div className="fixed top-4 right-4 z-50">
              <ModeToggle/>
          </div>
          {/* Full-screen background */}
          <BackgroundBoxesDemo/>

          {/* Main content */}
          <main className="relative z-30">
          </main>
      </div>
  );
}
