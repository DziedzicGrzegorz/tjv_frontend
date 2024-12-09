// src/components/ui/ShareFileDialog.tsx
"use client";

import React from "react";
import {FileDto} from "@/types/api/file";
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
import useUser from "@/hooks/useUser";

interface ShareFileFormInputs {
    email: string;
    permission: "READ" | "WRITE";
}

interface ShareFileDialogProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    file: FileDto;
    onShare: (fileId: string, userId: string, permission: "READ" | "WRITE") => void;
}

// Walidacja dla obu pól: email i permission
const schema = yup.object().shape({
    email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
    permission: yup
        .mixed<"READ" | "WRITE">()
        .oneOf(["READ", "WRITE"], "Permission must be READ or WRITE")
        .required("Permission is required"),
});

const ShareFileDialog: React.FC<ShareFileDialogProps> = ({
                                                             isOpen,
                                                             setOpen,
                                                             file,
                                                             onShare,
                                                         }) => {
    const {fetchUserByEmail} = useUser();

    // Inicjalizacja formularza z walidacją
    const emailForm = useForm<ShareFileFormInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            email: "",
            permission: "READ",
        },
    });
    const {
        control,
        handleSubmit,
        formState: {errors, isSubmitting},
        reset,
    } = emailForm

    const onSubmit: SubmitHandler<ShareFileFormInputs> = async (data) => {
        try {
            // Pobierz użytkownika na podstawie e-maila
            const fetchedUser = await fetchUserByEmail(data.email);

            if (!fetchedUser) {
                throw new Error("User not found.");
            }
            console.log(fetchedUser);

            // Wywołaj funkcję onShare z odpowiednimi parametrami
            onShare(file.id, fetchedUser.id, data.permission);

            // Reset formularza i zamknij dialog
            reset();
            setOpen(false);

            toast({
                title: "Success",
                description: `File has been successfully shared with ${data.email}.`,
                variant: "default",
            });
        } catch (error: any) {
            console.error("Failed to share file:", error);
            toast({
                title: "Error",
                description:
                    error?.message || "Failed to share the file. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Share File</DialogTitle>
                    <DialogDescription>
                        Enter the email of the user you want to share <strong>{file.filename}</strong> with.
                    </DialogDescription>
                </DialogHeader>
                <Form {...emailForm}>
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
                                            placeholder="Enter email address"
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
                                                    {/*<SelectItem value="WRITE">Write</SelectItem>*/}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    {errors.permission && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {errors.permission.message}
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