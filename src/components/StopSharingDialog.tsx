// src/components/ui/StopSharingDialog.tsx
"use client";

import React from "react";
import {FileDto, SharedFileWithUserDto} from "@/types/api/file";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import {Label} from "@/components/ui/label";
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import useFiles from "@/hooks/useFiles";
import {ComboboxUser} from "@/components/ComboboxUser";

interface StopSharingFormInputs {
    userId: string;
}

interface StopSharingDialogProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    file: FileDto;
    sharedUsers: SharedFileWithUserDto[];
    refreshFiles: () => void;
}

const schema = yup.object().shape({
    userId: yup.string().required("User is required"),
});

const StopSharingDialog: React.FC<StopSharingDialogProps> = ({
                                                                 isOpen,
                                                                 setOpen,
                                                                 file,
                                                                 sharedUsers,
                                                                 refreshFiles,
                                                             }) => {
    const stopSharingForm = useForm<StopSharingFormInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            userId: "",
        },
    });
    const {
        handleSubmit,
        control,
        setValue,
        watch,
        formState: {errors, isSubmitting},
        reset,
    } = stopSharingForm;
    const {handleStopSharingWithUser} = useFiles();

    const onSubmit: SubmitHandler<StopSharingFormInputs> = async (data) => {
        await handleStopSharingWithUser(data.userId, file.id);
        refreshFiles();
        reset();
        setOpen(false);
    };

    const users = sharedUsers.map((sharedUser) => ({
        value: sharedUser.sharedWith.id,
        label: sharedUser.sharedWith.username,
    }));

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Stop Sharing File</DialogTitle>
                    <DialogDescription>
                        Select the user you want to stop sharing <strong>{file.filename}</strong> with.
                    </DialogDescription>
                </DialogHeader>
                <Form {...stopSharingForm}>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        <FormField
                            control={control}
                            name="userId"
                            render={() => (
                                <FormItem>
                                    <Label htmlFor="user">User</Label>
                                    <FormControl>
                                        <ComboboxUser
                                            value={watch("userId")}
                                            onChange={(value) => setValue("userId", value)}
                                            users={users}
                                        />
                                    </FormControl>
                                    {errors.userId && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.userId.message}
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
                            <Button variant="default" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Stopping..." : "Stop Sharing"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default StopSharingDialog;