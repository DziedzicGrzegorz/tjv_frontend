// UserDto represents a user in the system.
import {UserGroupRoleDto} from "@/types/api/group";
import {SharedFileWithUserDto} from "@/types/api/file";

export interface UserDto {
    id: string; // uuid
    username: string;
    email: string;
    roles?: ('USER' | 'ADMIN')[];
    groupRoles?: UserGroupRoleDto[];
    sharedFiles?: SharedFileWithUserDto[];
}

// UserShortDto represents a simplified version of a user.
export interface UserShortDto {
    id: string; // uuid
    username: string;
    email: string;
}

// ChangePasswordRequest represents the data needed to update a user's password.
export interface ChangePasswordRequest {
    password: string; // minLength: 8, maxLength: 100
}

// UpdateEmailRequest represents the data needed to update a user's email.
export interface UpdateEmailRequest {
    email: string;
}