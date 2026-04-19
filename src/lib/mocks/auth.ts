
'use client';
import { type SignUpFormValues } from '@/app/signup/page';
import type { ServiceResponse } from '../types';
import { UserData } from '@/auth/use-user';

export async function signUpWithEmail(
  values: SignUpFormValues
): Promise<ServiceResponse<UserData>> {
  throw new Error('API not implemented: mockSignUpWithEmail');
}

export async function signInWithEmail(
  values: { email: string; password: string }
): Promise<ServiceResponse<UserData>> {
  throw new Error('API not implemented: mockSignInWithEmail');
}

export async function signOut(): Promise<ServiceResponse<null>> {
  throw new Error('API not implemented: mockSignOut');
}
