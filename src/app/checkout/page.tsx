'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Copy, Ticket, AlertCircle } from 'lucide-react';
import { useAppContext } from '@/context/app-provider';
import Link from 'next/link';

export default function CheckoutPage() {
  const { toast } = useToast();
  const { contactInfo, cart, currentUser } = useAppContext();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const isStoreClosed = contactInfo.storeStatus === 'closed';

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = cart.length > 0 ? 50 : 0; // Simple flat rate demo
  const total = subtotal + shipping;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
  };
  
  const handlePlaceOrder = () => {
      if (cart.length === 0) {
          toast({ variant: 'destructive', title: 'Cart is empty', description: 'Please add items to your cart before checking out.' });
          return;
      }
      toast({
          title: 'Order Placed (Demo)',
          description: "This is a static demo. No order was actually placed."
      })
  }

  if (cart.length === 0) {
      return (
          <div className="container py-24 text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Checkout is Unavailable</h2>
              <p className="text-muted-foreground mb-6">Your cart is empty. Add some awesome gear first!</p>
              <Button asChild><Link href="/products">Browse Products</Link></Button>
          </div>
      );
  }

  return (
    <div className="container py-12 px-4 md:px-6">
      <h1 className="font-headline text-4xl font-bold tracking-tighter mb-8">Checkout</h1>
        <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader><CardTitle>1. Shipping Address</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" placeholder="Your full name" defaultValue={currentUser?.name || "Demo User"} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input id="phoneNumber" placeholder="Your phone number" defaultValue={currentUser?.phoneNumber || "01234567890"} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" placeholder="e.g. Cairo" defaultValue="Cairo" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea id="address" placeholder="Your full street address" defaultValue="123 Demo Street, Nasr City" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="notes">Order Notes (Optional)</Label>
                            <Textarea id="notes" placeholder="Any special instructions for your order?" />
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader><CardTitle>2. Payment Method</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <RadioGroup onValueChange={setSelectedPaymentMethod} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Label htmlFor="pm-3" className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground ${selectedPaymentMethod === 'pm-3' ? 'border-primary bg-accent' : ''}`}>
                                <RadioGroupItem value="pm-3" id="pm-3" className="sr-only" />
                                Vodafone Cash
                            </Label>
                            <Label htmlFor="pm-1" className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground ${selectedPaymentMethod === 'pm-1' ? 'border-primary bg-accent' : ''}`}>
                                <RadioGroupItem value="pm-1" id="pm-1" className="sr-only" />
                                Cash on Delivery
                            </Label>
                        </RadioGroup>

                        {selectedPaymentMethod === 'pm-3' && (
                          <Card className="bg-muted/50 border-primary/20">
                            <CardHeader>
                              <CardTitle className="text-lg">Pay with Vodafone Cash</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <p className="text-sm">Send the total amount to this number and enter the transaction ID.</p>
                              <div className="flex items-center gap-2 rounded-md bg-background p-3 border">
                                <strong className="text-sm">Number:</strong>
                                <span className="font-mono flex-1 truncate">01012345678</span>
                                <Button type="button" size="icon" variant="ghost" onClick={() => copyToClipboard('01012345678')}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                               <div className="space-y-2">
                                    <Label htmlFor="transactionId">Transaction ID / Reference Number</Label>
                                    <Input id="transactionId" placeholder="Enter the ID from your payment confirmation" />
                               </div>
                            </CardContent>
                          </Card>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <Card className="sticky top-24">
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between text-xs">
                                    <span className="text-muted-foreground truncate max-w-[150px]">{item.quantity} x {item.name}</span>
                                    <span>EGP {(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <Separator />
                        <div className="flex items-end gap-2">
                           <div className="grid flex-grow items-center gap-1.5">
                               <Label htmlFor="coupon-code">Coupon Code</Label>
                               <Input id="coupon-code" placeholder="Enter code" />
                           </div>
                           <Button type="button" variant="outline">
                               <Ticket className="w-4 h-4" />
                               <span className="sr-only">Apply Coupon</span>
                           </Button>
                        </div>

                        <Separator />
                        
                        <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>EGP {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Shipping</span>
                            <span>EGP {shipping.toLocaleString()}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>EGP {total.toLocaleString()}</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isStoreClosed}>
                             {isStoreClosed ? 'Store is temporarily closed' : 'Place Order'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </form>
    </div>
  );
}
