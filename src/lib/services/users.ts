
'use client';
import type { UserWithId, UserProfile, ServiceResponse } from '../types';
import { api } from '@/lib/api';

export async function getAllUsers(): Promise<ServiceResponse<UserWithId[]>> {
    return api.get<UserWithId[]>('/users');
}

export async function getUserById(userId: string): Promise<ServiceResponse<UserWithId | undefined>> {
    return api.get<UserWithId>(`/users/${userId}`);
}

export async function updateUserRole(
    userId: string,
    role: UserProfile['role']
): Promise<ServiceResponse<void>> {
    return api.patch<void>(`/users/${userId}/role`, { role });
}
