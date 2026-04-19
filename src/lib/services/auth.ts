'use client';
import type { SignUpFormValues } from '@/app/signup/page';
import type { ServiceResponse, UserProfile } from '../types';

// This is an abstraction layer. The UI components will call these functions.
// The actual implementation is in the `/lib/mocks` directory.
// In a real app, you would replace the mock imports with your actual API calls.

import {
    signUpWithEmail as mockSignUp,
    signInWithEmail as mockSignIn,
    signOut as mockSignOut
} from '@/lib/mocks/auth';

export async function signUpWithEmail(values: SignUpFormValues): Promise<ServiceResponse<{ uid: string; email: string | null; displayName: string | null; }>> {
    return mockSignUp(values);
}

export async function signInWithEmail(values: { email: string; password: string }): Promise<ServiceResponse<{ uid: string; email: string | null; displayName: string | null; }>> {
    return mockSignIn(values);
}

export async function signOut(): Promise<ServiceResponse<null>> {
    return mockSignOut();
}
