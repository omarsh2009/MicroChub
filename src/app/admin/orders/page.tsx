'use client';
import { OrdersClientPage } from './client';
import { useAppContext } from '@/context/app-provider';

export default function AdminOrdersPage() {
  const { orders } = useAppContext();
  return <OrdersClientPage initialOrders={orders || []} />;
}
