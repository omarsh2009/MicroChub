'use client';
import { mockUsers } from './data';
import type { UserWithId, UserProfile } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getAllUsers(): Promise<UserWithId[]> {
    await sleep(500);
    console.log("Mock API: Fetched all users");
    return JSON.parse(JSON.stringify(mockUsers));
}

export async function getUserById(userId: string): Promise<UserWithId | undefined> {
    await sleep(200);
    console.log(`Mock API: Fetched user ${userId}`);
    const user = mockUsers.find(u => u.id === userId);
    return user ? JSON.parse(JSON.stringify(user)) : undefined;
}


export async function updateUserRole(
    userId: string,
    role: UserProfile['role']
): Promise<void> {
    await sleep(300);
    const user = mockUsers.find(u => u.id === userId);
    if(user) {
        user.role = role;
    }
    console.log(`Mock API: Updated user ${userId} role to ${role}`);
}
