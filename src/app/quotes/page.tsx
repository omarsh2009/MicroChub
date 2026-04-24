
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';
import { mockQuotes } from '@/lib/demo-data';
import type { QuoteRequestWithUserData } from '@/lib/types';
import { QuotesTable } from './components/quotes-table';
import { UserQuoteDetailsDialog } from './components/user-quote-details-dialog';

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequestWithUserData[]>(mockQuotes.filter(q => q.userId === 'user-regular' || q.userId === 'user-admin'));
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequestWithUserData | null>(null);

  const handleQuoteUpdate = (updatedQuote: QuoteRequestWithUserData) => {
    setQuotes(prevQuotes => prevQuotes.map(q => q.id === updatedQuote.id ? updatedQuote : q));
  };
  
  if (quotes.length === 0) {
    return (
        <div className="container py-12 px-4 md:px-6">
        <h1 className="font-headline text-4xl font-bold tracking-tighter mb-8">My Quotes</h1>
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
        </div>
    );
  }

  return (
    <div className="container py-12 px-4 md:px-6">
        <h1 className="font-headline text-4xl font-bold tracking-tighter mb-8">My Quotes</h1>
        <Card>
            <CardContent className="p-0">
                <QuotesTable quotes={quotes} onViewDetails={setSelectedQuote} />
            </CardContent>
        </Card>
        {selectedQuote && (
            <UserQuoteDetailsDialog
                isOpen={!!selectedQuote}
                onClose={() => setSelectedQuote(null)}
                quote={selectedQuote}
                onQuoteUpdate={handleQuoteUpdate}
            />
        )}
    </div>
  );
}

    