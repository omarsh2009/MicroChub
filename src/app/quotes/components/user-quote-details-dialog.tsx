'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { QuoteRequestWithUserData, QuoteRequest } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface UserQuoteDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    quote: QuoteRequestWithUserData;
    onQuoteUpdate: (quote: QuoteRequestWithUserData) => void;
}

export function UserQuoteDetailsDialog({ isOpen, onClose, quote, onQuoteUpdate }: UserQuoteDetailsDialogProps) {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [negotiationMessage, setNegotiationMessage] = useState('');

    const handleAction = async (action: 'accept' | 'reject' | 'negotiate') => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let newStatus: QuoteRequest['status'] = quote.status;
        let toastTitle = '';

        switch (action) {
            case 'accept':
                newStatus = 'accepted';
                toastTitle = 'Quote Accepted!';
                break;
            case 'reject':
                newStatus = 'rejected';
                toastTitle = 'Quote Rejected';
                break;
            case 'negotiate':
                newStatus = 'negotiating';
                toastTitle = 'Negotiation Sent';
                break;
        }

        toast({
            title: `${toastTitle} (Demo)`,
            description: `Your response for quote #${quote.id.slice(0, 7)} has been recorded.`,
        });
        
        onQuoteUpdate({ ...quote, status: newStatus });
        
        onClose();
        setIsSaving(false);
    };
    
    const item = quote.items[0];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Quote Details: #{quote.id.slice(0,7)}</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4 max-h-[75vh] overflow-y-auto pr-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">Requested on {quote.createdAt ? format(new Date(quote.createdAt.seconds * 1000), 'PPp') : 'N/A'}</p>
                        <Badge variant={quote.status === 'offered' ? 'default' : 'outline'}>{quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}</Badge>
                    </div>

                    <Card>
                        <CardHeader><CardTitle>Item Details</CardTitle></CardHeader>
                        <CardContent>
                            <p className="font-semibold">{item.name} x{item.quantity}</p>
                            {quote.userNotes && <p className="text-sm text-muted-foreground mt-2">Your notes: "{quote.userNotes}"</p>}
                        </CardContent>
                    </Card>

                   {(quote.status === 'offered' || quote.status === 'accepted' || quote.status === 'rejected') && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Our Offer</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                               <div className="flex justify-between text-lg">
                                  <span className="font-semibold">Quoted Price:</span> 
                                  <span className="font-bold">EGP {quote.quotedPrice?.toLocaleString()}</span>
                                </div>
                                {quote.adminNotes && <p className="text-sm text-muted-foreground pt-2">Notes from us: "{quote.adminNotes}"</p>}
                            </CardContent>
                        </Card>
                   )}

                   {quote.status === 'offered' && (
                       <Card>
                           <CardHeader><CardTitle>Your Response</CardTitle></CardHeader>
                           <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="negotiationMessage">Send a counter-offer or message (Optional)</Label>
                                    <Textarea id="negotiationMessage" value={negotiationMessage} onChange={e => setNegotiationMessage(e.target.value)} placeholder="e.g., Can you do it for EGP 8500?"/>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-end">
                                    <Button variant="outline" onClick={() => handleAction('reject')} disabled={isSaving}>Reject Offer</Button>
                                    <Button variant="secondary" onClick={() => handleAction('negotiate')} disabled={isSaving || !negotiationMessage}>Negotiate</Button>
                                    <Button onClick={() => handleAction('accept')} disabled={isSaving}>Accept & Proceed</Button>
                                </div>
                           </CardContent>
                       </Card>
                   )}

                   {quote.status === 'accepted' && (
                       <div className="text-center p-4 bg-green-100 dark:bg-green-900/50 rounded-lg">
                           <p className="font-semibold text-green-800 dark:text-green-300">You have accepted this offer. We will contact you shortly to finalize the order.</p>
                       </div>
                   )}
                    {quote.status === 'rejected' && (
                       <div className="text-center p-4 bg-red-100 dark:bg-red-900/50 rounded-lg">
                           <p className="font-semibold text-red-800 dark:text-red-300">You have rejected this offer.</p>
                       </div>
                   )}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

    