
'use client';
import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserData } from './use-user';
import { getMe } from '@/lib/services/auth';
import { Loader2 } from 'lucide-react';

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
        const response = await getMe();
        if (response.success) {
            setUser(response.data);
        } else {
            // This is expected if the user is not logged in.
            setUser(null);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // By rendering the children immediately, we prevent a full-page loading state
    // that can cause authentication issues with the preview environment.
    // The loading state is passed via context for components that need it.
    return (
        <AuthContext.Provider value={{ user, isLoading, refetchUser: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}
