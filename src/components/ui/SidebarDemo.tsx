"use client";

import React, {useState} from "react";
import {Sidebar, SidebarBody, SidebarLink} from "../ui/sidebar";
import {IconArrowLeft, IconBrandTabler, IconCrop, IconFiles, IconSettings, IconUserBolt} from "@tabler/icons-react";
import Link from "next/link";
import {motion} from "framer-motion";
import Image from "next/image";
import {cn} from "@/lib/utils";
import {useAuth} from "@/contenxt/AuthContext"; // Import your Auth context for logout functionality
import LogoSvg from "../../../public/CloudRainCon.svg";

export function SidebarDemo({children}: {
    children: React.ReactNode
}) {
    const links = [
        {
            label: "My Account",
            href: "/dashboard/user",
            icon: (
                <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"/>
            ),
        },
        {
            label: "Files",
            href: "/dashboard/files",
            icon: (
                <IconFiles className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"/>
            ),
        },
        {
            label: "Groups",
            href: "/dashboard/groups",
            icon: (
                <IconCrop className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"/>
            ),
        },
        {
            label: "Users",
            href: "/dashboard/users",
            icon: (
                <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"/>
            ),
        },
    ];

    const [open, setOpen] = useState(false);
    const {logout} = useAuth(); // Get the logout function from AuthContext

    return (
        <div
            className={cn(
                " rounded-md flex flex-col md:flex-row 0 w-full flex-1 border overflow-hidden ",
                "h-screen"
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10 bg-white dark:bg-deepBlue">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden ">
                        {open ? <Logo/> : <LogoIcon/>}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link}/>
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: "Logout",
                                href: "#",
                                icon: (
                                    <IconArrowLeft
                                        className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
                                        onClick={logout} // Trigger logout on click
                                    />
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            <main className="flex-1 bg-gray-50">{children}</main>
        </div>
    );
}

export const Logo = () => {
    return (
        <Link
            href="#"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <IconBrandTabler className="text-blue-500 h-6 w-6"/>
            <motion.span
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                className="font-medium text-black dark:text-white whitespace-pre"
            >
                FMS
            </motion.span>
        </Link>
    );
};

export const LogoIcon = () => {
    return (
        <Image
            src={LogoSvg}
            className="h-6 w-6"
            width={24}
            height={24}
            alt="Logo"
        />
    );
};