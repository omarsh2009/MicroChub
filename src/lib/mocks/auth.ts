'use client';
import { type SignUpFormValues } from '@/app/signup/page';
import type { ServiceResponse } from '../types';

// MOCK API - simulates a network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function signUpWithEmail(
  values: SignUpFormValues
): Promise<ServiceResponse<{ uid: string, email: string, displayName: string }>> {
  await sleep(500);
  console.log("Mock Sign Up:", values);
  // In a real app, you would get a user object back.
  // Here we return a mock user object.
  return {
    data: {
      uid: `mock-uid-${Date.now()}`,
      email: values.email,
      displayName: values.name,
    },
    error: null,
    status: 201
  };
}

export async function signInWithEmail(
  values: { email: string; password: string }
): Promise<ServiceResponse<{ uid: string, email: string, displayName: string }>> {
  await sleep(500);
  console.log("Mock Sign In:", values);
   // Simulate a login failure for a specific email for testing purposes
  if (values.email.includes('fail')) {
    return { data: null, error: "Invalid email or password.", status: 401 };
  }
  return {
    data: {
      uid: `mock-uid-${Date.now()}`,
      email: values.email,
      displayName: "Test User",
    },
    error: null,
    status: 200
  };
}

export async function signOut(): Promise<ServiceResponse<null>> {
  await sleep(100);
  console.log("Mock Sign Out");
  return { data: null, error: null, status: 200 };
}
