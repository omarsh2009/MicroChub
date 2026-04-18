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
import { Switch } from '@/components/ui/switch';
import type { SocialLink } from '@/lib/types';
import { useState } from 'react';
import { Loader2, Facebook, Twitter, Instagram, Github, Youtube, Linkedin, Link2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SUPPORTED_PLATFORMS = ['Facebook', 'Twitter', 'Instagram', 'GitHub', 'YouTube', 'LinkedIn'];

export const getIconForPlatform = (platform: string) => {
    const props = { className: "h-5 w-5" };
    switch (platform) {
        case 'Facebook': return <Facebook {...props} />;
        case 'Twitter': return <Twitter {...props} />;
        case 'Instagram': return <Instagram {...props} />;
        case 'GitHub': return <Github {...props} />;
        case 'YouTube': return <Youtube {...props} />;
        case 'LinkedIn': return <Linkedin {...props} />;
        default: return <Link2 {...props} />;
    }
};


const formSchema = z.object({
  platform: z.string().min(2, { message: 'Platform is required.' }),
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  enabled: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface SocialLinkFormProps {
  link?: SocialLink;
  onSubmit: (values: FormValues, id?: string) => Promise<void>;
  onFinished: () => void;
}

export function SocialLinkForm({ link, onSubmit, onFinished }: SocialLinkFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: link?.platform || '',
      url: link?.url || '',
      enabled: link?.enabled ?? true,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    await onSubmit(values, link?.id);
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-6 py-4">
        <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Platform</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SUPPORTED_PLATFORMS.map(platform => (
                        <SelectItem key={platform} value={platform}>
                            <div className="flex items-center gap-2">
                                {getIconForPlatform(platform)}
                                <span>{platform}</span>
                            </div>
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
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
                  If disabled, this link will not be shown on the site.
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
              {link ? 'Save Changes' : 'Create Link'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
