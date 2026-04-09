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
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud } from 'lucide-react';
import { createOrder } from '@/lib/orders';
import { products } from '@/lib/data';

const formSchema = z.object({
  phoneNumber: z.string().min(10, 'Please enter a valid phone number.'),
  notes: z.string().optional(),
  paymentMethod: z.enum(['instapay', 'telda'], {
    required_error: 'You need to select a payment method.',
  }),
  paymentProof: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, 'Payment proof is required.')
    .refine((files) => files?.[0]?.size <= 5 * 1024 * 1024, `Max file size is 5MB.`)
    .refine(
      (files) => ['image/jpeg', 'image/png', 'image/gif'].includes(files?.[0]?.type),
      'Only .jpg, .png, and .gif formats are supported.'
    ),
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
      phoneNumber: '',
      notes: '',
    },
  });
  
  useEffect(() => {
    if (user === undefined) return; // Wait for user state to be determined
    if (user === null) {
      toast({ variant: 'destructive', title: 'Not Logged In', description: 'Please log in to proceed to checkout.' });
      router.push('/login?redirect=/checkout');
    } else {
        form.setValue('phoneNumber', user.profile?.phoneNumber || '');
    }
  }, [user, router, toast, form]);

  useEffect(() => {
    if (user !== undefined && cart.length === 0) {
      toast({ title: 'Your cart is empty', description: 'Redirecting you to the products page.' });
      router.push('/products');
    }
  }, [cart, user, router, toast]);

  async function onSubmit(values: CheckoutFormValues) {
    if (!firestore || !storage || !user) {
        toast({ variant: 'destructive', title: 'Initialization Error', description: 'Services not ready. Please try again.' });
        return;
    }
    setIsLoading(true);
    try {
        await createOrder(firestore, storage, {
            userId: user.uid,
            cart,
            totalPrice,
            notes: values.notes,
            paymentProofFile: values.paymentProof[0],
            phoneNumber: values.phoneNumber,
            paymentMethod: values.paymentMethod,
            hasRestrictedItem,
            legalAgreementFile: values.legalAgreement?.[0],
        });

        toast({ title: 'Order Placed!', description: 'Your order has been received and is pending review.' });
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
                    <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle>Payment</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                         <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>Payment Method</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                    >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="instapay" /></FormControl>
                                        <FormLabel className="font-normal">Instapay</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="telda" /></FormControl>
                                        <FormLabel className="font-normal">Telda</FormLabel>
                                    </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="paymentProof"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Proof Screenshot</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center justify-center w-full">
                                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                    <p className="text-xs text-muted-foreground">{field.value?.[0]?.name || 'PNG, JPG or GIF (MAX. 5MB)'}</p>
                                                </div>
                                                <Input id="dropzone-file" type="file" className="hidden" onChange={(e) => field.onChange(e.target.files)} />
                                            </label>
                                        </div> 
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                {hasRestrictedItem && (
                    <Card>
                        <CardHeader><CardTitle>Legal Documents</CardTitle></CardHeader>
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

                <Card>
                    <CardHeader><CardTitle>Additional Notes</CardTitle></CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Order Notes (Optional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder="Any special instructions for your order?"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
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
