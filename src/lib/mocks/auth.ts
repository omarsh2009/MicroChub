'use client';
import { type SignUpFormValues } from '@/app/signup/page';

// MOCK API - simulates a network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function signUpWithEmail(
  values: SignUpFormValues
) {
  await sleep(500);
  console.log("Mock Sign Up:", values);
  // In a real app, you would get a user object back.
  // Here we return a mock user object.
  return {
    uid: `mock-uid-${Date.now()}`,
    email: values.email,
    displayName: values.name,
  };
}

export async function signInWithEmail(
  values: { email: string; password: string }
) {
  await sleep(500);
  console.log("Mock Sign In:", values);
   // Simulate a login failure for a specific email for testing purposes
  if (values.email.includes('fail')) {
    throw new Error("Invalid email or password.");
  }
  return {
     uid: `mock-uid-${Date.now()}`,
     email: values.email,
     displayName: "Test User",
  };
}

export async function signOut() {
  await sleep(100);
  console.log("Mock Sign Out");
  return;
}
