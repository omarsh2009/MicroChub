import { UsersClientPage } from './client';
import { mockUsers } from '@/lib/demo-data';

export default function AdminUsersPage() {
  const users = mockUsers;
  return <UsersClientPage users={users} />;
}
