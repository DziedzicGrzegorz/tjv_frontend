// GroupDto represents a group in the system.
import {SharedFileWithGroupDto} from "@/types/api/file";

export interface GroupDto {
    id: string; // uuid
    name: string;
    description?: string;
    userRoles?: UserGroupRoleShortDto[];
    sharedFiles?: SharedFileWithGroupDto[];
}

// ShortGroupDto represents a simplified group in the system.
export interface ShortGroupDto {
    id: string; // uuid
    name: string;
    description: string;
}

// CreateGroupRequest represents the data needed to create a new group.
export interface CreateGroupRequest {
    name: string; // maxLength: 100
    description?: string; // maxLength: 500
    ownerId: string; // uuid
    userRoles?: CreateUserGroupRoleDto[];
}

// CreateUserGroupRoleDto represents the role of a user in a group.
export interface CreateUserGroupRoleDto {
    id?: string; // uuid
    role?: 'MEMBER' | 'ADMIN' | 'FOUNDER';
}

// GroupUpdateRequest represents the data needed to update a group's details.
export interface GroupUpdateRequest {
    id: string; // uuid
    name: string; // maxLength: 100
    description?: string; // maxLength: 500
}

// UserGroupRoleDto represents a user's role in a group.
export interface UserGroupRoleDto {
    id: string; // uuid
    group: GroupDto;
    role: 'MEMBER' | 'ADMIN' | 'FOUNDER';
    joinedAt: string; // date-time
}

// UserGroupRoleShortDto represents a simplified user's role in a group.
export interface UserGroupRoleShortDto {
    id: string; // uuid
    role: 'MEMBER' | 'ADMIN' | 'FOUNDER';
    joinedAt: string; // date-time
}