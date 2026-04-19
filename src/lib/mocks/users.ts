
'use client';
import type { UserWithId, UserProfile, ServiceResponse } from '../types';

export async function getAllUsers(): Promise<ServiceResponse<UserWithId[]>> {
    throw new Error('API not implemented: getAllUsers');
}

export async function getUserById(userId: string): Promise<ServiceResponse<UserWithId | undefined>> {
    throw new Error('API not implemented: getUserById');
}

export async function updateUserRole(
    userId: string,
    role: UserProfile['role']
): Promise<ServiceResponse<void>> {
    throw new Error('API not implemented: updateUserRole');
}
