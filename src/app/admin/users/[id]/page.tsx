
import { UserDetailsClientPage } from './client';
import { mockUsers, mockOrders } from '@/lib/demo-data';
import { notFound } from 'next/navigation';

export default async function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = mockUsers.find(u => u.id === id);
  const orders = mockOrders.filter(o => o.userId === id);
  
  if (!user) {
      notFound();
  }

  return <UserDetailsClientPage user={user} orders={orders} />;
}
