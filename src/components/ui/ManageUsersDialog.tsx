"use client";

import React from "react";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import {Label} from "@/components/ui/label";
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {toast} from "@/hooks/use-toast";

interface ManageUsersFormInputs {
    email: string;
    role: "MEMBER" | "ADMIN";
}

interface ManageUsersDialogProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    groupId: string;
    onAddUser: (userId: string, role: "MEMBER" | "ADMIN") => void;
}

const schema = yup.object().shape({
    email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
    role: yup
        .mixed<"MEMBER" | "ADMIN">()
        .oneOf(["MEMBER", "ADMIN"], "Role must be MEMBER or ADMIN")
        .required("Role is required"),
});

const ManageUsersDialog: React.FC<ManageUsersDialogProps> = ({
                                                                 isOpen,
                                                                 setOpen,
                                                                 onAddUser,
                                                             }) => {

    const form = useForm<ManageUsersFormInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            email: "",
            role: "MEMBER",
        },
    });

    const {
        control,
        handleSubmit,
        formState: {errors, isSubmitting},
        reset,
    } = form;

    const onSubmit: SubmitHandler<ManageUsersFormInputs> = async (data) => {
        try {
            onAddUser(data.email, data.role);
            reset();
            setOpen(false);

            toast({
                title: "Success",
                description: `User has been successfully added as ${data.role}.`,
                variant: "default",
            });
        } catch (error: any) {
            console.error("Failed to add user:", error);
            toast({
                title: "Error",
                description:
                    error?.message || "Failed to add the user. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add User to Group</DialogTitle>
                    <DialogDescription>
                        Enter the email of the user you want to add to this group and assign their role.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        <FormField
                            control={control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <Label htmlFor="email">Email</Label>
                                    <FormControl>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter user email"
                                            {...field}
                                        />
                                    </FormControl>
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="role"
                            render={({field}) => (
                                <FormItem>
                                    <Label htmlFor="role">Role</Label>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={(value) => field.onChange(value as "MEMBER" | "ADMIN")}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select role"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Roles</SelectLabel>
                                                    <SelectItem value="MEMBER">Member</SelectItem>
                                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    {errors.role && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {errors.role.message}
                                        </p>
                                    )}
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => {
                                    reset();
                                    setOpen(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="default"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Adding..." : "Add User"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ManageUsersDialog;