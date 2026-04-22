
import type { SignUpFormValues } from '@/app/signup/page';
import type { ServiceResponse, UserWithId } from '../types';
import type { UserData } from '@/auth/use-user';
import { mockUsers } from '@/lib/mock-data';

// --- Mock Auth State ---
// This simple in-memory variable simulates the current logged-in user's ID.
// It defaults to the super_admin for easy development access.
let currentUserId: string | null = 'user-super-admin'; 

function findUserById(id: string | null): UserWithId | undefined {
    if (!id) return undefined;
    return mockUsers.find(u => u.id === id);
}

function toUserData(user: UserWithId): UserData {
    return {
        uid: user.id,
        displayName: user.name,
        email: user.email,
        profile: user,
    };
}
// --- End Mock Auth State ---


export async function signUpWithEmail(values: SignUpFormValues): Promise<ServiceResponse<UserData>> {
    const existingUser = mockUsers.find(u => u.email === values.email);
    if (existingUser) {
        return { success: false, data: null, error: { message: "An account with this email already exists." } };
    }
    
    const newUser: UserWithId = {
        id: `user_${Math.random().toString(36).substring(2, 9)}`,
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        role: 'user',
        wishlist: [],
    };
    mockUsers.push(newUser);
    currentUserId = newUser.id;
    return { success: true, data: toUserData(newUser), error: null };
}

export async function signInWithEmail(values: { email: string; password: string }): Promise<ServiceResponse<UserData>> {
    const user = mockUsers.find(u => u.email === values.email);
    if (!user) {
        return { success: false, data: null, error: { message: "Invalid credentials" }};
    }
    currentUserId = user.id;
    return { success: true, data: toUserData(user), error: null };
}

export async function signOut(): Promise<ServiceResponse<null>> {
    currentUserId = null;
    return { success: true, data: null, error: null };
}

export async function getMe(): Promise<ServiceResponse<UserData>> {
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate network delay

    // If there is no current user ID (e.g., after logout or on a new device session),
    // default to the super admin. This ensures the app is never in a fully "anonymous"
    // state, which prevents infrastructure-level permission errors.
    if (!currentUserId) {
        currentUserId = 'user-super-admin';
    }

    const user = findUserById(currentUserId);
    if (!user) {
        // Fallback in case the ID is somehow invalid, just return the first user.
        const fallbackUser = mockUsers[0];
        if (!fallbackUser) {
             return { success: false, data: null, error: { message: "No mock users available." }};
        }
        currentUserId = fallbackUser.id;
        return { success: true, data: toUserData(fallbackUser), error: null };
    }
    return { success: true, data: toUserData(user), error: null };
}
