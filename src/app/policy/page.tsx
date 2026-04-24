
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { mockPolicies } from '@/lib/demo-data';

export default function PolicyPage() {
    const visiblePolicies = mockPolicies.filter(p => p.isVisible);

    return (
        <div className="bg-background text-foreground">
            <section className="w-full py-24 md:py-32">
                <div className="container px-4 md:px-6 text-center">
                    <Badge variant="outline" className="py-1 px-3">Our Policy</Badge>
                    <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mt-4">
                        Store Policies
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
                        Everything you need to know about shopping with us. If you have any other questions, please contact us.
                    </p>
                </div>
            </section>

            <section className="w-full pb-12 md:pb-24 lg:pb-32">
                <div className="container max-w-3xl px-4 md:px-6">
                    <Accordion type="single" collapsible className="w-full">
                        {visiblePolicies.map(policy => (
                             <AccordionItem key={policy.id} value={policy.id}>
                                <AccordionTrigger className="text-left font-bold text-lg hover:no-underline">
                                    {policy.title}
                                </AccordionTrigger>
                                <AccordionContent className="text-base text-muted-foreground whitespace-pre-wrap">
                                    {policy.content}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                     {visiblePolicies.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-lg text-muted-foreground">
                                No policies have been published yet. Check back soon!
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

    