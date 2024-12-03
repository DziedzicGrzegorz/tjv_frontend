"use client";

import React from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/inputs";
import {BackgroundBeamsWithCollision} from "@/components/ui/background-beams-with-collision";
import {ToastAction} from "@/components/ui/toast";
import {useToast} from "@/hooks/use-toast";
import {API_ENDPOINTS} from "@/api/endpoints";
import {AuthenticationResponse} from "@/types/api/auth";
import {useAuth} from "@/contenxt/AuthContext";

// Validation schema
const schema = yup.object().shape({
    username: yup.string().min(7, "Username must be at least 7 characters").required("Username is required"),
    password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
});

function LoginForm() {
    const {toast} = useToast();
    const {login} = useAuth();

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: { username: string; password: string }) => {
        try {
            const response = await fetch(API_ENDPOINTS.auth.login, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error("Invalid credentials");

            const responseData: AuthenticationResponse = await response.json();
            login(responseData.accessToken, responseData.refreshToken);

            toast({
                title: "Login successful",
                description: "Welcome back!",
                variant: "default",
            });
        } catch (error) {
            console.error("Login error:", error);
            toast({
                variant: "destructive",
                title: "Login failed",
                description: "Please check your username and password.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            });
        }
    };

    return (
        <BackgroundBeamsWithCollision>
            <div className="flex items-center justify-center h-screen">
                <div
                    className="max-w-3xl w-full mx-auto p-10 md:p-16 bg-white dark:bg-black shadow-lg rounded-lg relative z-20">
                    <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
                        Login to Your Account
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-6">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="your_username"
                                {...register("username")}
                                className={`text-lg py-4 px-6 ${errors.username ? "border-red-500" : ""}`}
                            />
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                            )}
                        </div>
                        <div className="mb-8">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register("password")}
                                className={`text-lg py-4 px-6 ${errors.password ? "border-red-500" : ""}`}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>
                        <button
                            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                            type="submit"
                        >
                            Login &rarr;
                            <BottomGradient/>
                        </button>
                    </form>
                </div>
            </div>
        </BackgroundBeamsWithCollision>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span
                className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"/>
            <span
                className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"/>
        </>
    );
};

export default LoginForm;