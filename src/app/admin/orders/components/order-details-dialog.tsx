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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { OrderWithUserData, Order } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ExternalLink, ShieldCheck, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';

interface OrderDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    order: OrderWithUserData;
    onOrderUpdate: (order: OrderWithUserData) => void;
}

export function OrderDetailsDialog({ isOpen, onClose, order, onOrderUpdate }: OrderDetailsDialogProps) {
    const { toast } = useToast();
    const [newStatus, setNewStatus] = useState<Order['status']>(order.status);
    const [isSaving, setIsSaving] = useState(false);
    const [isApprovingLegal, setIsApprovingLegal] = useState(false);

    const orderStatuses: Order['status'][] = ['Pending Verification', 'Confirmed', 'In Production', 'Ready', 'Completed/Delivered', 'Cancelled'];
    
    const handleStatusChange = (value: string) => {
        setNewStatus(value as Order['status']);
    };
    
    const handleSaveChanges = async () => {
        if (newStatus === order.status) return;
        setIsSaving(true);
        // Simulate API call for demo
        await new Promise(resolve => setTimeout(resolve, 500));
        toast({
            title: 'Order Updated (Demo)',
            description: `Order #${order.id.slice(0, 7)} status changed to ${newStatus}.`,
        });
        onOrderUpdate({ ...order, status: newStatus });
        setIsSaving(false);
        onClose();
    };

     const handleApproveLegal = async () => {
        setIsApprovingLegal(true);
        // Simulate API call for demo
        await new Promise(resolve => setTimeout(resolve, 500));
        toast({
            title: 'Legal Agreement Approved (Demo)',
            description: `Agreement for order #${order.id.slice(0, 7)} has been approved.`,
        });
        onOrderUpdate({ ...order, legalAgreementApproved: true });
        setIsApprovingLegal(false);
    };
    
    const renderConfiguration = (config: Record<string, string | string[]>) => {
        const entries = Object.entries(config);
        if (entries.length === 0) return null;
        
        return entries.map(([groupName, option]) => (
            <div key={groupName} className="text-xs text-muted-foreground ml-4">
                - <span className="font-semibold">{groupName}:</span>{' '}
                {Array.isArray(option) ? option.join(', ') : option}
            </div>
        ));
    };

    const canBeConfirmed = !order.requiresLegalApproval || order.legalAgreementApproved;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Order Details: #{order.id.slice(0,7)}</DialogTitle>
                </DialogHeader>
                <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[75vh] overflow-y-auto pr-4">
                    <div className="md:col-span-2 space-y-4">
                       <Card>
                           <CardHeader><CardTitle>Items</CardTitle></CardHeader>
                           <CardContent>
                                {order.items.map((item, index) => (
                                    <div key={index} className="space-y-2 mb-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold">{item.name} <span className="text-muted-foreground text-sm">x{item.quantity}</span></p>
                                                {renderConfiguration(item.configuration)}
                                            </div>
                                            <p className="font-medium">EGP {(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                         {index < order.items.length - 1 && <Separator />}
                                    </div>
                                ))}
                                <Separator className="my-2" />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>EGP {order.totalPrice.toLocaleString()}</span>
                                </div>
                           </CardContent>
                       </Card>

                       <Card>
                            <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
                            <CardContent className="text-sm space-y-1">
                                <p className="font-medium">{order.shippingAddress.fullName}</p>
                                <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                                <p className="text-muted-foreground">{order.shippingAddress.city}</p>
                                <p className="text-muted-foreground">{order.shippingAddress.phoneNumber}</p>
                            </CardContent>
                       </Card>
                       
                       {order.notes && (
                           <Card>
                               <CardHeader><CardTitle>Customer Notes</CardTitle></CardHeader>
                               <CardContent><p className="text-sm text-muted-foreground">{order.notes}</p></CardContent>
                           </Card>
                       )}
                    </div>
                    <div className="space-y-4">
                         <Card>
                             <CardHeader><CardTitle>Customer</CardTitle></CardHeader>
                             <CardContent className="text-sm space-y-1">
                                 <p className="font-medium">{order.user.name}</p>
                                 <p className="text-muted-foreground">{order.user.email}</p>
                                 <p className="text-xs text-muted-foreground pt-2">Placed on {order.createdAt ? format(new Date(order.createdAt.seconds * 1000), 'PPp') : 'N/A'}</p>
                             </CardContent>
                         </Card>

                         <Card>
                            <CardHeader><CardTitle>Payment Details</CardTitle></CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <div className="flex justify-between"><span>Method:</span> <span className="font-medium">{order.paymentMethod.name}</span></div>
                                <div className="flex justify-between"><span>Transaction ID:</span> <span className="font-mono text-xs bg-muted p-1 rounded">{order.transactionId}</span></div>
                            </CardContent>
                         </Card>

                         {order.requiresLegalApproval && (
                            <Card>
                                <CardHeader><CardTitle>Legal Approval</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        {order.legalAgreementApproved ? (
                                            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                                                <ShieldCheck className="mr-2 h-4 w-4" />
                                                Approved
                                            </Badge>
                                        ) : (
                                            <div className="flex items-center text-destructive">
                                                <ShieldAlert className="mr-2 h-4 w-4" />
                                                <span className="text-sm font-medium">Pending Approval</span>
                                            </div>
                                        )}
                                        {order.legalAgreementUrl && (
                                            <a href={order.legalAgreementUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-primary hover:underline">
                                                View File <ExternalLink className="w-4 h-4 ml-2" />
                                            </a>
                                        )}
                                    </div>
                                    {!order.legalAgreementApproved && (
                                        <Button size="sm" onClick={handleApproveLegal} disabled={isApprovingLegal} className="mt-4 w-full">
                                            {isApprovingLegal && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Approve Agreement
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                         )}
                         <Card>
                             <CardHeader><CardTitle>Order Status</CardTitle></CardHeader>
                             <CardContent>
                                 <Select value={newStatus} onValueChange={handleStatusChange}>
                                     <SelectTrigger>
                                         <SelectValue placeholder="Change status..." />
                                     </SelectTrigger>
                                     <SelectContent>
                                         {orderStatuses.map(status => (
                                             <SelectItem 
                                                key={status} 
                                                value={status}
                                                disabled={status === 'Confirmed' && !canBeConfirmed}
                                              >
                                                {status}
                                             </SelectItem>
                                         ))}
                                     </SelectContent>
                                 </Select>
                                 {!canBeConfirmed && (
                                     <p className="text-xs text-destructive mt-2">Legal agreement must be approved before confirming.</p>
                                 )}
                             </CardContent>
                         </Card>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSaveChanges} disabled={isSaving || newStatus === order.status}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}