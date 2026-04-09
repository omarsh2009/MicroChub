'use client';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { OrderWithUserData, Order } from '@/lib/types';
import { format } from 'date-fns';

export function OrdersTable({
  orders,
  onViewDetails,
}: {
  orders: OrderWithUserData[];
  onViewDetails: (order: OrderWithUserData) => void;
}) {
  const getStatusColor = (status: Order['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'Pending Payment Proof':
        case 'Under Review':
            return 'outline';
        case 'Confirmed':
            return 'default';
        case 'In Production':
            return 'default'; // could be another color
        case 'Ready':
            return 'default'; // could be another color
        case 'Completed/Delivered':
            return 'secondary';
        default:
            return 'outline';
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead className="hidden md:table-cell">Date</TableHead>
          <TableHead className="hidden md:table-cell">Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">#{order.id.slice(0, 7)}</TableCell>
            <TableCell>
              <div className="font-medium">{order.user.name}</div>
              <div className="hidden text-sm text-muted-foreground md:inline">
                {order.user.email}
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {order.createdAt ? format(new Date(order.createdAt.seconds * 1000), 'PP') : 'N/A'}
            </TableCell>
            <TableCell className="hidden md:table-cell">EGP {order.totalPrice.toLocaleString()}</TableCell>
            <TableCell>
              <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
            </TableCell>
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => onViewDetails(order)}>
                View Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
