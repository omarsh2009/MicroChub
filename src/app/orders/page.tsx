'use client';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PackageSearch } from 'lucide-react';
import type { Order } from '@/lib/types';
import { format } from 'date-fns';
import { useAppContext } from '@/context/app-provider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function OrdersPage() {
  const { orders, currentUser } = useAppContext();
  
  const userOrders = orders.filter(o => o.userId === currentUser?.id);

  const getStatusColor = (status: Order['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'Pending Verification': return 'outline';
        case 'Confirmed':
        case 'In Production': return 'default';
        case 'Ready': return 'default';
        case 'Completed/Delivered': return 'secondary';
        case 'Cancelled': return 'destructive';
        default: return 'outline';
    }
  }

  if (userOrders.length === 0) {
    return (
        <div className="container py-12 px-4 md:px-6">
          <h1 className="font-headline text-4xl font-bold tracking-tighter mb-8">My Orders</h1>
            <Card className="text-center py-20">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                        <PackageSearch className="w-12 h-12 text-primary" />
                    </div>
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-semibold mb-2">No Orders Yet</h2>
                    <p className="text-muted-foreground mb-6">You haven't placed any orders yet. Let's change that!</p>
                    <Button asChild>
                        <Link href="/products">Start Shopping</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      );
  }

  return (
    <div className="container py-12 px-4 md:px-6">
      <h1 className="font-headline text-4xl font-bold tracking-tighter mb-8">My Orders</h1>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">#{order.id.slice(0, 7)}</TableCell>
                  <TableCell>{order.createdAt ? format(new Date(order.createdAt.seconds * 1000), 'PP') : 'N/A'}</TableCell>
                  <TableCell>EGP {order.totalPrice.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
