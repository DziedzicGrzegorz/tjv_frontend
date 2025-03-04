const BASE_URL = "http://localhost:8080/api/v1"; // Replace with your environment variable if needed

export const API_ENDPOINTS = {
    users: {
        byId: (id: string) => `${BASE_URL}/users/${id}`,
        byEmail: (email: string) => `${BASE_URL}/users/email/${email}`,
        password: (id: string) => `${BASE_URL}/users/${id}/password`,
        email: (id: string) => `${BASE_URL}/users/${id}/email`,
        current: `${BASE_URL}/users/me`,
    },
    groups: {
        root: `${BASE_URL}/groups`,
        create: `${BASE_URL}/groups`,
        byCurrentUser: () => `${BASE_URL}/groups/user`,
        byId: (id: string) => `${BASE_URL}/groups/${id}`,
        addUsers: (id: string) => `${BASE_URL}/groups/${id}/add-users`,
        removeUsers: (id: string) => `${BASE_URL}/groups/${id}/remove-users`,
    },
    files: {
        root: `${BASE_URL}/files`,
        uploadFile: `${BASE_URL}/files`,
        editFile: (id: string) => `${BASE_URL}/files/${id}`,
        byId: (id: string) => `${BASE_URL}/files/${id}`,
        userFiles: () => `${BASE_URL}/files/user`,
        notShared: (userId: string) => `${BASE_URL}/files/user/${userId}/not-shared`,
        allFiles: (userId: string) => `${BASE_URL}/files/all/${userId}`,
        download: (fileId: string) => `${BASE_URL}/files/download/${fileId}`,
        delete: (fileId: string) => `${BASE_URL}/files/${fileId}`,
        update: (fileId: string) => `${BASE_URL}/files/${fileId}`,
    },
    sharedFiles: {
        user: `${BASE_URL}/shared-files/user`,
        group: `${BASE_URL}/shared-files/group`,
        userById: `${BASE_URL}/shared-files/user`,
        groupById: `${BASE_URL}/shared-files/group`,
        unshareUser: (userId: string, fileId: string) =>
            `${BASE_URL}/shared-files/user/${userId}/file/${fileId}`,
        unshareGroup: (groupId: string, fileId: string) =>
            `${BASE_URL}/shared-files/group/${groupId}/file/${fileId}`,
        sharedByMeWithUsers: () => "/shared-files/user/shared-by-me",
        sharedByMeWithGroups: () => "/shared-files/group/shared-by-me",
        deleteSharedWithUser: (userId: string, fileId: string) => `/shared-files/user/${userId}/file/${fileId}`,
        deleteSharedWithGroup: (groupId: string, fileId: string) => `/shared-files/group/${groupId}/file/${fileId}`,
        getSharedFileWithUsers: (fileId: string) => `${BASE_URL}/shared-files/file/${fileId}/users`,
        getSharedFileWithGroups: (fileId: string) => `${BASE_URL}/shared-files/file/${fileId}/groups`,
    },
    auth: {
        login: `${BASE_URL}/auth/authenticate`,
        register: `${BASE_URL}/auth/register`,
        refresh: `${BASE_URL}/auth/refresh`,
    },
    actuator: {
        root: `${BASE_URL}/actuator`,
        health: `${BASE_URL}/actuator/health`,
    },
};