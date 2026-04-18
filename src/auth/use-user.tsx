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
    email: 'test@example.com',
    displayName: 'Test User',
    profile: {
        id: 'mock-user-123',
        name: 'Test User',
        email: 'test@example.com',
        phoneNumber: '01234567890',
        wishlist: [],
        role: 'user',
    },
};

export const useUser = () => {
    // In a real app, this would involve context, state, and effects.
    // For this frontend-only prototype, we just return the static mock user.
    return mockUser;
};
