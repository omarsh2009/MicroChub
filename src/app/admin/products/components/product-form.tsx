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
import { Product, Category } from '@/lib/types';
import { PlusCircle, Trash2, Check, ChevronsUpDown } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const customizationOptionSchema = z.object({
  name: z.string().min(1, 'Option name is required.'),
  priceAdjustment: z.coerce.number().default(0),
  requestQuote: z.boolean().default(false),
});

const customizationGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required.'),
  type: z.enum(['single', 'multi']),
  required: z.boolean().default(false),
  options: z.array(customizationOptionSchema).min(1, 'At least one option is required.'),
});

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  categoryIds: z.array(z.string()).min(1, { message: 'At least one category is required.' }),
  price: z.coerce.number().positive(),
  technicalSpecs: z.string().min(10, { message: 'Please provide some technical specs.' }),
  description: z.string().optional(),
  isRestricted: z.boolean().optional(),
  customizationGroups: z.array(customizationGroupSchema).optional(),
  productType: z.enum(['ready', 'build_to_order']).default('build_to_order'),
  image: z.string().optional(),
  discountType: z.enum(['fixed', 'percentage', 'none']).optional(),
  discountValue: z.coerce.number().optional(),
});

export function ProductForm({
  product,
  categories,
  onFinished,
}: {
  product?: Product;
  categories: Category[];
  onFinished: () => void;
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || '',
      categoryIds: product?.categoryIds || [],
      price: product?.price || 0,
      technicalSpecs: product ? Object.entries(product.specs).map(([k, v]) => `${k}: ${v}`).join('\n') : '',
      description: product?.description || '',
      isRestricted: product?.isRestricted || false,
      customizationGroups: product?.customizationGroups || [],
      productType: product?.productType || 'build_to_order',
      image: product?.image || '',
      discountType: product?.discountType || 'none',
      discountValue: product?.discountValue || 0,
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "customizationGroups"
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        form.setValue('image', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form Submitted (Demo):", values);
    onFinished();
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
                <Input placeholder="e.g. Mochi v5" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Price (EGP)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value ?? 0} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="productType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || 'build_to_order'}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="build_to_order">Build-to-Order</SelectItem>
                        <SelectItem value="ready">Ready (In Stock)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
        </div>
         <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="discountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Type (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || 'none'}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="No Discount" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No Discount</SelectItem>
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="fixed">Fixed Amount (EGP)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="discountValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Value (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value ?? 0}  onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
        </div>

        <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                    <Input type="file" accept="image/*" onChange={handleFileChange} />
                </FormControl>
                {imagePreview && (
                    <div className="mt-4">
                        <Image src={imagePreview} alt="Image Preview" width={100} height={100} className="rounded-md object-cover" />
                    </div>
                )}
                <FormMessage />
                </FormItem>
            )}
            />

        <FormField
          control={form.control}
          name="categoryIds"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Categories</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !(field.value && field.value.length > 0) && "text-muted-foreground"
                      )}
                    >
                      {field.value && field.value.length > 0
                        ? `${field.value.length} categor${field.value.length > 1 ? 'ies' : 'y'} selected`
                        : "Select categories"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search categories..." />
                    <CommandEmpty>No categories found.</CommandEmpty>
                    <CommandGroup>
                      {categories.map((category) => (
                        <CommandItem
                          key={category.id}
                          onSelect={() => {
                            const selected = field.value || [];
                            const isSelected = selected.includes(category.id);
                            const newValue = isSelected
                              ? selected.filter((id) => id !== category.id)
                              : [...selected, category.id];
                            field.onChange(newValue);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              (field.value || []).includes(category.id) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {category.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="technicalSpecs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technical Specs</FormLabel>
              <FormControl>
                <Textarea placeholder="MCU: ESP32-S3&#10;Connectivity: Wi-Fi" {...field} rows={4} value={field.value || ''} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A versatile, customizable hardware companion..." {...field} rows={5} value={field.value || ''} />
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
                    onClick={() => append({ name: '', type: 'single', required: false, options: [{name: '', priceAdjustment: 0, requestQuote: false}] })}
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Customization Group
                </Button>
            </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2 pt-4">
             <Button type="button" variant="outline" onClick={onFinished}>Cancel</Button>
            <Button type="submit">
                {product ? 'Save Changes' : 'Create Product'}
            </Button>
        </div>
      </form>
    </Form>
  );
}

function OptionFieldArray({ groupIndex }: { groupIndex: number }) {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `customizationGroups.${groupIndex}.options`
  });

  const requestQuoteValues = watch(`customizationGroups.${groupIndex}.options`);

  return (
    <div className="space-y-2">
      <FormLabel>Options</FormLabel>
      {fields.map((option, optionIndex) => {
        const isQuoteRequested = requestQuoteValues?.[optionIndex]?.requestQuote;
        return (
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
                    <FormControl><Input type="number" {...field} placeholder="Price Adj." disabled={isQuoteRequested} value={field.value ?? 0} onChange={e => field.onChange(Number(e.target.value))} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={control}
                name={`customizationGroups.${groupIndex}.options.${optionIndex}.requestQuote`}
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 pb-2">
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">Quote?</FormLabel>
                    </FormItem>
                )}
                />
            <Button variant="ghost" size="icon" onClick={() => remove(optionIndex)}><Trash2 className="h-4 w-4"/></Button>
            </div>
        )
      })}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => append({ name: '', priceAdjustment: 0, requestQuote: false })}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Option
      </Button>
    </div>
  )
}
