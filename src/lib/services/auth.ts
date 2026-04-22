
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
    if (!currentUserId) {
        return { success: false, data: null, error: { message: "No logged in user" }};
    }
    const user = findUserById(currentUserId);
    if (!user) {
         return { success: false, data: null, error: { message: "Logged in user not found" }};
    }
    return { success: true, data: toUserData(user), error: null };
}
