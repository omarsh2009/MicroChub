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
import type { PaymentMethod } from '@/lib/types';
import { PaymentMethodsTable } from './components/payment-methods-table';
import { PaymentMethodForm } from './components/payment-method-form';

export function PaymentMethodsClientPage({ methods: initialMethods }: { methods: PaymentMethod[] }) {
  const { toast } = useToast();
  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods);
  const [open, setOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | undefined>(undefined);

  const handleAdd = () => {
    setSelectedMethod(undefined);
    setOpen(true);
  };

  const handleEdit = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setOpen(true);
  };
  
  const handleDelete = async (methodId: string) => {
    toast({ variant: 'destructive', title: 'Delete Action (Demo)', description: 'This action is disabled in the static UI demo.' });
  }

  const onFormSubmit = async (values: Omit<PaymentMethod, 'id'>, id?: string) => {
    toast({ title: 'Saved (Demo)', description: 'Payment method changes would be saved in a real application.' });
    setOpen(false);
  };

  return (
    <>
       <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Payment Methods</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Method
            </Button>
          </div>
        </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Payment Methods</CardTitle>
          <CardDescription>Configure the payment options available to customers at checkout.</CardDescription>
        </CardHeader>
        <CardContent>
            <PaymentMethodsTable methods={methods} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{selectedMethod ? 'Edit' : 'Add'} Payment Method</DialogTitle>
          </DialogHeader>
          <PaymentMethodForm
            method={selectedMethod}
            onSubmit={onFormSubmit}
            onFinished={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
