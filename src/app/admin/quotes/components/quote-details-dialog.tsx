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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { QuoteRequestWithUserData, QuoteRequest } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface QuoteDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    quote: QuoteRequestWithUserData;
    onQuoteUpdate: (quote: QuoteRequestWithUserData) => void;
}

export function QuoteDetailsDialog({ isOpen, onClose, quote, onQuoteUpdate }: QuoteDetailsDialogProps) {
    const { toast } = useToast();
    const [quotedPrice, setQuotedPrice] = useState(quote.quotedPrice || '');
    const [adminNotes, setAdminNotes] = useState(quote.adminNotes || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleAction = async (action: 'submit' | 'reject') => {
        if (action === 'submit' && !quotedPrice) {
            toast({ variant: 'destructive', title: 'Missing Price', description: 'Please enter a quoted price.'});
            return;
        };
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newStatus: QuoteRequest['status'] = action === 'submit' ? 'offered' : 'rejected';

        toast({
            title: `Quote ${newStatus === 'offered' ? 'Submitted' : 'Rejected'} (Demo)`,
            description: `Quote for #${quote.id.slice(0, 7)} has been updated.`,
        });
        
        onQuoteUpdate({ 
            ...quote, 
            status: newStatus, 
            quotedPrice: newStatus === 'offered' ? Number(quotedPrice) : undefined,
            adminNotes: newStatus === 'offered' ? adminNotes : 'This request has been rejected by the admin.'
        });
        
        onClose();
        setIsSaving(false);
    };

    const renderConfiguration = (config: Record<string, string | string[]>) => {
        const entries = Object.entries(config);
        if (entries.length === 0) return 'Standard Product';
        
        return entries.map(([groupName, option]) => (
            <div key={groupName} className="text-xs text-muted-foreground ml-4">
                - <span className="font-semibold">{groupName}:</span>{' '}
                {Array.isArray(option) ? option.join(', ') : option}
            </div>
        ));
    };

    const item = quote.items[0];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Quote Request: #{quote.id.slice(0,7)}</DialogTitle>
                </DialogHeader>
                <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[75vh] overflow-y-auto pr-4">
                    <div className="md:col-span-2 space-y-4">
                       <Card>
                           <CardHeader><CardTitle>Requested Item</CardTitle></CardHeader>
                           <CardContent>
                                {item && (
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold">{item.name} <span className="text-muted-foreground text-sm">x{item.quantity}</span></p>
                                                {renderConfiguration(item.configuration)}
                                            </div>
                                            <p className="font-medium">Base Price: EGP {item.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                )}
                           </CardContent>
                       </Card>
                       {quote.userNotes && (
                           <Card>
                               <CardHeader><CardTitle>Customer Notes</CardTitle></CardHeader>
                               <CardContent><p className="text-sm text-muted-foreground">{quote.userNotes}</p></CardContent>
                           </Card>
                       )}
                       {quote.status !== 'pending' && (
                           <Card>
                               <CardHeader><CardTitle>Submitted Quote</CardTitle></CardHeader>
                               <CardContent className="space-y-2">
                                  <p><span className="font-semibold">Quoted Price:</span> {quote.quotedPrice ? `EGP ${quote.quotedPrice.toLocaleString()}` : 'N/A'}</p>
                                  {quote.adminNotes && <p><span className="font-semibold">Notes:</span> {quote.adminNotes}</p>}
                               </CardContent>
                           </Card>
                       )}
                    </div>
                    <div className="space-y-4">
                         <Card>
                             <CardHeader><CardTitle>Customer</CardTitle></CardHeader>
                             <CardContent className="text-sm space-y-1">
                                 <p className="font-medium">{quote.user.name}</p>
                                 <p className="text-muted-foreground">{quote.user.email}</p>
                                 <p className="text-muted-foreground">{quote.user.phoneNumber}</p>
                                 <p className="text-xs text-muted-foreground pt-2">Requested on {quote.createdAt ? format(new Date(quote.createdAt.seconds * 1000), 'PPp') : 'N/A'}</p>
                             </CardContent>
                         </Card>
                         {quote.fileUrl && (
                            <Card>
                                <CardHeader><CardTitle>Attached File</CardTitle></CardHeader>
                                <CardContent className="space-y-2">
                                    <a href={quote.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-primary hover:underline">
                                        View Attached File <ExternalLink className="w-4 h-4 ml-2" />
                                    </a>
                                </CardContent>
                            </Card>
                         )}
                         <Card>
                             <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>Status</span>
                                    <Badge variant={quote.status === 'offered' ? 'default' : 'outline'}>{quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}</Badge>
                                </CardTitle>
                             </CardHeader>
                             {quote.status === 'pending' && (
                                 <CardContent className="space-y-4">
                                     <div>
                                         <Label htmlFor="quotedPrice">Quoted Price (EGP)</Label>
                                         <Input id="quotedPrice" type="number" value={quotedPrice} onChange={(e) => setQuotedPrice(e.target.value)} placeholder="e.g. 1500" />
                                     </div>
                                     <div>
                                         <Label htmlFor="adminNotes">Notes for Customer (Optional)</Label>
                                         <Textarea id="adminNotes" value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="e.g. Price includes custom firmware..." />
                                     </div>
                                 </CardContent>
                             )}
                         </Card>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    {quote.status === 'pending' && (
                        <div className="flex gap-2">
                            <Button variant="destructive" onClick={() => handleAction('reject')} disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Reject
                            </Button>
                            <Button onClick={() => handleAction('submit')} disabled={isSaving || !quotedPrice}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Quote
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

    