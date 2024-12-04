"use client";

import React, {useState} from "react";
import {useAuth} from "@/contenxt/AuthContext";
import {API_ENDPOINTS} from "@/api/endpoints";
import {apiFetch} from "@/api/client";

interface User {
    id: string;
    username: string;
    email: string;
}

const Dashboard = () => {
    const {logout} = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFetchUserByEmail = async () => {
        setLoading(true);
        setError(null);
        setUser(null);

        try {
            const data = await apiFetch<User>(API_ENDPOINTS.users.byEmail(email));
            console.log({data})
            setUser(data);
        } catch (err: unknown) {
            //ApiError
            setError((err as Error).message || "An unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Dashboard</h1>

            <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded shadow-md w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    Lookup User by Email
                </h2>
                <div className="mt-4">
                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                    <button
                        onClick={handleFetchUserByEmail}
                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all w-full"
                        disabled={loading}
                    >
                        {loading ? "Fetching..." : "Find User"}
                    </button>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {user && (
                    <div className="mt-4">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                            User Details
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>Username:</strong> {user.username}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>Email:</strong> {user.email}
                        </p>
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