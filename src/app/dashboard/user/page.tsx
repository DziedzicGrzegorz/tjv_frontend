"use client";

import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";

import {API_ENDPOINTS} from "@/api/endpoints";
import {apiFetch} from "@/api/client";
import {ChangePasswordRequest, UpdateEmailRequest, UserDto} from "@/types/api/user";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import {useToast} from "@/hooks/use-toast";

const Page = () => {
    const {toast} = useToast();

    const [user, setUser] = useState<UserDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [isEmailDialogOpen, setEmailDialogOpen] = useState(false);
    const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const fetchCurrentUser = async () => {
        setLoading(true);
        try {
            const data = await apiFetch<UserDto>(API_ENDPOINTS.users.current);
            setUser(data);
        } catch (err: unknown) {
            toast({
                title: "Error",
                description: (err as Error).message || "Failed to load user data.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const emailSchema = yup.object().shape({
        email: yup
            .string()
            .email("Invalid email address")
            .required("Email is required"),
    });

    const emailForm = useForm<UpdateEmailRequest>({
        resolver: yupResolver(emailSchema),
        defaultValues: {
            email: "",
        },
    });

    const updateEmail = async (data: UpdateEmailRequest) => {
        try {
            if (!user) return;
            await apiFetch(API_ENDPOINTS.users.email(user.id), {
                method: "PUT",
                body: JSON.stringify(data),
            });
            toast({
                title: "Email Updated",
                description: "Your email has been updated successfully.",
                variant: "default",
            });
            setUser({...user, email: data.email});
            setEmailDialogOpen(false);
            emailForm.reset();
        } catch (err: unknown) {
            toast({
                title: "Error",
                description: (err as Error).message || "Failed to update email.",
                variant: "destructive",
            });
        }
    };

    const passwordSchema = yup.object().shape({
        password: yup
            .string()
            .min(8, "Password must be at least 8 characters")
            .required("New password is required"),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password")], "Passwords must match")
            .required("Please confirm your password"),
    });

    const passwordForm = useForm<ChangePasswordRequest & {
        confirmPassword: string
    }>({
        resolver: yupResolver(passwordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const updatePassword = async (data: ChangePasswordRequest) => {
        try {
            if (!user) return;
            const requestBody: ChangePasswordRequest = {password: data.password};
            await apiFetch(API_ENDPOINTS.users.password(user.id), {
                method: "PUT",
                body: JSON.stringify(requestBody),
            });
            toast({
                title: "Password Updated",
                description: "Your password has been updated successfully.",
                variant: "default",
            });
            passwordForm.reset();
            setPasswordDialogOpen(false);
        } catch (err: unknown) {
            toast({
                title: "Error",
                description: (err as Error).message || "Failed to update password.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex flex-col items-center pt-20 xl:pt-40 min-h-screen bg-gray-100 dark:bg-background">
            {loading && <p className="text-gray-700 dark:text-gray-300">Loading...</p>}
            {user && (
                <>
                    <Card className="w-full max-w-xl bg-white dark:bg-card text-foreground shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg">User Profile</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                <strong>ID:</strong> {user.id}
                            </p>
                            <p>
                                <strong>Username:</strong> {user.username}
                            </p>
                            <p>
                                <strong>Email:</strong> {user.email}
                            </p>
                        </CardContent>
                    </Card>

                    <div className="mt-6 space-x-4">
                        <Dialog
                            open={isEmailDialogOpen}
                            onOpenChange={(open) => {
                                setEmailDialogOpen(open);
                                if (!open) emailForm.reset();
                            }}
                        >
                            <DialogTrigger asChild>
                                <Button variant="outline">Edit Email</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Email</DialogTitle>
                                </DialogHeader>
                                <Form {...emailForm}>
                                    <form onSubmit={emailForm.handleSubmit(updateEmail)} className="grid gap-4 py-4">
                                        <FormField
                                            control={emailForm.control}
                                            name="email"
                                            render={({field}) => (
                                                <FormItem>
                                                    <Label htmlFor="email">Email</Label>
                                                    <FormControl>
                                                        <Input id="email"
                                                               className="text-black dark:text-white" {...field}
                                                               value={field.value || ""}/>
                                                    </FormControl>
                                                    {emailForm.formState.errors.email && (
                                                        <p className="text-red-500 text-sm mt-1">
                                                            {emailForm.formState.errors.email.message}
                                                        </p>
                                                    )}
                                                </FormItem>
                                            )}
                                        />
                                        <DialogFooter>
                                            <Button type="submit">Save</Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>

                        <Dialog
                            open={isPasswordDialogOpen}
                            onOpenChange={(open) => {
                                setPasswordDialogOpen(open);
                                if (!open) passwordForm.reset();
                            }}
                        >
                            <DialogTrigger asChild>
                                <Button variant="outline">Change Password</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Change Password</DialogTitle>
                                </DialogHeader>
                                <Form {...passwordForm}>
                                    <form onSubmit={passwordForm.handleSubmit(updatePassword)}
                                          className="grid gap-4 py-4">
                                        <FormField
                                            control={passwordForm.control}
                                            name="password"
                                            render={({field}) => (
                                                <FormItem>
                                                    <Label htmlFor="password">New Password</Label>
                                                    <FormControl>
                                                        <Input className="text-black dark:text-white"
                                                               id="password" type="password" {...field}
                                                               value={field.value || ""}/>
                                                    </FormControl>
                                                    {passwordForm.formState.errors.password && (
                                                        <p className="text-red-500 text-sm mt-1">
                                                            {passwordForm.formState.errors.password.message}
                                                        </p>
                                                    )}
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={passwordForm.control}
                                            name="confirmPassword"
                                            render={({field}) => (
                                                <FormItem>
                                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                                    <FormControl>
                                                        <Input className="text-black dark:text-white"
                                                               id="confirmPassword" type="password" {...field}
                                                               value={field.value || ""}/>
                                                    </FormControl>
                                                    {passwordForm.formState.errors.confirmPassword && (
                                                        <p className="text-red-500 text-sm mt-1">
                                                            {passwordForm.formState.errors.confirmPassword.message}
                                                        </p>
                                                    )}
                                                </FormItem>
                                            )}
                                        />
                                        <DialogFooter>
                                            <Button type="submit">Save</Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </>
            )}
        </div>
    );
};

export default Page;