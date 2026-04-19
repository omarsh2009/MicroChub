
'use client';
import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserData } from './use-user';
import { getMe } from '@/lib/services/auth';

interface AuthContextType {
    user: UserData | null;
    isLoading: boolean;
    refetchUser: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        // Don't set loading to true on refetch to avoid UI flicker
        const { data } = await getMe(); // Fetches from /auth/me
        setUser(data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <AuthContext.Provider value={{ user, isLoading, refetchUser: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}
