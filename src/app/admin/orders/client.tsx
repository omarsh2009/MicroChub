'use client';
import { useState } from 'react';
import type { OrderWithUserData } from '@/lib/types';
import { OrdersTable } from './components/orders-table';
import { OrderDetailsDialog } from './components/order-details-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from 'lucide-react';

export function OrdersClientPage({ initialOrders }: { initialOrders: OrderWithUserData[] }) {
  const [orders, setOrders] = useState<OrderWithUserData[]>(initialOrders);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithUserData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = (order: OrderWithUserData) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
      setIsDialogOpen(false);
      setSelectedOrder(null);
  };

  const handleOrderUpdate = (updatedOrder: OrderWithUserData) => {
    setOrders(prevOrders => prevOrders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };


  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Orders</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Orders</CardTitle>
          <CardDescription>View and manage all customer orders.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <OrdersTable orders={orders} onViewDetails={handleViewDetails} />
          )}
        </CardContent>
      </Card>
      
      {selectedOrder && (
          <OrderDetailsDialog 
            order={selectedOrder}
            isOpen={isDialogOpen}
            onClose={handleDialogClose}
            onOrderUpdate={handleOrderUpdate}
          />
      )}
    </>
  );
}
