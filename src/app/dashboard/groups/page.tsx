// src/pages/groups/page.tsx

"use client";

import React, {useState} from "react";
import {HoverEffect} from "@/components/ui/card-hover-effect";
import {Button} from "@/components/ui/button";
import {useGroups} from "@/hooks/useGroups";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useCurrentUser} from "@/hooks/useUser";
import {CreateGroupRequest} from "@/types/api/group";

const GroupsPage = () => {
    const {ownedGroups, joinedGroups, loading, error, fetchGroups, addGroup} = useGroups();
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
    const {currentUser, loading: userLoading, error: userError} = useCurrentUser();

    // Schema walidacji formularza
    const schema = yup.object().shape({
        name: yup.string().required("Group name is required").max(100, "Maximum 100 characters"),
        description: yup.string().max(500, "Maximum 500 characters").optional(),
    });

    const form = useForm<Omit<CreateGroupRequest, 'ownerId' | 'userRoles'>>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const handleSubmit = async (data: Omit<CreateGroupRequest, 'ownerId' | 'userRoles'>) => {
        try {
            if (!currentUser) {
                throw new Error("User is not authenticated.");
            }

            const createGroupRequest: CreateGroupRequest = {
                ...data,
                ownerId: currentUser.id,
            };
            await addGroup(createGroupRequest);
            form.reset();
            setDialogOpen(false);
        } catch (err) {
            // Błąd jest już obsługiwany w hooku
            console.error(err);
        }
    };

    const prepareItems = (groups: typeof ownedGroups) => groups.map(group => ({
        title: group.name,
        description: group.description || "No description",
        link: `groups/${group.id}`,
    }));

    const ownedItems = prepareItems(ownedGroups);
    const joinedItems = prepareItems(joinedGroups);

    return (
        <div className="relative w-full min-h-full p-5 bg-background">
            <div className="flex items-center justify-start mb-5">
                {/* Trigger do otwierania dialogu */}
                <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Add Group
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Group</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <Label htmlFor="name">Group Name</Label>
                                            <FormControl>
                                                <Input id="name" placeholder="Enter group name" {...field} />
                                            </FormControl>
                                            {form.formState.errors.name && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {form.formState.errors.name.message}
                                                </p>
                                            )}
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({field}) => (
                                        <FormItem>
                                            <Label htmlFor="description">Description</Label>
                                            <FormControl>
                                                <Input id="description"
                                                       placeholder="Enter group description" {...field} />
                                            </FormControl>
                                            {form.formState.errors.description && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {form.formState.errors.description.message}
                                                </p>
                                            )}
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                                        Create
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setDialogOpen(false)}
                                        className="ml-2"
                                    >
                                        Cancel
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading || userLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-gray-700 dark:text-gray-300">Loading groups...</p>
                </div>
            ) : error || userError ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-red-600">{error || userError}</p>
                    <Button onClick={fetchGroups} className="mt-4">
                        Retry
                    </Button>
                </div>
            ) : (
                <div>
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Owned Groups</h2>
                        {ownedItems.length > 0 ? (
                            <HoverEffect items={ownedItems}/>
                        ) : (
                            <p className="text-gray-700 dark:text-gray-300">You do not own any groups.</p>
                        )}
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Joined Groups</h2>
                        {joinedItems.length > 0 ? (
                            <HoverEffect items={joinedItems}/>
                        ) : (
                            <p className="text-gray-700 dark:text-gray-300">You have not joined any groups.</p>
                        )}
                    </section>
                </div>
            )}
        </div>
    );

};

export default GroupsPage;