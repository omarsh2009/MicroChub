'use client';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { PaymentMethod } from '@/lib/types';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name is required.' }),
  type: z.enum(['phoneNumber', 'username', 'paymentLink']),
  value: z.string().min(2, { message: 'Value is required.' }),
  instructions: z.string().optional(),
  enabled: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface PaymentMethodFormProps {
  method?: PaymentMethod;
  onSubmit: (values: FormValues, id?: string) => Promise<void>;
  onFinished: () => void;
}

export function PaymentMethodForm({ method, onSubmit, onFinished }: PaymentMethodFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: method?.name || '',
      type: method?.type || 'phoneNumber',
      value: method?.value || '',
      instructions: method?.instructions || '',
      enabled: method?.enabled ?? true,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    await onSubmit(values, method?.id);
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-6 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Method Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Instapay" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="phoneNumber">Phone Number</SelectItem>
                    <SelectItem value="username">Username</SelectItem>
                    <SelectItem value="paymentLink">Payment Link</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 01234567890 or @username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g. 'Send to this number and enter the transaction ID below.'" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Enabled</FormLabel>
                <FormDescription>
                  If disabled, this method will not be shown at checkout.
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onFinished}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {method ? 'Save Changes' : 'Create Method'}
            </Button>
        </div>
      </form>
    </Form>
  );
}

    