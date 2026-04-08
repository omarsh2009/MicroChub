'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/lib/types';
import { Loader2, Sparkles } from 'lucide-react';
import { adminProductDescriptionGenerator } from '@/ai/flows/admin-product-description-generator';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  category: z.string().min(2, { message: 'Category is required.' }),
  price: z.coerce.number().positive(),
  technicalSpecs: z.string().min(10, { message: 'Please provide some technical specs.' }),
  description: z.string().optional(),
});

export function ProductForm({
  product,
  onFinished,
}: {
  product?: Product;
  onFinished: () => void;
}) {
  const { toast } = useToast();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || '',
      category: product?.category || '',
      price: product?.price || 0,
      technicalSpecs: product ? Object.entries(product.specs).map(([k, v]) => `${k}: ${v}`).join('\n') : '',
      description: product?.description || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: `Product ${product ? 'Updated' : 'Created'}`,
      description: `${values.name} has been saved. (This is a demo)`,
    });
    onFinished();
  }

  async function handleGenerateDescription() {
    const { name, category, technicalSpecs } = form.getValues();
    if (!name || !category || !technicalSpecs) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill out Name, Category, and Technical Specs to generate a description.',
      });
      return;
    }
    setIsAiLoading(true);
    try {
      const result = await adminProductDescriptionGenerator({
        productName: name,
        category,
        technicalSpecs,
      });
      if (result.productDescription) {
        form.setValue('description', result.productDescription);
        toast({
          title: 'Description Generated!',
          description: 'The AI has written a product description for you.',
        });
      }
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Could not generate a description. Please try again.',
      });
    } finally {
      setIsAiLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Mochi v5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Mochi & Co." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (EGP)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="technicalSpecs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technical Specs</FormLabel>
              <FormControl>
                <Textarea placeholder="MCU: ESP32-S3&#10;Connectivity: Wi-Fi" {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center justify-between">
                <span>Description</span>
                <Button variant="ghost" size="sm" type="button" onClick={handleGenerateDescription} disabled={isAiLoading}>
                  {isAiLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate with AI
                </Button>
              </FormLabel>
              <FormControl>
                <Textarea placeholder="A versatile, customizable hardware companion..." {...field} rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-4">
          {product ? 'Save Changes' : 'Create Product'}
        </Button>
      </form>
    </Form>
  );
}
