'use client';
import { useState, useEffect } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { getAllUsers, updateUserRole } from '@/lib/admin';
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
  const firestore = useFirestore();
  const user = useUser(); // The current admin user
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firestore || user?.profile?.role !== 'super_admin') return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await getAllUsers(firestore);
        // Filter out the current super_admin from the list to prevent self-demotion
        setUsers(fetchedUsers.filter(u => u.id !== user.uid));
      } catch (error: any) {
        console.error('Failed to fetch users:', error);
        toast({
          variant: 'destructive',
          title: 'Error Fetching Users',
          description: error.message.includes('permission-denied') 
            ? "You don't have permission to view users."
            : 'Could not fetch users. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [firestore, user, toast]);

  const handleRoleChange = async (userId: string, newRole: UserProfile['role']) => {
    if (!firestore) return;
    try {
        await updateUserRole(firestore, userId, newRole);
        setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));
        toast({
            title: 'User Role Updated',
            description: `The user role has been changed to ${newRole}.`,
        });
    } catch (error: any) {
        console.error('Failed to update user role:', error);
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: 'Could not update user role. Please try again.',
        });
    }
  };
  
  if (user?.profile?.role !== 'super_admin') {
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
