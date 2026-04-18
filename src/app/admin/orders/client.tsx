'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@/auth';
import { getAllOrders } from '@/lib/services/admin';
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
import { useToast } from '@/hooks/use-toast';

export function OrdersClientPage() {
  const user = useUser();
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderWithUserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithUserData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const fetchedOrders = await getAllOrders();
        setOrders(fetchedOrders);
      } catch (error: any) {
        console.error('Failed to fetch orders:', error);
        toast({
          variant: 'destructive',
          title: 'Error Fetching Orders',
          description: 'Could not fetch orders. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, toast]);

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
