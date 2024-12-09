// src/pages/dashboard/page.tsx

"use client";

import React from "react";
import {useCurrentUser} from "@/hooks/useUser";

const Dashboard = () => {
    const {currentUser, loading, error, fetchCurrentUser} = useCurrentUser();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-background">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Dashboard</h1>

            <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded shadow-md w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    Current User Details
                </h2>

                {loading && <p className="text-gray-700 dark:text-gray-300 mt-4">Loading...</p>}
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {currentUser && (
                    <div className="mt-4">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                            User Information
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>ID:</strong> {currentUser.id}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>Username:</strong> {currentUser.username}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>Email:</strong> {currentUser.email}
                        </p>

                        {currentUser.roles && (
                            <div className="mt-2">
                                <strong className="text-gray-700 dark:text-gray-300">Roles:</strong>
                                <ul className="list-disc pl-6">
                                    {currentUser.roles.map((role, index) => (
                                        <li key={index} className="text-gray-700 dark:text-gray-300">
                                            {role}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {currentUser.groupRoles && (
                            <div className="mt-2">
                                <strong className="text-gray-700 dark:text-gray-300">Group Roles:</strong>
                                <ul className="list-disc pl-6">
                                    {currentUser.groupRoles.map((groupRole, index) => (
                                        <li key={index} className="text-gray-700 dark:text-gray-300">
                                            <strong>Group:</strong> {groupRole.group.name}, <strong>Role:</strong> {groupRole.role}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {currentUser.sharedFiles && (
                            <div className="mt-2">
                                <strong className="text-gray-700 dark:text-gray-300">Shared Files:</strong>
                                <ul className="list-disc pl-6">
                                    {currentUser.sharedFiles.map((file, index) => (
                                        <li key={index} className="text-gray-700 dark:text-gray-300">
                                            <strong>File:</strong> {file.id}, <strong>Access:</strong> {file.permission}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <button
                onClick={() => {
                    fetchCurrentUser();
                }}
                className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all"
            >
                Refresh User Data
            </button>

            <button
                onClick={() => {
                    // Implementacja funkcji logout
                }}
                className="mt-6 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-all"
            >
                Logout
            </button>
        </div>
    );

};

export default Dashboard;
