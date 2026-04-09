'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, useFormContext } from 'react-hook-form';
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
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/lib/types';
import { Loader2, Sparkles, PlusCircle, Trash2 } from 'lucide-react';
import { adminProductDescriptionGenerator } from '@/ai/flows/admin-product-description-generator';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const customizationOptionSchema = z.object({
  name: z.string().min(1, 'Option name is required.'),
  priceAdjustment: z.coerce.number().default(0),
});

const customizationGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required.'),
  type: z.enum(['single', 'multi']),
  required: z.boolean().default(false),
  options: z.array(customizationOptionSchema).min(1, 'At least one option is required.'),
});

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  category: z.string().min(2, { message: 'Category is required.' }),
  price: z.coerce.number().positive(),
  technicalSpecs: z.string().min(10, { message: 'Please provide some technical specs.' }),
  description: z.string().optional(),
  isRestricted: z.boolean().optional(),
  customizationGroups: z.array(customizationGroupSchema).optional(),
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
      isRestricted: product?.isRestricted || false,
      customizationGroups: product?.customizationGroups || [],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "customizationGroups"
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-4 max-h-[75vh] overflow-y-auto pr-4">
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
                <FormLabel>Base Price (EGP)</FormLabel>
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

        <FormField
          control={form.control}
          name="isRestricted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Restricted Product
                </FormLabel>
                <FormDescription>
                  Requires user to upload a signed legal agreement at checkout.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />


        <Card>
            <CardHeader>
                <CardTitle>Product Customizations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {fields.map((group, groupIndex) => (
                    <Card key={group.id} className="p-4 bg-muted/30">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-grow space-y-4">
                                <FormField
                                control={form.control}
                                name={`customizationGroups.${groupIndex}.name`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Group Name</FormLabel>
                                        <FormControl><Input {...field} placeholder="e.g. Case Color" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name={`customizationGroups.${groupIndex}.type`}
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Selection Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="single">Single Choice</SelectItem>
                                                <SelectItem value="multi">Multiple Choice</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`customizationGroups.${groupIndex}.required`}
                                    render={({ field }) => (
                                    <FormItem className="flex flex-col justify-end">
                                        <div className="flex flex-row items-center space-x-2 h-10">
                                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            <FormLabel>Required</FormLabel>
                                        </div>
                                    </FormItem>
                                    )}
                                />
                                </div>
                                <OptionFieldArray groupIndex={groupIndex} />
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => remove(groupIndex)} className="mt-2"><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        </div>
                    </Card>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => append({ name: '', type: 'single', required: false, options: [{name: '', priceAdjustment: 0}] })}
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Customization Group
                </Button>
            </CardContent>
        </Card>
        
        <Button type="submit" className="mt-4">
          {product ? 'Save Changes' : 'Create Product'}
        </Button>
      </form>
    </Form>
  );
}

function OptionFieldArray({ groupIndex }: { groupIndex: number }) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `customizationGroups.${groupIndex}.options`
  });

  return (
    <div className="space-y-2">
      <FormLabel>Options</FormLabel>
      {fields.map((option, optionIndex) => (
        <div key={option.id} className="flex items-end gap-2">
          <FormField
            control={control}
            name={`customizationGroups.${groupIndex}.options.${optionIndex}.name`}
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl><Input {...field} placeholder="Option Name" /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`customizationGroups.${groupIndex}.options.${optionIndex}.priceAdjustment`}
            render={({ field }) => (
              <FormItem>
                <FormControl><Input type="number" {...field} placeholder="Price Adj." /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant="ghost" size="icon" onClick={() => remove(optionIndex)}><Trash2 className="h-4 w-4"/></Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => append({ name: '', priceAdjustment: 0 })}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Option
      </Button>
    </div>
  )
}
