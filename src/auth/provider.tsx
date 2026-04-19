
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

    // This renders a loading spinner for the initial user fetch.
    // This prevents a "flash" of the logged-out state for authenticated users.
    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }


    return (
        <AuthContext.Provider value={{ user, isLoading, refetchUser: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}
