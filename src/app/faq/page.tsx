'use client';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAppContext } from '@/context/app-provider';

export default function FaqPage() {
    const { faqs } = useAppContext();
    const publishedFaqs = faqs.filter(faq => faq.isPublished);

    return (
        <div className="bg-background text-foreground">
            <section className="w-full py-24 md:py-32">
                <div className="container px-4 md:px-6 text-center">
                    <Badge variant="outline" className="py-1 px-3">FAQ</Badge>
                    <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mt-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
                        Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us.
                    </p>
                </div>
            </section>

            <section className="w-full pb-12 md:pb-24 lg:pb-32">
                <div className="container max-w-3xl px-4 md:px-6">
                    <Accordion type="single" collapsible className="w-full">
                        {publishedFaqs.map(faq => (
                             <AccordionItem key={faq.id} value={faq.id}>
                                <AccordionTrigger className="text-left font-bold text-lg hover:no-underline">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-base text-muted-foreground">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                     {publishedFaqs.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-lg text-muted-foreground">
                                No FAQs have been published yet. Check back soon!
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
