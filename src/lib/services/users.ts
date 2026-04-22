
import type { UserWithId, UserProfile, ServiceResponse } from '../types';
import { mockUsers } from '@/lib/mock-data';

export async function getAllUsers(): Promise<ServiceResponse<UserWithId[]>> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return { success: true, data: mockUsers, error: null };
}

export async function getUserById(userId: string): Promise<ServiceResponse<UserWithId | undefined>> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
        return { success: true, data: user, error: null };
    }
    return { success: false, data: undefined, error: { message: 'User not found' } };
}

export async function updateUserRole(
    userId: string,
    role: UserProfile['role']
): Promise<ServiceResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        // In a real app, you would never allow setting 'super_admin' via an API like this.
        // This is purely for mock purposes.
        (mockUsers as UserWithId[])[userIndex].role = role;
        return { success: true, data: null, error: null };
    }
    return { success: false, data: null, error: { message: 'User not found' } };
}
