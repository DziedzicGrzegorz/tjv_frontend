"use client";

import React, {createContext, useContext, useState} from "react";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (accessToken: string, refreshToken?: string) => void;
    logout: () => void;
    token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{
    children: React.ReactNode
}> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    const login = (accessToken: string, refreshToken?: string) => {
        setIsAuthenticated(true);
        setToken(accessToken);
        Cookies.set("accessToken", accessToken, {path: "/", secure: true, sameSite: "strict"});
        if (refreshToken) {
            Cookies.set("refreshToken", refreshToken, {path: "/", secure: true, sameSite: "strict"});
        }
        router.push("/dashboard");
    };

    const logout = () => {
        setIsAuthenticated(false);
        setToken(null);
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        router.push("/"); // Redirect to home
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, login, logout, token}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};