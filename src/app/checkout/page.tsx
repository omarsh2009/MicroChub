
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { useUser } from '@/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, Copy, Ticket } from 'lucide-react';
import { createOrder } from '@/lib/services/orders';
import { getProducts } from '@/lib/services/products';
import { getPaymentMethods } from '@/lib/services/payment-methods';
import type { PaymentMethod, Coupon, Product } from '@/lib/types';
import { validateCoupon } from '@/lib/services/coupons';


const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];

const formSchema = z.object({
  fullName: z.string().min(3, 'Please enter your full name.'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number.'),
  address: z.string().min(10, 'Please enter a valid address.'),
  city: z.string().min(3, 'Please enter your city.'),
  notes: z.string().optional(),
  paymentMethodId: z.string({
    required_error: 'You need to select a payment method.',
  }),
  transactionId: z.string().min(4, 'Please enter a valid transaction ID.'),
  legalAgreement: z.any().optional(),
});

type CheckoutFormValues = z.infer<typeof formSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { cart, totalPrice, clearCart } = useCart();
  const user = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(({ data }) => setProducts(data || []));
    getPaymentMethods().then(({ data }) => {
      setPaymentMethods((data || []).filter(m => m.enabled));
    });
  }, []);
  
  const hasRestrictedItem = useMemo(() => {
    return cart.some(item => {
      const product = products.find(p => p.id === item.productId);
      return product?.isRestricted;
    });
  }, [cart, products]);
  
  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'fixed') {
      return appliedCoupon.value;
    }
    if (appliedCoupon.type === 'percentage') {
      return totalPrice * (appliedCoupon.value / 100);
    }
    return 0;
  }, [appliedCoupon, totalPrice]);

  const finalPrice = useMemo(() => {
      const priceAfterDiscount = totalPrice - discountAmount;
      return priceAfterDiscount > 0 ? priceAfterDiscount : 0;
  }, [totalPrice, discountAmount]);


  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      address: '',
      city: '',
      notes: '',
      paymentMethodId: '',
      transactionId: '',
    },
  });
  
  useEffect(() => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Not Logged In', description: 'Please log in to proceed to checkout.' });
      router.push('/login?redirect=/checkout');
    } else {
        form.setValue('fullName', user.profile?.name || '');
        form.setValue('phoneNumber', user.profile?.phoneNumber || '');
    }
  }, [user, router, toast, form]);

  useEffect(() => {
    if (user && cart.length === 0) {
      toast({ title: 'Your cart is empty', description: 'Redirecting you to the products page.' });
      router.push('/products');
    }
  }, [cart, user, router, toast]);

  useEffect(() => {
    const paymentMethodId = form.watch('paymentMethodId');
    const method = paymentMethods.find(m => m.id === paymentMethodId) || null;
    setSelectedPaymentMethod(method);
  }, [form.watch('paymentMethodId'), paymentMethods]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
  };
  
  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsApplyingCoupon(true);
    setAppliedCoupon(null); // Clear previous coupon
    const { data, error } = await validateCoupon(couponCode);
    
    if (error || !data) {
        toast({ variant: 'destructive', title: 'Coupon Invalid', description: error?.message });
        setAppliedCoupon(null);
    } else {
        setAppliedCoupon(data);
        toast({ title: 'Coupon Applied!', description: `Discount of ${data.type === 'fixed' ? `EGP ${data.value}` : `${data.value}%`} applied.`});
    }
    setIsApplyingCoupon(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      form.setValue('legalAgreement', e.target.files);
    }
  };

  async function onSubmit(values: CheckoutFormValues) {
    if (!user || !selectedPaymentMethod) {
        toast({ variant: 'destructive', title: 'Initialization Error', description: 'User or payment method not selected. Please try again.' });
        return;
    }
    
    const legalAgreementFile = values.legalAgreement?.[0];

    if (hasRestrictedItem && !legalAgreementFile) {
        toast({ variant: 'destructive', title: 'Missing File', description: 'A signed legal agreement is required for restricted items.' });
        form.setError('legalAgreement', { type: 'manual', message: 'A signed agreement is required.'})
        return;
    }

    setIsLoading(true);

    const { data, error } = await createOrder({
        cart,
        totalPrice: finalPrice,
        notes: values.notes,
        shippingAddress: {
          fullName: values.fullName,
          phoneNumber: values.phoneNumber,
          address: values.address,
          city: values.city,
        },
        paymentMethod: selectedPaymentMethod,
        transactionId: values.transactionId,
        requiresLegalApproval: hasRestrictedItem,
        legalAgreementFile: legalAgreementFile,
        couponCode: appliedCoupon?.code,
        discountAmount: discountAmount,
    });

    if (error || !data) {
        console.error('Order submission error:', error?.message);
        toast({ variant: 'destructive', title: 'Order Failed', description: error?.message || 'Could not place your order.' });
    } else {
        toast({ title: 'Order Placed!', description: 'Your order has been received and is pending verification.' });
        clearCart();
        router.push('/orders');
    }

    setIsLoading(false);
  }
  
  if (!user || cart.length === 0) {
    return <div className="container flex justify-center items-center py-20"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
  }

  return (
    <div className="container py-12 px-4 md:px-6">
      <h1 className="font-headline text-4xl font-bold tracking-tighter mb-8">Checkout</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader><CardTitle>1. Shipping Address</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="fullName" render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Full Name</FormLabel>
                                <FormControl><Input placeholder="Your full name" {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl><Input placeholder="Your phone number" {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={form.control} name="city" render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl><Input placeholder="e.g. Cairo" {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Address</FormLabel>
                                <FormControl><Textarea placeholder="Your full street address" {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="notes" render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Order Notes (Optional)</FormLabel>
                                <FormControl><Textarea placeholder="Any special instructions for your order?" {...field} value={field.value || ''}/></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader><CardTitle>2. Payment Method</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                         <FormField
                            control={form.control}
                            name="paymentMethodId"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                  <FormLabel>Select a payment method</FormLabel>
                                  <FormControl>
                                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {paymentMethods.map(method => (
                                          <FormItem key={method.id}>
                                            <FormControl>
                                              <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                                            </FormControl>
                                            <Label htmlFor={method.id} className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground ${field.value === method.id ? 'border-primary' : ''}`}>
                                              {method.name}
                                            </Label>
                                          </FormItem>
                                        ))}
                                      </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                            )}
                        />
                        {selectedPaymentMethod && (
                          <Card className="bg-muted/50">
                            <CardHeader>
                              <CardTitle className="text-lg">Pay with {selectedPaymentMethod.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <p className="text-sm">{selectedPaymentMethod.instructions}</p>
                              <div className="flex items-center gap-2 rounded-md bg-background p-3">
                                <strong className="text-sm">{selectedPaymentMethod.type === 'phoneNumber' ? 'Number:' : 'Link:'}</strong>
                                <span className="font-mono flex-1 truncate">{selectedPaymentMethod.value}</span>
                                <Button type="button" size="icon" variant="ghost" onClick={() => copyToClipboard(selectedPaymentMethod.value)}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                               <FormField
                                  control={form.control}
                                  name="transactionId"
                                  render={({ field }) => (
                                      <FormItem>
                                      <FormLabel>Transaction ID / Reference Number</FormLabel>
                                      <FormControl>
                                          <Input placeholder="Enter the ID from your payment confirmation" {...field} value={field.value || ''} />
                                      </FormControl>
                                      <FormMessage />
                                      </FormItem>
                                  )}
                              />
                            </CardContent>
                          </Card>
                        )}
                    </CardContent>
                </Card>

                {hasRestrictedItem && (
                    <Card>
                        <CardHeader>
                          <CardTitle>3. Legal Documents</CardTitle>
                          <CardDescription>
                            Your order contains a restricted item. Please download the agreement, sign it, and upload the completed file.
                             <Button variant="link" asChild className="p-0 h-auto ml-1 text-inherit hover:underline">
                                <a href="/MicroChub-Restricted-Item-Agreement.pdf" target="_blank" rel="noopener noreferrer" download>Download Agreement</a>
                            </Button>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="legalAgreement"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Upload Signed Legal Agreement</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center justify-center w-full">
                                                <label htmlFor="legal-dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                        <p className="text-xs text-muted-foreground">{form.watch('legalAgreement')?.[0]?.name || 'PDF, PNG, JPG, WEBP (MAX. 5MB)'}</p>
                                                    </div>
                                                    <Input
                                                      id="legal-dropzone-file"
                                                      type="file"
                                                      className="hidden"
                                                      accept={ACCEPTED_FILE_TYPES.join(',')}
                                                      onChange={handleFileChange}
                                                    />
                                                </label>
                                            </div> 
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                )}
            </div>
            <div className="lg:col-span-1">
                <Card className="sticky top-24">
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-end gap-2">
                           <div className="grid flex-grow items-center gap-1.5">
                               <Label htmlFor="coupon-code">Coupon Code</Label>
                               <Input id="coupon-code" placeholder="Enter code" value={couponCode} onChange={e => setCouponCode(e.target.value)} />
                           </div>
                           <Button type="button" variant="outline" onClick={handleApplyCoupon} disabled={isApplyingCoupon}>
                               {isApplyingCoupon ? <Loader2 className="animate-spin" /> : <Ticket />}
                               <span className="sr-only">Apply Coupon</span>
                           </Button>
                        </div>

                        <Separator />
                        
                        <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>EGP {totalPrice.toLocaleString()}</span>
                        </div>
                        {appliedCoupon && (
                            <div className="flex justify-between text-sm text-primary">
                                <span>Discount ({appliedCoupon.code})</span>
                                <span>- EGP {discountAmount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm">
                            <span>Shipping</span>
                            <span className="text-muted-foreground">Calculated at checkout</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>EGP {finalPrice.toLocaleString()}</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" size="lg" disabled={isLoading || !form.formState.isValid}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Place Order
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </form>
      </Form>
    </div>
  );
}
