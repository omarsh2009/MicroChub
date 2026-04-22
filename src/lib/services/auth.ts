
import type { SignUpFormValues } from '@/app/signup/page';
import type { ServiceResponse, UserWithId } from '../types';
import type { UserData } from '@/auth/use-user';
import { mockUsers } from '@/lib/mock-data';

export async function signUpWithEmail(values: SignUpFormValues): Promise<ServiceResponse<UserData>> {
    // This is a mock implementation
    const newUser: UserWithId = {
        id: `user_${Math.random().toString(36).substring(2, 9)}`,
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        role: 'user',
        wishlist: [],
    };
    mockUsers.push(newUser);
    const userData: UserData = {
        uid: newUser.id,
        displayName: newUser.name,
        email: newUser.email,
        profile: newUser,
    };
    return { success: true, data: userData, error: null };
}

export async function signInWithEmail(values: { email: string; password: string }): Promise<ServiceResponse<UserData>> {
    const user = mockUsers.find(u => u.email === values.email);
    if (!user) {
        return { success: false, data: null, error: { message: "Invalid credentials" }};
    }
     const userData: UserData = {
        uid: user.id,
        displayName: user.name,
        email: user.email,
        profile: user,
    };
    return { success: true, data: userData, error: null };
}

export async function signOut(): Promise<ServiceResponse<null>> {
    return { success: true, data: null, error: null };
}

export async function getMe(): Promise<ServiceResponse<UserData>> {
    // Mock being logged in as the super_admin
    const user = mockUsers.find(u => u.role === 'super_admin');
    if (!user) {
         return { success: false, data: null, error: { message: "No logged in user" }};
    }
    const userData: UserData = {
        uid: user.id,
        displayName: user.name,
        email: user.email,
        profile: user,
    };
    return { success: true, data: userData, error: null };
}
