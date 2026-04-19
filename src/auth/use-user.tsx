'use client';
import type { UserProfile } from '@/lib/types';

export interface MockUserData {
    uid: string;
    email: string | null;
    displayName: string | null;
    profile: UserProfile;
}

const mockUser: MockUserData = {
    uid: 'mock-user-123',
    email: 'admin@example.com',
    displayName: 'Admin User',
    profile: {
        id: 'mock-user-123',
        name: 'Admin User',
        email: 'admin@example.com',
        phoneNumber: '01234567890',
        wishlist: [],
        role: 'admin', // Changed from 'super_admin' to 'admin'
    },
};

export const useUser = () => {
    // In a real app, this would involve context, state, and effects.
    // For this frontend-only prototype, we just return the static mock user.
    return mockUser;
};
