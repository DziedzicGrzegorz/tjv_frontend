"use client";

import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import {useUser} from "@/hooks/useUser";
import {useGroups} from "@/hooks/useGroups";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Input} from "@/components/ui/input";
import {FileDto, FileSharingRequest} from "@/types/api/file";

interface ShareFileFormInputs {
    email?: string | null;
    groupId?: string | null;
    permission: "READ" | "WRITE";
    shareWith: "user" | "group";
}

interface ShareFileDialogProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    file: FileDto;
    onShare: (shareData: FileSharingRequest) => void;
}

const schema = yup.object({
    shareWith: yup
        .string()
        .oneOf(["user", "group"], "Sharing method must be either 'user' or 'group'.")
        .required("Sharing method is required."),
    email: yup
        .string()
        .email("Invalid email address")
        .nullable()
        .when("shareWith", {
            is: "user",
            then: (schema) => schema.required("Email is required when sharing with a user."),
            otherwise: (schema) => schema.notRequired(),
        }),
    groupId: yup
        .string()
        .nullable()
        .when("shareWith", {
            is: "group",
            then: (schema) => schema.required("Group is required when sharing with a group."),
            otherwise: (schema) => schema.notRequired(),
        }),
    permission: yup
        .mixed<"READ" | "WRITE">()
        .oneOf(["READ", "WRITE"], "Permission must be READ or WRITE.")
        .required("Permission is required."),
});

const ShareFileDialog: React.FC<ShareFileDialogProps> = ({
                                                             isOpen,
                                                             setOpen,
                                                             file,
                                                             onShare,
                                                         }) => {
    const {fetchUserByEmail} = useUser();
    const {ownedGroups, fetchGroups} = useGroups();
    const [shareWith, setShareWith] = useState<"user" | "group">("user");

    // Initialize form with validation
    const form = useForm<ShareFileFormInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            email: null,
            groupId: null,
            permission: "READ",
            shareWith: "user",
        },
    });

    const {
        control,
        handleSubmit,
        formState: {errors, isSubmitting},
        reset,
        watch,
    } = form;

    const onSubmit: SubmitHandler<ShareFileFormInputs> = async (data) => {
        try {
            let shareData: FileSharingRequest;
            const selectedShareWith = watch("shareWith");
            console.log({selectedShareWith});


            if (selectedShareWith === "user") {
                console.log("user");
                if (!data.email) {
                    throw new Error("Email is required.");
                }
                const fetchedUser = await fetchUserByEmail(data.email);
                if (!fetchedUser) {
                    throw new Error("User not found.");
                }
                shareData = {
                    fileId: file.id,
                    userId: fetchedUser.id,
                    permission: data.permission,
                };
            } else if (selectedShareWith === "group") {
                console.log("group");
                if (!data.groupId) {
                    throw new Error("Group is required.");
                }
                shareData = {
                    fileId: file.id,
                    groupId: data.groupId,
                    permission: data.permission,
                };
            } else {
                throw new Error("Invalid sharing method.");
            }


            onShare(shareData);
            reset();
            setOpen(false);

            toast({
                title: "Success",
                description: `File has been successfully shared.`,
                variant: "default",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to share the file. Please try again.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        if (shareWith === "group") {
            fetchGroups();
        }
    }, [shareWith, fetchGroups]);

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Share File</DialogTitle>
                    <DialogDescription>
                        Enter the email of the user or select a group you want to
                        share <strong>{file.filename}</strong> with.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        <Tabs
                            value={watch("shareWith")}
                            onValueChange={(value) => {
                                setShareWith(value as "user" | "group");
                                form.setValue("shareWith", value as "user" | "group");
                            }}
                        >
                            <TabsList className="grid grid-cols-2">
                                <TabsTrigger value="user">User</TabsTrigger>
                                <TabsTrigger value="group">Group</TabsTrigger>
                            </TabsList>
                        </Tabs>


                        {shareWith === "user" && (
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
                                                placeholder="Enter email address"
                                                value={field.value ?? ""}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                name={field.name}
                                                ref={field.ref}
                                            />
                                        </FormControl>
                                        {errors.email &&
                                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                                    </FormItem>
                                )}
                            />
                        )}

                        {shareWith === "group" && (
                            <FormField
                                control={control}
                                name="groupId"
                                render={({field}) => (
                                    <FormItem>
                                        <Label htmlFor="group">Select Group</Label>
                                        <FormControl>
                                            <Select
                                                value={field.value ?? "no-groups"}
                                                onValueChange={(value) => {
                                                    if (value !== "no-groups") {
                                                        field.onChange(value);
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a group"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Groups</SelectLabel>
                                                        {ownedGroups.length > 0 ? (
                                                            ownedGroups.map((group) => (
                                                                <SelectItem key={group.id} value={group.id}>
                                                                    {group.name}
                                                                </SelectItem>
                                                            ))
                                                        ) : (
                                                            <SelectItem value="no-groups" disabled>
                                                                No groups available
                                                            </SelectItem>
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        {errors.groupId && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.groupId.message}
                                            </p>
                                        )}
                                    </FormItem>
                                )}
                            />
                        )}


                        <FormField
                            control={control}
                            name="permission"
                            render={({field}) => (
                                <FormItem>
                                    <Label>Permission</Label>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={(value) => field.onChange(value as "READ" | "WRITE")}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select permission"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Permissions</SelectLabel>
                                                    <SelectItem value="READ">Read</SelectItem>
                                                    <SelectItem value="WRITE">Write</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    {errors.permission &&
                                        <p className="text-red-600 text-sm mt-1">{errors.permission.message}</p>}
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
                            <Button variant="default" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Sharing..." : "Share"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ShareFileDialog;
