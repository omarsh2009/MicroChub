'use client';

import {useState} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {useToast} from '@/hooks/use-toast';
import {Badge} from '@/components/ui/badge';
import {Loader2, Wand2 } from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

const formSchema = z.object({
  projectDescription: z
    .string()
    .min(50, {message: 'Please provide a detailed description of at least 50 characters.'}),
  file: z.any().optional(),
});

export default function CustomServicesPage() {
  const {toast} = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectDescription: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log("Simulating custom service request submission:", values);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
        title: 'Request Submitted!',
        description: "We've received your project details and will get back to you with a quote shortly.",
    });
    
    form.reset();
    setIsLoading(false);
  }

  return (
    <div className="bg-background text-foreground">
      <section className="w-full py-24 md:py-32">
        <div className="container px-4 md:px-6 text-center">
          <Badge variant="outline" className="py-1 px-3">
            Custom Services
          </Badge>
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mt-4">
            Bring Your Vision to Life
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
            Have a custom electronics project in mind? Our expert engineers can turn your concept into a reality. Describe your project below to get a quote from our team.
          </p>
        </div>
      </section>

      <section className="w-full pb-12 md:pb-24 lg:pb-32">
        <div className="container px-4 md:px-6">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Project Submission Form</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="projectDescription"
                    render={({field}) => (
                        <FormItem>
                        <FormLabel>Project Description</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Describe your project in detail. What should it do? What are the key features? Are there any specific components or platforms you want to use?"
                            {...field}
                            rows={10}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="file"
                    render={({field: { onChange, ...fieldProps} }) => (
                        <FormItem>
                        <FormLabel>Supporting File (Optional)</FormLabel>
                        <FormControl>
                            <Input
                            type="file"
                            accept="image/*,.pdf,.txt,.zip"
                            onChange={(e) => onChange(e.target.files)}
                            {...fieldProps}
                            />
                        </FormControl>
                        <FormDescription>
                            Upload any schematics, mockups, or documents (max 4MB).
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <Button type="submit" size="lg" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Submitting...' : 'Request a Quote'}
                    </Button>
                </form>
                </Form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
