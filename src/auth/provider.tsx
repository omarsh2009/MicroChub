'use client';
import { ReactNode } from 'react';

// This provider is a placeholder for a real authentication context provider.
// In this frontend-only prototype, it doesn't need to manage state since
// useUser() returns a static mock user.
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
