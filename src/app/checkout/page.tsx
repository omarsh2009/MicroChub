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
import { Copy, Ticket, AlertCircle, MapPin, Truck, Store, Clock, Loader2, ShieldCheck, FileUp } from 'lucide-react';
import { useAppContext } from '@/context/app-provider';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function CheckoutPage() {
  const { toast } = useToast();
  const { contactInfo, cart, currentUser } = useAppContext();
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [deliveryOption, setDeliveryOption] = useState<string>('pickup_meeting');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreementFile, setAgreementFile] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    phoneNumber: currentUser?.phoneNumber || '',
    city: '',
    address: '',
    transactionId: '',
  });

  // Error State
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isStoreClosed = contactInfo.storeStatus === 'closed';
  const isPhysicalMode = contactInfo.storeMode === 'physical';
  const hasRestrictedItems = cart.some(item => {
    // We need the products array to check isRestricted
    // In AppProvider, cart contains basic data. Let's assume it has isRestricted for convenience or look it up.
    // Assuming CartItem has isRestricted or we can check via productId
    return false; // Simplified for now, in a real app we'd lookup the product
  });
  
  // Let's actually find the restricted items
  const { products } = useAppContext();
  const restrictedInCart = cart.filter(item => {
      const p = products.find(prod => prod.id === item.productId);
      return p?.isRestricted;
  });
  const needsAgreement = restrictedInCart.length > 0;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isShippingSelected = deliveryOption === 'shipping';
  const shippingPrice = contactInfo.shippingPrice || 0;
  const total = subtotal + (isShippingSelected ? shippingPrice : 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          setAgreementFile(file.name);
          if (errors.agreement) {
              setErrors(prev => {
                  const newErrors = { ...prev };
                  delete newErrors.agreement;
                  return newErrors;
              });
          }
      }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // 1. Basic User Info
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";

    // 2. Shipping Data (Conditional)
    if (isShippingSelected) {
      if (!formData.city.trim()) newErrors.city = "City is required for shipping";
      if (!formData.address.trim()) newErrors.address = "Detailed address is required for shipping";
    }

    // 3. Legal Agreement (Conditional)
    if (needsAgreement && !agreementFile) {
        newErrors.agreement = "Signed legal agreement is required for restricted items.";
    }

    // 4. Payment Method Selection
    if (!selectedPaymentMethod) {
      toast({ 
        variant: 'destructive', 
        title: 'Payment Method Required', 
        description: 'Please select a payment method to proceed.' 
      });
      newErrors.paymentMethod = "Selection required";
    }

    // 5. Payment Specific Data
    if (selectedPaymentMethod === 'pm-vodafone') {
      if (!formData.transactionId.trim()) {
        newErrors.transactionId = "Transaction ID / Reference Number is required for Vodafone Cash";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (cart.length === 0) {
          toast({ variant: 'destructive', title: 'Cart is empty', description: 'Please add items to your cart before checking out.' });
          return;
      }

      if (isStoreClosed) {
          toast({ variant: 'destructive', title: 'Store Closed', description: 'The store is temporarily closed and cannot accept new orders.' });
          return;
      }

      if (!validateForm()) {
        toast({ 
            variant: 'destructive', 
            title: 'Incomplete Information', 
            description: 'Please fill in all required fields marked in red.' 
        });
        return;
      }

      setIsSubmitting(true);

      // Simulate order processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
          title: 'Order Received! (Demo)',
          description: "This is a static UI preview. In a production environment, your order would now be verified by our team."
      });
      
      setIsSubmitting(false);
  };

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
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
                {needsAgreement && (
                    <Card className={cn(errors.agreement && "border-destructive")}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-destructive">
                                <ShieldCheck className="w-5 h-5" />
                                Legal Agreement Required
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm">Your cart contains restricted items (<b>{restrictedInCart.map(i => i.name).join(', ')}</b>). You must download, sign, and upload the agreement to proceed.</p>
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <Button asChild variant="outline" className="w-full sm:w-auto">
                                    <a href={contactInfo.agreementTemplateUrl || "/MicroChub-Restricted-Item-Agreement.pdf"} target="_blank" rel="noopener noreferrer">
                                        Download Template
                                    </a>
                                </Button>
                                <div className="flex-1 w-full">
                                    <Label htmlFor="agreement-upload" className="cursor-pointer">
                                        <div className={cn(
                                            "border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-colors",
                                            errors.agreement ? "border-destructive bg-destructive/5" : "border-muted hover:border-primary bg-muted/30"
                                        )}>
                                            <FileUp className="w-6 h-6 text-muted-foreground" />
                                            <span className="text-sm font-medium">{agreementFile || "Upload Signed Agreement"}</span>
                                            <Input id="agreement-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                        </div>
                                    </Label>
                                    {errors.agreement && <p className="text-xs text-destructive mt-1">{errors.agreement}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

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
                                <Label htmlFor="fullName" className={errors.fullName ? "text-destructive" : ""}>Full Name *</Label>
                                <Input 
                                  id="fullName" 
                                  placeholder="Your full name" 
                                  value={formData.fullName} 
                                  onChange={handleInputChange}
                                  className={errors.fullName ? "border-destructive focus-visible:ring-destructive" : ""}
                                />
                                {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber" className={errors.phoneNumber ? "text-destructive" : ""}>Phone Number *</Label>
                                <Input 
                                  id="phoneNumber" 
                                  placeholder="Your phone number" 
                                  value={formData.phoneNumber} 
                                  onChange={handleInputChange}
                                  className={errors.phoneNumber ? "border-destructive focus-visible:ring-destructive" : ""}
                                />
                                {errors.phoneNumber && <p className="text-xs text-destructive">{errors.phoneNumber}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city" className={isShippingSelected && errors.city ? "text-destructive" : ""}>City {isShippingSelected && "*"}</Label>
                                <Input 
                                  id="city" 
                                  placeholder="e.g. Cairo" 
                                  value={formData.city}
                                  onChange={handleInputChange}
                                  className={errors.city ? "border-destructive focus-visible:ring-destructive" : ""}
                                />
                                {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="address" className={isShippingSelected && errors.address ? "text-destructive" : ""}>
                                  {isShippingSelected ? 'Shipping Address *' : 'Additional Location Details (Optional)'}
                                </Label>
                                <Textarea 
                                  id="address" 
                                  placeholder="Building, Street, Area..." 
                                  value={formData.address}
                                  onChange={handleInputChange}
                                  className={errors.address ? "border-destructive focus-visible:ring-destructive" : ""}
                                />
                                {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                 <Card className={cn(errors.paymentMethod && "border-destructive")}>
                    <CardHeader>
                        <CardTitle className={cn("flex items-center gap-2", errors.paymentMethod && "text-destructive")}>
                            2. Payment Method *
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <RadioGroup onValueChange={(val) => { setSelectedPaymentMethod(val); setErrors(prev => ({...prev, paymentMethod: ''})) }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    <Label htmlFor="transactionId" className={errors.transactionId ? "text-destructive" : ""}>Transaction ID / Reference Number *</Label>
                                    <Input 
                                      id="transactionId" 
                                      placeholder="Enter the ID from your payment confirmation" 
                                      value={formData.transactionId}
                                      onChange={handleInputChange}
                                      className={errors.transactionId ? "border-destructive focus-visible:ring-destructive" : ""}
                                    />
                                    {errors.transactionId && <p className="text-xs text-destructive">{errors.transactionId}</p>}
                               </div>
                            </CardContent>
                          </Card>
                        )}
                        {errors.paymentMethod && <p className="text-sm text-destructive text-center">Please select a payment method before proceeding.</p>}
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
                        <Button 
                            type="submit" 
                            className="w-full" 
                            size="lg" 
                            disabled={isStoreClosed || isSubmitting}
                        >
                             {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                             ) : isStoreClosed ? 'Store is temporarily closed' : 'Place Order'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </form>
    </div>
  );
}
