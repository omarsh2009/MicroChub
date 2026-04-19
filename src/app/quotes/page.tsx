
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, FileQuestion } from 'lucide-react';
import type { QuoteRequestWithUserData, Product } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';
import { getProducts } from '@/lib/services/products';
import { updateUserQuoteStatus, getUserQuotes } from '@/lib/services/quotes';


export default function QuotesPage() {
  const user = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  const [quotes, setQuotes] = useState<QuoteRequestWithUserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProductsData] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(({ data }) => setProductsData(data || []));
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const fetchQuotes = async () => {
        setLoading(true);
        const { data, error } = await getUserQuotes();
        if (error || !data) {
            setError(error?.message || 'Failed to fetch quotes.');
        } else {
            setQuotes(data);
        }
        setLoading(false);
    }
    fetchQuotes();
  }, [user]);

  const handleAcceptQuote = (quote: QuoteRequestWithUserData) => {
    if (!quote.quotedPrice) return;
    const item = quote.items[0];
    const product = products.find(p => p.id === item.productId);
    if (!product) {
        toast({variant: 'destructive', title: 'Product not found'});
        return;
    }
    
    addToCart(product, item.quantity, item.configuration, quote.quotedPrice);
    
    updateUserQuoteStatus(quote.id, 'Accepted');
    setQuotes(prev => prev.map(q => q.id === quote.id ? {...q, status: 'Accepted'} : q));

    toast({ title: 'Quote Accepted!', description: `${item.name} has been added to your cart.`});
    router.push('/cart');
  };

  const handleRejectQuote = async (quoteId: string) => {
    const { error } = await updateUserQuoteStatus(quoteId, 'Rejected');
    if (error) {
        toast({ variant: 'destructive', title: 'Action Failed', description: error.message });
    } else {
        setQuotes(prev => prev.map(q => q.id === quoteId ? {...q, status: 'Rejected'} : q));
        toast({ variant: 'destructive', title: 'Quote Rejected'});
    }
  };


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

  const getStatusColor = (status: QuoteRequestWithUserData['status']): "default" | "secondary" | "destructive" | "outline" => {
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
      <h1 className="font-headline text-4xl font-bold tracking-tighter mb-8">My Quotes</h1>
      {quotes && quotes.length > 0 ? (
        <div className="space-y-6">
          {quotes.map(quote => {
              const item = quote.items[0];
              return (
                <Card key={quote.id}>
                <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                    <CardTitle>Quote #{quote.id.slice(0, 7)}</CardTitle>
                    <CardDescription>
                        Requested on {quote.createdAt ? format(new Date(quote.createdAt.seconds * 1000), 'PPP') : 'N/A'}
                    </CardDescription>
                    </div>
                    <Badge variant={getStatusColor(quote.status)}>{quote.status}</Badge>
                </CardHeader>
                <CardContent>
                    {item && (
                        <div className="space-y-2">
                            <p className="font-semibold">{item.name} <span className="text-muted-foreground text-sm">x{item.quantity}</span></p>
                            {renderConfiguration(item.configuration)}
                        </div>
                    )}
                    {quote.userNotes && <p className="text-sm text-muted-foreground mt-2">Your notes: {quote.userNotes}</p>}

                    {quote.status === 'Quoted' && (
                        <Card className="mt-4 bg-muted/50">
                            <CardHeader>
                                <CardTitle className="text-lg">Quote Received</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between font-bold text-xl">
                                    <span>Quoted Price:</span>
                                    <span>EGP {quote.quotedPrice?.toLocaleString()}</span>
                                </div>
                                {quote.adminNotes && <p className="text-sm text-muted-foreground mt-2">Notes from our team: {quote.adminNotes}</p>}
                            </CardContent>
                            <CardFooter className="gap-2">
                                <Button onClick={() => handleAcceptQuote(quote)}>Accept & Add to Cart</Button>
                                <Button variant="destructive" onClick={() => handleRejectQuote(quote.id)}>Reject Quote</Button>
                            </CardFooter>
                        </Card>
                    )}
                </CardContent>
                </Card>
            )
          })}
        </div>
      ) : (
        <Card className="text-center py-20">
            <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    <FileQuestion className="w-12 h-12 text-primary" />
                </div>
            </CardHeader>
            <CardContent>
                <h2 className="text-2xl font-semibold mb-2">No Quote Requests Yet</h2>
                <p className="text-muted-foreground mb-6">You haven't requested any quotes. Find a product to customize!</p>
                <Button asChild>
                    <Link href="/products">Browse Products</Link>
                </Button>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
