import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import {ThemeProvider} from "@/components/theme-provider";
import {ModeToggle} from "@/components/ui/ModeToggle";
import {Toaster} from "@/components/ui/toaster";
import {AuthProvider} from "@/contenxt/AuthContext";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "FMS",
    creator: "Grzegorz Dziedzic",
    keywords: ["FMS", "grzegorz dziedzic", "dziedzic dev"],
    authors: [
        {
            name: "Grzegorz Dziedzic",
            url: "https://github.com/DziedzicGrzegorz"
        }
    ],
    description: "File Management System",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="white"
            enableSystem
            disableTransitionOnChange
        >
            <div className="fixed top-6 right-6 z-50">
                <ModeToggle/>
            </div>
            <AuthProvider>{children}</AuthProvider>
            <Toaster/>
        </ThemeProvider>
        </body>
        </html>
    );
}
