'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { OrdersTable } from '@/app/admin/orders/components/orders-table';
import { OrderDetailsDialog } from '@/app/admin/orders/components/order-details-dialog';
import type { UserWithId, OrderWithUserData } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';

export function UserDetailsClientPage({ user, orders: initialOrders }: { user: UserWithId; orders: OrderWithUserData[] }) {
  const [orders, setOrders] = useState<OrderWithUserData[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithUserData | null>(null);

  const handleViewDetails = (order: OrderWithUserData) => {
    setSelectedOrder(order);
  };

  const handleDialogClose = () => {
    setSelectedOrder(null);
  };

  const handleOrderUpdate = (updatedOrder: OrderWithUserData) => {
    setOrders(prevOrders => prevOrders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };
  
  return (
    <>
      <div className="mb-4">
        <Button asChild variant="outline" size="sm">
            <Link href="/admin/users">
                <ArrowLeft className="mr-2" />
                Back to Users
            </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>{user.name}</CardTitle>
                    <CardDescription>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phoneNumber}</p>
                    <p><strong>User ID:</strong> <span className="font-mono text-xs bg-muted p-1 rounded">{user.id}</span></p>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>All orders placed by this user.</CardDescription>
                </CardHeader>
                <CardContent>
                    <OrdersTable orders={orders} onViewDetails={handleViewDetails} />
                </CardContent>
            </Card>
        </div>
      </div>
      {selectedOrder && (
          <OrderDetailsDialog 
            order={selectedOrder}
            isOpen={!!selectedOrder}
            onClose={handleDialogClose}
            onOrderUpdate={handleOrderUpdate}
          />
      )}
    </>
  );
}
