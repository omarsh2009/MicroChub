'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Package, Building } from 'lucide-react';
import { mockContactInfo } from '@/lib/demo-data';


const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

export default function ContactPage() {
  const { toast } = useToast();
  const contactInfo = mockContactInfo;
  const [viewMode, setViewMode] = useState<'online' | 'physical'>(contactInfo.storeMode);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("New message (Demo): ", values);
    toast({
      title: 'Message Sent!',
      description: "Thanks for reaching out. We'll get back to you shortly.",
    });
    form.reset();
  }

  return (
    <div className="bg-background text-foreground">
      <section className="w-full py-24 md:py-32">
        <div className="container px-4 md:px-6 text-center">
          <Badge variant="outline" className="py-1 px-3">Contact Us</Badge>
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mt-4">
            Get in Touch
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
            Have a question, a project idea, or just want to say hi? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="w-full pb-12 md:pb-24 lg:pb-32">
        <div className="container grid gap-12 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6 rounded-lg bg-card p-6 md:p-8">
            <h2 className="font-headline text-3xl font-bold">Contact Form</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us what's on your mind..." {...field} rows={6} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg">Send Message</Button>
              </form>
            </Form>
          </div>
          <div className="flex flex-col justify-center space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Email</h3>
                <p className="text-muted-foreground">General Inquiries & Support</p>
                <a href={`mailto:${contactInfo.email}`} className="font-medium text-primary hover:underline">
                  {contactInfo.email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Phone</h3>
                <p className="text-muted-foreground">{contactInfo.workingDays}, {contactInfo.workingHours}</p>
                <a href={`tel:${contactInfo.phone}`} className="font-medium text-primary hover:underline">
                  {contactInfo.phone}
                </a>
              </div>
            </div>
            
            {contactInfo.storeMode === 'physical' ? (
                <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Location</h3>
                        <p className="font-medium text-muted-foreground">{contactInfo.location}</p>
                        {contactInfo.googleMapsLink && (
                        <a href={contactInfo.googleMapsLink.replace('/embed?','/view?')} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                            View on Google Maps
                        </a>
                        )}
                    </div>
                </div>
            ) : (
                 <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Online Orders</h3>
                        <p className="font-medium text-muted-foreground">{contactInfo.pickupInstructions}</p>
                    </div>
                </div>
            )}
             {contactInfo.googleMapsLink && contactInfo.storeMode === 'physical' && (
                <div className="w-full aspect-video rounded-lg overflow-hidden border">
                    <iframe
                        src={contactInfo.googleMapsLink}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

    