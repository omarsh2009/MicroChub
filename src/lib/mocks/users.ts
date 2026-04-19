'use client';
import { mockUsers } from './data';
import type { UserWithId, UserProfile, ServiceResponse } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getAllUsers(): Promise<ServiceResponse<UserWithId[]>> {
    await sleep(500);
    console.log("Mock API: Fetched all users");
    return { data: JSON.parse(JSON.stringify(mockUsers)), error: null, status: 200 };
}

export async function getUserById(userId: string): Promise<ServiceResponse<UserWithId | undefined>> {
    await sleep(200);
    console.log(`Mock API: Fetched user ${userId}`);
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
        return { data: JSON.parse(JSON.stringify(user)), error: null, status: 200 };
    }
    return { data: null, error: 'User not found.', status: 404 };
}

export async function updateUserRole(
    userId: string,
    role: UserProfile['role']
): Promise<ServiceResponse<void>> {
    await sleep(300);
    const user = mockUsers.find(u => u.id === userId);
    if(user) {
        user.role = role;
        return { data: null, error: null, status: 200 };
    }
    return { data: null, error: 'User not found.', status: 404 };
}
