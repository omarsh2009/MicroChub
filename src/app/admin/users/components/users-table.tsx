'use client';
import Link from 'next/link';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { UserWithId, UserProfile } from '@/lib/types';
import { Eye } from 'lucide-react';

export function UsersTable({
  users,
  onRoleChange,
}: {
  users: UserWithId[];
  onRoleChange: (userId: string, newRole: UserProfile['role']) => void;
}) {
  const roles: UserProfile['role'][] = ['user', 'admin']; // Super admins can only be set manually

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone Number</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.phoneNumber}</TableCell>
            <TableCell>
              <Select value={user.role} onValueChange={(newRole) => onRoleChange(user.id, newRole as UserProfile['role'])}>
                  <SelectTrigger className="w-full max-w-[180px]">
                      <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                      {roles.map(role => (
                          <SelectItem key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
                <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/users/${user.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                    </Link>
                </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
