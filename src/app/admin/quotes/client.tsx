'use client';
import { useState } from 'react';
import type { QuoteRequestWithUserData } from '@/lib/types';
import { QuotesTable } from './components/quotes-table';
import { QuoteDetailsDialog } from './components/quote-details-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from 'lucide-react';

export function QuotesClientPage({ initialQuotes }: { initialQuotes: QuoteRequestWithUserData[] }) {
  const [quotes, setQuotes] = useState<QuoteRequestWithUserData[]>(initialQuotes);
  const [loading, setLoading] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequestWithUserData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = (quote: QuoteRequestWithUserData) => {
    setSelectedQuote(quote);
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
      setIsDialogOpen(false);
      setSelectedQuote(null);
  };

  const handleQuoteUpdate = (updatedQuote: QuoteRequestWithUserData) => {
    setQuotes(prevQuotes => prevQuotes.map(q => q.id === updatedQuote.id ? updatedQuote : q));
  };


  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Quote Requests</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Quote Requests</CardTitle>
          <CardDescription>Review customer quote requests and submit pricing.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <QuotesTable quotes={quotes} onViewDetails={handleViewDetails} />
          )}
        </CardContent>
      </Card>
      
      {selectedQuote && (
          <QuoteDetailsDialog 
            quote={selectedQuote}
            isOpen={isDialogOpen}
            onClose={handleDialogClose}
            onQuoteUpdate={handleQuoteUpdate}
          />
      )}
    </>
  );
}
