"use client";

import React, {useEffect, useState} from "react";
import {useAuth} from "@/contenxt/AuthContext";
import {API_ENDPOINTS} from "@/api/endpoints";
import {apiFetch} from "@/api/client";
import {UserDto} from "@/types/api/user";

const Dashboard = () => {
    const {logout} = useAuth();
    const [user, setUser] = useState<UserDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCurrentUser = async () => {
        setLoading(true);
        setError(null);
        setUser(null);

        try {
            const data = await apiFetch<UserDto>(API_ENDPOINTS.users.current); // Fetch current user
            console.log("Current user data:", data);
            setUser(data);
        } catch (err: unknown) {
            setError((err as Error).message || "An unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    // Fetch current user on component mount
    useEffect(() => {
        fetchCurrentUser();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-background">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Dashboard</h1>

            <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded shadow-md w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    Current User Details
                </h2>

                {loading && <p className="text-gray-700 dark:text-gray-300 mt-4">Loading...</p>}
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {user && (
                    <div className="mt-4">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                            User Information
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>ID:</strong> {user.id}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>Username:</strong> {user.username}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>Email:</strong> {user.email}
                        </p>

                        {user.roles && (
                            <div className="mt-2">
                                <strong className="text-gray-700 dark:text-gray-300">Roles:</strong>
                                <ul className="list-disc pl-6">
                                    {user.roles.map((role, index) => (
                                        <li key={index} className="text-gray-700 dark:text-gray-300">
                                            {role}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {user.groupRoles && (
                            <div className="mt-2">
                                <strong className="text-gray-700 dark:text-gray-300">Group Roles:</strong>
                                <ul className="list-disc pl-6">
                                    {user.groupRoles.map((groupRole, index) => (
                                        <li key={index} className="text-gray-700 dark:text-gray-300">
                                            <strong>Group:</strong> {groupRole.group.name}, <strong>Role:</strong> {groupRole.role}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {user.sharedFiles && (
                            <div className="mt-2">
                                <strong className="text-gray-700 dark:text-gray-300">Shared Files:</strong>
                                <ul className="list-disc pl-6">
                                    {user.sharedFiles.map((file, index) => (
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
                onClick={logout}
                className="mt-6 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-all"
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;