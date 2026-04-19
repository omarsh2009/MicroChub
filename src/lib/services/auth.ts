
'use client';
import type { SignUpFormValues } from '@/app/signup/page';
import type { ServiceResponse } from '../types';
import type { UserData } from '@/auth/use-user';
import { api } from '@/lib/api';

export async function signUpWithEmail(values: SignUpFormValues): Promise<ServiceResponse<UserData>> {
    return api.post<UserData>('/auth/signup', values);
}

export async function signInWithEmail(values: { email: string; password: string }): Promise<ServiceResponse<UserData>> {
    return api.post<UserData>('/auth/login', values);
}

export async function signOut(): Promise<ServiceResponse<null>> {
    return api.post<null>('/auth/logout', {});
}

export async function getMe(): Promise<ServiceResponse<UserData>> {
    return api.get<UserData>('/auth/me');
}
