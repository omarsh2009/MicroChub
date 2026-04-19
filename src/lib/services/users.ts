'use client';
import type { UserWithId, UserProfile, ServiceResponse } from '../types';

import {
    getAllUsers as mockGetAllUsers,
    getUserById as mockGetUserById,
    updateUserRole as mockUpdateUserRole,
} from '@/lib/mocks/users';

export async function getAllUsers(): Promise<ServiceResponse<UserWithId[]>> {
    return mockGetAllUsers();
}

export async function getUserById(userId: string): Promise<ServiceResponse<UserWithId | undefined>> {
    return mockGetUserById(userId);
}

export async function updateUserRole(
    userId: string,
    role: UserProfile['role']
): Promise<ServiceResponse<void>> {
    return mockUpdateUserRole(userId, role);
}
