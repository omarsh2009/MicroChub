'use client';
import { UsersClientPage } from './client';
import { useAppContext } from '@/context/app-provider';

export default function AdminUsersPage() {
  const { users } = useAppContext();
  return <UsersClientPage users={users} />;
}
