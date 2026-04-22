import { OrdersClientPage } from './client';
import { getAllOrders } from '@/lib/services/orders';

export default async function AdminOrdersPage() {
  const { data } = await getAllOrders();
  return <OrdersClientPage initialOrders={data || []} />;
}
