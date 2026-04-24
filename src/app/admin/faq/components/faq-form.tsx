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
import { Switch } from '@/components/ui/switch';
import type { FaqItem } from '@/lib/types';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  question: z.string().min(10, { message: 'Question must be at least 10 characters.' }),
  answer: z.string().min(10, { message: 'Answer must be at least 10 characters.' }),
  isPublished: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface FaqFormProps {
  faq?: FaqItem;
  onSubmit: (values: FormValues, id?: string) => Promise<void>;
  onFinished: () => void;
}

export function FaqForm({ faq, onSubmit, onFinished }: FaqFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: faq?.question || '',
      answer: faq?.answer || '',
      isPublished: faq?.isPublished ?? false,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    await onSubmit(values, faq?.id);
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-6 py-4">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Input placeholder="e.g. What payment methods do you accept?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Answer</FormLabel>
              <FormControl>
                <Textarea placeholder="Provide a clear and concise answer..." {...field} rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Published</FormLabel>
                <FormDescription>
                  If enabled, this FAQ will be visible on the public site.
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
              {faq ? 'Save Changes' : 'Create FAQ'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
