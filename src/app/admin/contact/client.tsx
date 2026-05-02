'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAppContext } from '@/context/app-provider';

const contactFormSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(5),
  location: z.string().min(3),
  workingHours: z.string().min(2),
  workingDays: z.string().min(2),
  storeStatus: z.enum(['open', 'closed']),
  storeMode: z.enum(['online', 'physical']),
  pickupInstructions: z.string(),
  shippingCompany: z.string(),
  shippingPrice: z.coerce.number().min(0),
  googleMapsLink: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactInfoClientPage() {
  const { toast } = useToast();
  const { contactInfo, setContactInfo } = useAppContext();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: contactInfo,
  });

  const watchMode = form.watch('storeMode');

  const onSubmit = (values: ContactFormValues) => {
    setIsSaving(true);
    // Simulate save delay
    setTimeout(() => {
        setContactInfo(values);
        toast({ title: 'Saved!', description: 'Contact information and store status updated.' });
        setIsSaving(false);
    }, 400);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Contact & Store Management</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Manage Public Contact & Store Details</CardTitle>
            <CardDescription>
              Update contact information, store hours, and control your store's operational status.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <Card className="p-4 bg-muted/30">
                  <CardHeader className="p-2">
                      <CardTitle className="text-xl">Store Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 space-y-6">
                      <FormField
                          control={form.control}
                          name="storeStatus"
                          render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-background">
                                  <div className="space-y-0.5">
                                      <FormLabel className="text-base">Store Status</FormLabel>
                                      <FormDescription>
                                          {field.value === 'open' ? 'The store is OPEN. Users can place orders.' : 'The store is CLOSED. Ordering is disabled.'}
                                      </FormDescription>
                                  </div>
                                  <FormControl>
                                      <Switch
                                          checked={field.value === 'open'}
                                          onCheckedChange={(checked) => field.onChange(checked ? 'open' : 'closed')}
                                      />
                                  </FormControl>
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="storeMode"
                          render={({ field }) => (
                             <FormItem className="space-y-3">
                                <FormLabel className="text-base">Store Mode</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0 border p-4 rounded-lg bg-background">
                                      <FormControl><RadioGroupItem value="online" /></FormControl>
                                      <FormLabel className="font-normal cursor-pointer">Online Store</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0 border p-4 rounded-lg bg-background">
                                      <FormControl><RadioGroupItem value="physical" /></FormControl>
                                      <FormLabel className="font-normal cursor-pointer">Physical Store (Pickup Only)</FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                          )}
                      />
                  </CardContent>
              </Card>

              <Card className="p-4">
                  <CardHeader className="p-2">
                      <CardTitle className="text-xl">Shipping & Pickup Details</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="shippingPrice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Shipping Price (EGP)</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormDescription>Standard flat rate for online orders.</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="shippingCompany"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Shipping Company</FormLabel>
                                <FormControl><Input {...field} placeholder="e.g. Aramex, Bosta" /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                      </div>
                      <FormField
                        control={form.control}
                        name="pickupInstructions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pickup Instructions</FormLabel>
                            <FormControl><Textarea {...field} placeholder="e.g. Pickup from our partner location..." /></FormControl>
                            <FormDescription>Visible to users when Store Mode is set to Physical.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </CardContent>
              </Card>

              <Card className="p-4">
                  <CardHeader className="p-2">
                      <CardTitle className="text-xl">Contact Details</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 space-y-6">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Store Location</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input type="email" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="workingDays"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Working Days</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="workingHours"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Working Hours</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                      </div>
                       <FormField
                        control={form.control}
                        name="googleMapsLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Google Maps Embed Link (Optional)</FormLabel>
                            <FormControl><Input {...field} placeholder="https://www.google.com/maps/embed?..." /></FormControl>
                            <FormDescription>Must be an embed URL starting with /embed</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </CardContent>
              </Card>

               <Button type="submit" disabled={isSaving} size="lg" className="w-full md:w-auto">
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
              </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
