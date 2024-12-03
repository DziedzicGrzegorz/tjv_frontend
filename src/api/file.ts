import {apiFetch} from "@/api/client";
import {API_ENDPOINTS} from "@/api/endpoints";
import {FileDto} from "@/types/api/file";

export async function getFileById(fileId: string): Promise<FileDto> {
    return apiFetch<FileDto>(API_ENDPOINTS.files.byId(fileId));
}

export async function getUserFiles(userId: string): Promise<FileDto[]> {
    return apiFetch<FileDto[]>(API_ENDPOINTS.files.userFiles(userId));
}

export async function uploadFile(userId: string, file: File): Promise<FileDto> {
    const formData = new FormData();
    formData.append("file", file);

    return apiFetch<FileDto>(`${API_ENDPOINTS.files.root}?ownerId=${userId}`, {
        method: "POST",
        body: formData,
    });
}