
'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {useToast} from '@/hooks/use-toast';
import {Badge} from '@/components/ui/badge';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import { mockContactInfo } from '@/lib/demo-data';

export default function CustomServicesPage() {
  const {toast} = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isStoreClosed = mockContactInfo.storeStatus === 'closed';

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
        toast({
            title: 'Request Submitted! (Demo)',
            description: "We've received your project details. In a real app, our team would review this.",
        });
        setIsLoading(false);
    }, 1000);
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
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="projectDescription">Project Description</Label>
                        <Textarea
                            id="projectDescription"
                            placeholder="Describe your project in detail. What should it do? What are the key features? Are there any specific components or platforms you want to use?"
                            rows={10}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="file">Supporting File (Optional)</Label>
                        <Input
                            id="file"
                            type="file"
                        />
                        <p className="text-sm text-muted-foreground">
                            Upload any schematics, mockups, or documents (max 4MB).
                        </p>
                    </div>

                    <Button type="submit" size="lg" disabled={isStoreClosed}>
                        {isStoreClosed ? 'Requests are currently unavailable' : 'Request a Quote'}
                    </Button>
                </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

// Dummy Label component to satisfy TS
const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => <label {...props} />;
