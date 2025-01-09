"use client";

import React from "react";
import {FileDto, SharedFileWithGroupDto, SharedFileWithUserDto} from "@/types/api/file";
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
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ComboboxGroup} from "@/components/ComboboxGroup";

interface StopSharingFormInputs {
    userId?: string;
    groupId?: string;
    shareWith: "user" | "group";
}

interface StopSharingDialogProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    file: FileDto;
    sharedUsers: SharedFileWithUserDto[];
    sharedGroups: SharedFileWithGroupDto[];
    refreshFiles: () => void;
}

const schema = yup.object().shape({
    shareWith: yup
        .string()
        .oneOf(["user", "group"], "You must select whether to stop sharing with a user or group.")
        .required("Selection is required."),
    userId: yup.string().when("shareWith", {
        is: "user",
        then: (schema) => schema.required("User is required."),
        otherwise: (schema) => schema.notRequired(),
    }),
    groupId: yup.string().when("shareWith", {
        is: "group",
        then: (schema) => schema.required("Group is required."),
        otherwise: (schema) => schema.notRequired(),
    }),
});

const StopSharingDialog: React.FC<StopSharingDialogProps> = ({
                                                                 isOpen,
                                                                 setOpen,
                                                                 file,
                                                                 sharedUsers,
                                                                 sharedGroups,
                                                                 refreshFiles,
                                                             }) => {
    const stopSharingForm = useForm<StopSharingFormInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            shareWith: "user",
            userId: "",
            groupId: "",
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

    const {handleStopSharingWithUser, handleStopSharingWithGroup} = useFiles();

    const onSubmit: SubmitHandler<StopSharingFormInputs> = async (data) => {
        if (data.shareWith === "user" && data.userId) {
            await handleStopSharingWithUser(data.userId, file.id);
        } else if (data.shareWith === "group" && data.groupId) {
            await handleStopSharingWithGroup(data.groupId, file.id);
        }

        refreshFiles();
        reset();
        setOpen(false);
    };

    const users = sharedUsers.map((sharedUser) => ({
        value: sharedUser.sharedWith.id,
        label: sharedUser.sharedWith.username,
    }));

    const groups = sharedGroups.map((sharedGroup) => ({
        value: sharedGroup.group.id,
        label: sharedGroup.group.name, // Assuming you have a `name` property for the group
    }));

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Stop Sharing File</DialogTitle>
                    <DialogDescription>
                        Select the user or group you want to stop sharing{" "}
                        <strong>{file.filename}</strong> with.
                    </DialogDescription>
                </DialogHeader>
                <Form {...stopSharingForm}>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        <Tabs
                            value={watch("shareWith")}
                            onValueChange={(value) => setValue("shareWith", value as "user" | "group")}
                        >
                            <TabsList className="grid grid-cols-2">
                                <TabsTrigger value="user">User</TabsTrigger>
                                <TabsTrigger value="group">Group</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {watch("shareWith") === "user" && (
                            <FormField
                                control={control}
                                name="userId"
                                render={() => (
                                    <FormItem>
                                        <Label htmlFor="user" className="mr-8">User</Label>
                                        <FormControl>
                                            <ComboboxUser
                                                value={watch("userId") ?? ""}
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
                        )}

                        {watch("shareWith") === "group" && (
                            <FormField
                                control={control}
                                name="groupId"
                                render={() => (
                                    <FormItem>
                                        <Label htmlFor="group" className="mr-8">Group</Label>
                                        <FormControl>
                                            <ComboboxGroup
                                                value={watch("groupId") ?? ""}
                                                onChange={(value) => setValue("groupId", value)}
                                                users={groups}
                                            />
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
