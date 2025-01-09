import Cookies from "js-cookie";
import {API_ENDPOINTS} from "@/api/endpoints";

export async function apiDownloadFetch(
    url: string,
    options?: RequestInit
): Promise<Blob> {
    const accessToken = Cookies.get("accessToken");

    let response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken || ""}`,
            ...(options?.headers || {}),
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

        if (error.message === "Access token expired") {
            const refreshToken = Cookies.get("refreshToken");

            if (!refreshToken) {
                throw new Error("Unauthorized: No refresh token available");
            }

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

            Cookies.set("accessToken", newAccessToken, {path: "/", secure: true, sameSite: "strict"});
            Cookies.set("refreshToken", newRefreshToken, {path: "/", secure: true, sameSite: "strict"});

            response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${newAccessToken}`,
                    ...(options?.headers || {}),
                },
                ...options,
            });

            if (!response.ok) {
                const retryError = await response.json();
                throw new Error(retryError.message || "API Error on retry");
            }
        } else {
            throw new Error(error.message || "API Error");
        }
    }

    return await response.blob();
}