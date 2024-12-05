// src/components/auth/RegisterForm.tsx

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
import {useRouter} from "next/navigation";
import {UserCreateRequest} from "@/types/api/auth";

// Validation schema
const schema = yup.object().shape({
    username: yup
        .string()
        .min(3, "Username must be at least 3 characters")
        .required("Username is required"),
    email: yup.string().email("Invalid email address").required("Email is required"),
    password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
});
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function RegisterForm() {
    const {toast} = useToast();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<UserCreateRequest>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: UserCreateRequest) => {
        try {
            const response = await fetch(API_ENDPOINTS.auth.register, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                // Extract error message from response
                const errorData = await response.json();
                throw new Error(errorData.message || "Registration failed");
            }


            toast({
                variant: "default",
                title: "Registration Successful!",
                description: "Your account has been created.",
            });
            await delay(750);
            // Optionally, redirect to the login page after successful registration
            router.push("/login");
        } catch (error: any) {
            console.error("Registration error:", error);
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: error.message || "Please try again.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            });
        }
    };

    return (
        <BackgroundBeamsWithCollision>
            <div className="flex items-center justify-center min-h-screen">
                <div
                    className="max-w-md w-full mx-auto p-8 md:p-16 bg-white dark:bg-black shadow-lg rounded-lg relative z-20"
                >
                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
                        Create Your Account
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="mb-8">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="your_username"
                                {...register("username")}
                                className={`text-sm py-4 px-6 ${
                                    errors.username ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                disabled={isSubmitting}
                            />
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                            )}
                        </div>
                        <div className="mb-6">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                {...register("email")}
                                className={`text-sm py-4 px-6 ${
                                    errors.email ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                disabled={isSubmitting}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="mb-8">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register("password")}
                                className={`text-sm py-4 px-6 ${
                                    errors.password ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                disabled={isSubmitting}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>
                        <button
                            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                            type="submit"
                        >
                            Register &rarr;
                            <BottomGradient/>
                        </button>
                    </form>
                    <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="text-blue-500 hover:underline dark:text-blue-400"
                        >
                            Log in here
                        </a>
                    </p>
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


export default RegisterForm;