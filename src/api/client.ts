import Cookies from "js-cookie";
import {API_ENDPOINTS} from "@/api/endpoints";

export async function apiFetch<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const accessToken = Cookies.get("accessToken");

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken || ""}`,
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const error = await response.json();

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
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${newAccessToken}`,
                        ...options?.headers,
                    },
                    ...options,
                });

                if (!retryResponse.ok) {
                    console.error("retryResponse", retryResponse);
                    throw new Error("Retry failed after refreshing token");
                }

                return retryResponse.json();
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