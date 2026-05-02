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
import { Copy, Ticket, AlertCircle, MapPin, Truck, Store, Clock } from 'lucide-react';
import { useAppContext } from '@/context/app-provider';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function CheckoutPage() {
  const { toast } = useToast();
  const { contactInfo, cart, currentUser } = useAppContext();
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [deliveryOption, setDeliveryOption] = useState<string>('pickup_meeting');

  const isStoreClosed = contactInfo.storeStatus === 'closed';
  const isOnlineMode = contactInfo.storeMode === 'online';
  const isPhysicalMode = contactInfo.storeMode === 'physical';

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isShippingSelected = deliveryOption === 'shipping';
  const shippingPrice = contactInfo.shippingPrice || 0;
  const total = subtotal + (isShippingSelected ? shippingPrice : 0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
  };
  
  const handlePlaceOrder = () => {
      if (cart.length === 0) {
          toast({ variant: 'destructive', title: 'Cart is empty', description: 'Please add items to your cart before checking out.' });
          return;
      }
      if (isShippingSelected && !contactInfo.shippingCompany) {
          toast({ variant: 'destructive', title: 'Shipping Error', description: 'Shipping is currently unavailable. Please choose another option.' });
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
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Truck className="w-5 h-5 text-primary" />
                            1. Delivery & Pickup Options
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <RadioGroup 
                          onValueChange={setDeliveryOption} 
                          defaultValue={deliveryOption} 
                          className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                            {isPhysicalMode && (
                                <Label 
                                  htmlFor="pickup_store" 
                                  className={cn(
                                    "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground text-center gap-2",
                                    deliveryOption === 'pickup_store' && "border-primary bg-accent"
                                  )}
                                >
                                    <RadioGroupItem value="pickup_store" id="pickup_store" className="sr-only" />
                                    <Store className="w-5 h-5" />
                                    <span className="font-bold">Pickup from Store</span>
                                </Label>
                            )}
                            <Label 
                              htmlFor="pickup_meeting" 
                              className={cn(
                                "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground text-center gap-2",
                                deliveryOption === 'pickup_meeting' && "border-primary bg-accent"
                              )}
                            >
                                <RadioGroupItem value="pickup_meeting" id="pickup_meeting" className="sr-only" />
                                <MapPin className="w-5 h-5" />
                                <span className="font-bold">Meeting Point</span>
                            </Label>
                            <Label 
                              htmlFor="shipping" 
                              className={cn(
                                "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground text-center gap-2",
                                deliveryOption === 'shipping' && "border-primary bg-accent"
                              )}
                            >
                                <RadioGroupItem value="shipping" id="shipping" className="sr-only" />
                                <Truck className="w-5 h-5" />
                                <span className="font-bold">Shipping</span>
                            </Label>
                        </RadioGroup>

                        {/* Detail Cards */}
                        {deliveryOption === 'pickup_store' && (
                            <div className="p-4 bg-muted/50 rounded-lg border space-y-2">
                                <div className="flex items-center gap-2 font-bold text-sm">
                                    <MapPin className="w-4 h-4 text-primary" /> Location
                                </div>
                                <p className="text-sm text-muted-foreground">{contactInfo.location}</p>
                                <div className="flex items-center gap-2 font-bold text-sm pt-2">
                                    <Clock className="w-4 h-4 text-primary" /> Hours
                                </div>
                                <p className="text-sm text-muted-foreground">{contactInfo.workingDays}, {contactInfo.workingHours}</p>
                            </div>
                        )}

                        {deliveryOption === 'pickup_meeting' && (
                            <div className="p-4 bg-muted/50 rounded-lg border space-y-2">
                                <div className="flex items-center gap-2 font-bold text-sm">
                                    <AlertCircle className="w-4 h-4 text-primary" /> Pickup Instructions
                                </div>
                                <p className="text-sm text-muted-foreground">{contactInfo.pickupInstructions || "We will coordinate a meeting point with you after the order is placed."}</p>
                            </div>
                        )}

                        {deliveryOption === 'shipping' && (
                            <div className="p-4 bg-muted/50 rounded-lg border space-y-2">
                                <div className="flex items-center gap-2 font-bold text-sm">
                                    <Truck className="w-4 h-4 text-primary" /> Shipping via {contactInfo.shippingCompany || "Aramex"}
                                </div>
                                <p className="text-sm text-muted-foreground">Standard flat rate: <strong>EGP {shippingPrice}</strong></p>
                                <p className="text-xs text-muted-foreground">Delivery usually takes 2-5 business days.</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName" placeholder="Your full name" defaultValue={currentUser?.name || ""} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input id="phoneNumber" placeholder="Your phone number" defaultValue={currentUser?.phoneNumber || ""} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" placeholder="e.g. Cairo" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="address">{deliveryOption === 'shipping' ? 'Shipping Address' : 'Additional Location Details (Optional)'}</Label>
                                <Textarea id="address" placeholder="Building, Street, Area..." />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader><CardTitle>2. Payment Method</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <RadioGroup onValueChange={setSelectedPaymentMethod} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Label htmlFor="pm-vodafone" className={cn("flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground", selectedPaymentMethod === 'pm-vodafone' && "border-primary bg-accent")}>
                                <RadioGroupItem value="pm-vodafone" id="pm-vodafone" className="sr-only" />
                                Vodafone Cash
                            </Label>
                            <Label htmlFor="pm-cod" className={cn("flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground", selectedPaymentMethod === 'pm-cod' && "border-primary bg-accent")}>
                                <RadioGroupItem value="pm-cod" id="pm-cod" className="sr-only" />
                                Cash on Delivery
                            </Label>
                        </RadioGroup>

                        {selectedPaymentMethod === 'pm-vodafone' && (
                          <Card className="bg-muted/50 border-primary/20">
                            <CardHeader>
                              <CardTitle className="text-lg">Pay with Vodafone Cash</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <p className="text-sm">Send the total amount to this number and enter the transaction ID.</p>
                              <div className="flex items-center gap-2 rounded-md bg-background p-3 border">
                                <strong className="text-sm">Number:</strong>
                                <span className="font-mono flex-1 truncate">{contactInfo.phone}</span>
                                <Button type="button" size="icon" variant="ghost" onClick={() => copyToClipboard(contactInfo.phone)}>
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
                            <span>Shipping / Delivery</span>
                            <span className={cn(isShippingSelected ? "text-foreground font-medium" : "text-muted-foreground")}>
                                {isShippingSelected ? `EGP ${shippingPrice.toLocaleString()}` : 'Free'}
                            </span>
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
