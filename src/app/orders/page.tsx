'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, PackageSearch } from 'lucide-react';
import type { Order } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { getUserOrders } from '@/lib/services/orders'; 

export default function OrdersPage() {
  const user = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    };
    
    setLoading(true);
    getUserOrders(user.uid)
      .then(({ data, error }) => {
        if(error || !data) {
            setError(error || "Failed to fetch orders.");
        } else {
            setOrders(data);
        }
      })
      .finally(() => setLoading(false));
  }, [user]);

  const renderConfiguration = (config: Record<string, string | string[]>) => {
    const entries = Object.entries(config);
    if (entries.length === 0) return null;
    
    return entries.map(([groupName, option]) => (
        <div key={groupName} className="text-xs text-muted-foreground">
            <span className="font-semibold">{groupName}:</span>{' '}
            {Array.isArray(option) ? option.join(', ') : option}
        </div>
    ));
  };

  const getStatusColor = (status: Order['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'Pending Verification':
            return 'outline';
        case 'Confirmed':
        case 'In Production':
            return 'default';
        case 'Ready':
            return 'default'; // Could be different color
        case 'Completed/Delivered':
            return 'secondary';
        case 'Cancelled':
            return 'destructive';
        default:
            return 'outline';
    }
  }


  if (loading || !user) {
    return (
      <div className="container flex items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return <div className="container text-center py-20 text-destructive">Error: {error}</div>;
  }

  return (
    <div className="container py-12 px-4 md:px-6">
      <h1 className="font-headline text-4xl font-bold tracking-tighter mb-8">My Orders</h1>
      {orders && orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map(order => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle>Order #{order.id.slice(0, 7)}</CardTitle>
                  <CardDescription>
                    Placed on {order.createdAt ? format(new Date(order.createdAt.seconds * 1000), 'PPP') : 'N/A'}
                  </CardDescription>
                </div>
                <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold">{item.name} <span className="text-muted-foreground text-sm">x{item.quantity}</span></p>
                            {renderConfiguration(item.configuration)}
                        </div>
                         <p className="font-semibold">EGP {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-bold">
                    <p>Total</p>
                    <p>EGP {order.totalPrice.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );
}
