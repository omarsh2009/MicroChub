'use client';
import { useState } from 'react';
import type { UserWithId, UserProfile } from '@/lib/types';
import { UsersTable } from './components/users-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';

export function UsersClientPage({ users: initialUsers }: { users: UserWithId[]}) {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithId[]>(initialUsers.filter(u => u.id !== 'user-super-admin')); // Can't edit self

  const handleRoleChange = (userId: string, newRole: UserProfile['role']) => {
    setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));
    toast({
        title: 'User Role Updated (Demo)',
        description: `The user role has been changed to ${newRole}.`,
    });
  };

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">User Management</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage User Roles</CardTitle>
          <CardDescription>Promote users to admins or demote them back to user status.</CardDescription>
        </CardHeader>
        <CardContent>
            <UsersTable users={users} onRoleChange={handleRoleChange} />
        </CardContent>
      </Card>
    </>
  );
}
