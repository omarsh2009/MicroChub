
'use client';
import { useContext } from 'react';
import { AuthContext } from './provider';
import type { UserProfile } from '@/lib/types';

export interface UserData {
    uid: string;
    email: string;
    displayName: string;
    profile: UserProfile;
}

// This hook provides the user object, which is null if not authenticated.
export const useUser = (): UserData | null => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useUser must be used within an AuthProvider');
    }
    return context.user;
};

// This hook provides the full auth context, including loading state and refetch function.
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
