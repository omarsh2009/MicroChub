'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { useUser, useFirestore, useStorage } from '@/firebase';
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
import { Loader2, UploadCloud, Copy } from 'lucide-react';
import { createOrder } from '@/lib/orders';
import { products } from '@/lib/data';
import { getPaymentMethods } from '@/lib/admin';
import type { PaymentMethod } from '@/lib/types';

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
  legalAgreement: z.custom<FileList>().optional(),
});

type CheckoutFormValues = z.infer<typeof formSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { cart, totalPrice, clearCart } = useCart();
  const user = useUser();
  const firestore = useFirestore();
  const storage = useStorage();

  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);

  useEffect(() => {
    if (firestore) {
      getPaymentMethods(firestore).then(methods => {
        setPaymentMethods(methods.filter(m => m.enabled));
      });
    }
  }, [firestore]);

  const hasRestrictedItem = useMemo(() => {
    return cart.some(item => {
      const product = products.find(p => p.id === item.productId);
      return product?.isRestricted;
    });
  }, [cart]);

  const dynamicFormSchema = useMemo(() => {
    if (hasRestrictedItem) {
      return formSchema.extend({
        legalAgreement: z
          .custom<FileList>()
          .refine((files) => files?.length === 1, 'Signed legal agreement is required.')
          .refine((files) => files?.[0]?.size <= 5 * 1024 * 1024, `Max file size is 5MB.`)
      });
    }
    return formSchema;
  }, [hasRestrictedItem]);


  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(dynamicFormSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      address: '',
      city: '',
      notes: '',
      transactionId: '',
    },
  });
  
  useEffect(() => {
    if (user === undefined) return;
    if (user === null) {
      toast({ variant: 'destructive', title: 'Not Logged In', description: 'Please log in to proceed to checkout.' });
      router.push('/login?redirect=/checkout');
    } else {
        form.setValue('fullName', user.profile?.name || '');
        form.setValue('phoneNumber', user.profile?.phoneNumber || '');
    }
  }, [user, router, toast, form]);

  useEffect(() => {
    if (user !== undefined && cart.length === 0) {
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

  async function onSubmit(values: CheckoutFormValues) {
    if (!firestore || !storage || !user || !selectedPaymentMethod) {
        toast({ variant: 'destructive', title: 'Initialization Error', description: 'Services not ready or payment method not selected. Please try again.' });
        return;
    }
    setIsLoading(true);
    try {
        await createOrder(firestore, storage, {
            userId: user.uid,
            cart,
            totalPrice,
            notes: values.notes,
            shippingAddress: {
              fullName: values.fullName,
              phoneNumber: values.phoneNumber,
              address: values.address,
              city: values.city,
            },
            paymentMethod: selectedPaymentMethod,
            transactionId: values.transactionId,
            hasRestrictedItem,
            legalAgreementFile: values.legalAgreement?.[0],
        });

        toast({ title: 'Order Placed!', description: 'Your order has been received and is pending verification.' });
        clearCart();
        router.push('/orders');

    } catch (error: any) {
        console.error('Order creation failed:', error);
        toast({ variant: 'destructive', title: 'Order Failed', description: error.message || 'Could not place your order.' });
    } finally {
        setIsLoading(false);
    }
  }
  
  if (user === undefined || cart.length === 0) {
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
                                <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl><Input placeholder="Your phone number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={form.control} name="city" render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl><Input placeholder="e.g. Cairo" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Address</FormLabel>
                                <FormControl><Textarea placeholder="Your full street address" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="notes" render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Order Notes (Optional)</FormLabel>
                                <FormControl><Textarea placeholder="Any special instructions for your order?" {...field} /></FormControl>
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
                                          <Input placeholder="Enter the ID from your payment confirmation" {...field} />
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
                        <CardHeader><CardTitle>3. Legal Documents</CardTitle></CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="legalAgreement"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Signed Legal Agreement</FormLabel>
                                        <FormDescription>
                                            Please upload the signed legal agreement for the restricted item(s) in your cart.
                                        </FormDescription>
                                        <FormControl>
                                            <div className="flex items-center justify-center w-full">
                                                <label htmlFor="legal-dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                        <p className="text-xs text-muted-foreground">{field.value?.[0]?.name || 'PDF, PNG, JPG (MAX. 5MB)'}</p>
                                                    </div>
                                                    <Input id="legal-dropzone-file" type="file" className="hidden" onChange={(e) => field.onChange(e.target.files)} />
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
                    <CardContent className="space-y-2">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between items-start text-sm">
                                <div>
                                    <p className="font-medium">{item.name} <span className="text-muted-foreground">x{item.quantity}</span></p>
                                    {Object.entries(item.configuration).map(([group, option]) => (
                                        <p key={group} className="text-xs text-muted-foreground pl-2">{group}: {Array.isArray(option) ? option.join(', '): option}</p>
                                    ))}
                                </div>
                                <p className="font-medium">EGP {(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>EGP {totalPrice.toLocaleString()}</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
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
