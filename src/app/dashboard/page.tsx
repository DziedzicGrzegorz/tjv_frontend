"use client";

import React from "react";
import {useAuth} from "@/contenxt/AuthContext";

const Dashboard = () => {
    const {logout} = useAuth();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Dashboard</h1>
            <button
                onClick={logout}
                className="mt-6 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-all"
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;