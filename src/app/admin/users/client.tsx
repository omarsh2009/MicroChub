'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@/auth';
import { getAllUsers, updateUserRole } from '@/lib/services/users';
import type { UserWithId, UserProfile } from '@/lib/types';
import { UsersTable } from './components/users-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function UsersClientPage() {
  const currentUser = useUser();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.profile?.role !== 'super_admin') return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data: fetchedUsers, success, error } = await getAllUsers();
        
        if (success && fetchedUsers && currentUser) {
            // Filter out the current super_admin from the list to prevent self-demotion
            setUsers(fetchedUsers.filter(u => u.id !== currentUser.uid));
        } else if (error) {
             toast({
              variant: 'destructive',
              title: 'Error Fetching Users',
              description: error.message || 'Could not fetch users. Please try again.',
            });
        }
      } catch (error: any) {
        console.error('Failed to fetch users:', error);
        toast({
          variant: 'destructive',
          title: 'Error Fetching Users',
          description: 'Could not fetch users. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser, toast]);

  const handleRoleChange = async (userId: string, newRole: UserProfile['role']) => {
    const { success, error } = await updateUserRole(userId, newRole);
    if (success) {
        setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));
        toast({
            title: 'User Role Updated',
            description: `The user role has been changed to ${newRole}.`,
        });
    } else {
        console.error('Failed to update user role:', error);
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: error?.message || 'Could not update user role. Please try again.',
        });
    }
  };
  
  if (currentUser?.profile?.role !== 'super_admin') {
      return (
          <Card>
              <CardHeader>
                  <CardTitle>Access Denied</CardTitle>
                  <CardDescription>You do not have permission to manage users.</CardDescription>
              </CardHeader>
          </Card>
      );
  }

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
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <UsersTable users={users} onRoleChange={handleRoleChange} />
          )}
        </CardContent>
      </Card>
    </>
  );
}
