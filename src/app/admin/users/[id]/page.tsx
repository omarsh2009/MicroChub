import { UserDetailsClientPage } from './client';
import { mockUsers, mockOrders } from '@/lib/demo-data';
import { notFound } from 'next/navigation';

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const user = mockUsers.find(u => u.id === params.id);
  const orders = mockOrders.filter(o => o.userId === params.id);
  
  if (!user) {
      notFound();
  }

  return <UserDetailsClientPage user={user} orders={orders} />;
}
