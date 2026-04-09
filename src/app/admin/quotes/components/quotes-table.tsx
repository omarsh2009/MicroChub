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
import type { QuoteRequestWithUserData, QuoteRequest } from '@/lib/types';
import { format } from 'date-fns';

export function QuotesTable({
  quotes,
  onViewDetails,
}: {
  quotes: QuoteRequestWithUserData[];
  onViewDetails: (quote: QuoteRequestWithUserData) => void;
}) {
  const getStatusColor = (status: QuoteRequest['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'Pending Review':
            return 'outline';
        case 'Quoted':
            return 'default';
        case 'Accepted':
        case 'Ordered':
            return 'secondary';
        case 'Rejected':
            return 'destructive';
        default:
            return 'outline';
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Request ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Product</TableHead>
          <TableHead className="hidden md:table-cell">Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quotes.map((quote) => (
          <TableRow key={quote.id}>
            <TableCell className="font-medium">#{quote.id.slice(0, 7)}</TableCell>
            <TableCell>
              <div className="font-medium">{quote.user.name}</div>
              <div className="hidden text-sm text-muted-foreground md:inline">
                {quote.user.email}
              </div>
            </TableCell>
            <TableCell>{quote.items[0]?.name || 'N/A'}</TableCell>
            <TableCell className="hidden md:table-cell">
              {quote.createdAt ? format(new Date(quote.createdAt.seconds * 1000), 'PP') : 'N/A'}
            </TableCell>
            <TableCell>
              <Badge variant={getStatusColor(quote.status)}>{quote.status}</Badge>
            </TableCell>
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => onViewDetails(quote)}>
                View Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
