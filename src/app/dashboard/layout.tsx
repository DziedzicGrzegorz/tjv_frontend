"use client";

import React from "react";
import {SidebarDemo} from "@/components/ui/SidebarDemo";

const DashboardLayout = ({children}: {
    children: React.ReactNode
}) => {
    return <SidebarDemo>
        {children}
    </SidebarDemo>;
};

export default DashboardLayout;