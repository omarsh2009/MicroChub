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
import {Loader2, Bot, CircleCheck} from 'lucide-react';
import {
  adminProjectSummaryTool,
  type AdminProjectSummaryToolOutput,
} from '@/ai/flows/admin-project-summary-tool';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

const formSchema = z.object({
  projectDescription: z
    .string()
    .min(50, {message: 'Please provide a detailed description of at least 50 characters.'}),
  file: z.any().optional(),
});

function fileToDataURI(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CustomServicesPage() {
  const {toast} = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<AdminProjectSummaryToolOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectDescription: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSummary(null);
    try {
      let fileDataUri: string | undefined = undefined;
      if (values.file && values.file.length > 0) {
        const file = values.file[0];
        if (file.size > 4 * 1024 * 1024) {
            toast({
                variant: 'destructive',
                title: 'File too large',
                description: 'Please upload a file smaller than 4MB.',
            });
            return;
        }
        fileDataUri = await fileToDataURI(file);
      }

      const result = await adminProjectSummaryTool({
        projectDescription: values.projectDescription,
        fileDataUri,
      });
      setSummary(result);
      toast({
        title: 'Analysis Complete!',
        description: 'Our AI has summarized your project requirements.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with our AI analysis. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
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
            Have a custom electronics project in mind? Our expert engineers can turn your concept into a reality. Describe your project below to get an instant AI-powered analysis and a quote from our team.
          </p>
        </div>
      </section>

      <section className="w-full pb-12 md:pb-24 lg:pb-32">
        <div className="container grid gap-12 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <h2 className="font-headline text-3xl font-bold">Project Submission</h2>
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
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Supporting File (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*,.pdf,.txt,.zip"
                          onChange={(e) => field.onChange(e.target.files)}
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
                  {isLoading ? 'Analyzing...' : 'Get AI Summary'}
                </Button>
              </form>
            </Form>
          </div>
          <div className="space-y-6">
            <h2 className="font-headline text-3xl font-bold flex items-center gap-2">
              <Bot /> AI Analysis
            </h2>
            {isLoading && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Our AI is analyzing your project. Please wait...</p>
              </div>
            )}
            {summary && (
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CircleCheck className="text-green-500" /> Project Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">Overall Summary</h3>
                        <p className="text-muted-foreground text-sm">{summary.summary}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Key Requirements</h3>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                            {summary.keyRequirements.map((req, i) => <li key={i}>{req}</li>)}
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-2">Technical Specifications</h3>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                            {summary.technicalSpecifications.map((spec, i) => <li key={i}>{spec}</li>)}
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-2">Potential Challenges</h3>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                            {summary.potentialChallenges.map((chal, i) => <li key={i}>{chal}</li>)}
                        </ul>
                    </div>
                    <div className="border-t pt-4 text-center text-muted-foreground text-xs">
                        This is an automated analysis. Our team will review your project and send you a formal quote shortly.
                    </div>
                </CardContent>
              </Card>
            )}
            {!isLoading && !summary && (
               <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                    <p className="text-muted-foreground">Your project analysis will appear here.</p>
               </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
