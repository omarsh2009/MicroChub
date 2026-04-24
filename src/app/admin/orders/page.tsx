import { OrdersClientPage } from './client';
import { mockOrders } from '@/lib/demo-data';

export default function AdminOrdersPage() {
  const orders = mockOrders;
  return <OrdersClientPage initialOrders={orders || []} />;
}
