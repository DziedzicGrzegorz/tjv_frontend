import {apiFetch} from "@/api/client";
import {API_ENDPOINTS} from "@/api/endpoints";
import {FileDto} from "@/types/api/file";
import Cookies from "js-cookie";

/**
 * Retrieves a file by its ID.
 * @param fileId - The ID of the file to retrieve.
 * @returns A Promise resolving to the FileDto or null if not found.
 */
export async function getFileById(fileId: string): Promise<FileDto | null> {
    const response = await apiFetch<FileDto>(API_ENDPOINTS.files.byId(fileId));
    if (response === null) {
        // Handle the null case explicitly
        console.warn(`No file found with ID: ${fileId}`);
    }
    return response; // Can return either FileDto or null
}

/**
 * Uploads a file to the backend.
 * @param file - The file to upload.
 * @returns A Promise resolving to the uploaded FileDto or null.
 */
export async function uploadFile(file: File): Promise<FileDto | null> {
    const formData = new FormData();
    formData.append("file", file);

    return apiUploadFetch<FileDto>(API_ENDPOINTS.files.uploadFile, {
        method: "POST",
        body: formData,
    });
}

export async function editFile(file: File, id: string): Promise<FileDto | null> {
    const formData = new FormData();
    formData.append("updatedFile", file);

    return apiUploadFetch<FileDto>(API_ENDPOINTS.files.editFile(id), {
        method: "PUT",
        body: formData,
    });
}

export async function apiUploadFetch<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const accessToken = Cookies.get("accessToken");

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken || ""}`,
            // Do not set 'Content-Type' header for multipart/form-data; the browser sets it automatically
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        let error: any;
        try {
            error = await response.json();
        } catch {
            error = {message: "API Error"};
        }

        // Check if the access token is expired
        if (error.message === "Access token expired") {
            // Refresh tokens
            const refreshToken = Cookies.get("refreshToken");

            if (!refreshToken) {
                throw new Error("Unauthorized: No refresh token available");
            }

            try {
                // Attempt to refresh the tokens
                const refreshResponse = await fetch(API_ENDPOINTS.auth.refresh, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({refreshToken}),
                });

                if (!refreshResponse.ok) {
                    throw new Error("Unable to refresh tokens");
                }

                const {accessToken: newAccessToken, refreshToken: newRefreshToken} =
                    await refreshResponse.json();

                // Update cookies with the new tokens
                Cookies.set("accessToken", newAccessToken, {path: "/", secure: true, sameSite: "strict"});
                Cookies.set("refreshToken", newRefreshToken, {path: "/", secure: true, sameSite: "strict"});

                // Retry the original request with the new access token
                const retryResponse = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${newAccessToken}`,
                        ...options?.headers,
                    },
                    ...options,
                });

                if (!retryResponse.ok) {
                    const retryError = await retryResponse.json();
                    throw new Error(retryError.message || "API Error on retry");
                }

                return await retryResponse.json();
            } catch (refreshError) {
                // Handle refresh token failure
                console.error("Refresh token error:", refreshError);
                throw new Error("Session expired. Please log in again.");
            }
        }

        throw new Error(error.message || "API Error");
    }

    return response.status === 204 ? null : response.json();
}