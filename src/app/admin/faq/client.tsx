'use client';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import type { FaqItem } from '@/lib/types';
import { FaqTable } from './components/faq-table';
import { FaqForm } from './components/faq-form';

export function FaqClientPage({ faqs: initialFaqs }: { faqs: FaqItem[]}) {
  const { toast } = useToast();
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);
  const [open, setOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FaqItem | undefined>(undefined);

  const handleAdd = () => {
    setSelectedFaq(undefined);
    setOpen(true);
  };

  const handleEdit = (faq: FaqItem) => {
    setSelectedFaq(faq);
    setOpen(true);
  };
  
  const handleDelete = (faqId: string) => {
    toast({
        variant: 'destructive',
        title: 'Delete Action (Demo)',
        description: 'This action is disabled in the static UI demo.',
    });
  }

  const onFormSubmit = async (values: Omit<FaqItem, 'id'>, id?: string) => {
    toast({
        title: 'Saved (Demo)',
        description: 'FAQ changes would be saved in a real application.',
    });
    setOpen(false);
  };

  return (
    <>
       <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Manage FAQs</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add FAQ
            </Button>
          </div>
        </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Create, edit, and manage questions that appear on your public FAQ page.</CardDescription>
        </CardHeader>
        <CardContent>
            <FaqTable faqs={faqs} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{selectedFaq ? 'Edit' : 'Add'} FAQ</DialogTitle>
          </DialogHeader>
          <FaqForm
            faq={selectedFaq}
            onSubmit={onFormSubmit}
            onFinished={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
