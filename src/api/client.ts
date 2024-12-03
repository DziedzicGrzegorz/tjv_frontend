export async function apiFetch<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "API Error");
    }

    return response.json();
}