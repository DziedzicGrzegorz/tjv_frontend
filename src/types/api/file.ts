// FileDto represents a file in the system.
import {UserShortDto} from "@/types/api/user";
import {ShortGroupDto} from "@/types/api/group";

export interface FileDto {
    id: string; // uuid
    owner: UserShortDto;
    filename: string;
    fileType: string;
    size: number; // int64
    version: number; // int32
    createdAt: string; // date-time
    updatedAt: string; // date-time
}

// FileSharingWithUserRequest represents the data needed to share a file with a user.
export interface FileSharingWithUserRequest {
    fileId: string; // uuid
    userId: string; // uuid
    permission: 'READ' | 'WRITE';
}

// SharedFileWithUserDto represents a file that has been shared with a user.
export interface SharedFileWithUserDto {
    id: string; // uuid
    file: FileDto;
    sharedWith: UserShortDto;
    permission: string;
    sharedAt: string; // date-time
}

// FileSharingWithGroupRequest represents the data needed to share a file with a group.
export interface FileSharingWithGroupRequest {
    fileId: string; // uuid
    groupId: string; // uuid
    permission: 'READ' | 'WRITE';
    group: ShortGroupDto;
    sharedAt: string; // date-time
}

// SharedFileWithGroupDto represents a file that has been shared with a group.
export interface SharedFileWithGroupDto {
    id: string; // uuid
    file: FileDto;
    permission: string;
    sharedAt: string; // date-time
}