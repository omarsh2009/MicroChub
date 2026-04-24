
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function QuotesPage() {
  return (
    <div className="container py-12 px-4 md:px-6">
      <h1 className="font-headline text-4xl font-bold tracking-tighter mb-8">My Quotes</h1>
        <Card className="text-center py-20">
            <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    <FileQuestion className="w-12 h-12 text-primary" />
                </div>
            </CardHeader>
            <CardContent>
                <h2 className="text-2xl font-semibold mb-2">No Quote Requests Yet</h2>
                <p className="text-muted-foreground mb-6">You haven't requested any quotes. Find a product to customize!</p>
                <Button asChild>
                    <Link href="/products">Browse Products</Link>
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
