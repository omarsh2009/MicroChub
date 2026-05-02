'use client';
import { PolicyClientPage } from './client';
import { useAppContext } from '@/context/app-provider';

export default function AdminPolicyPage() {
  const { policies } = useAppContext();
  return <PolicyClientPage policies={policies} />;
}
