'use client';
import { useState, useEffect } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
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
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import type { PaymentMethod } from '@/lib/types';
import { getPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } from '@/lib/admin';
import { PaymentMethodsTable } from './components/payment-methods-table';
import { PaymentMethodForm } from './components/payment-method-form';

export function PaymentMethodsClientPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | undefined>(undefined);

  useEffect(() => {
    if (!firestore) return;
    setLoading(true);
    getPaymentMethods(firestore)
      .then(setMethods)
      .catch(err => toast({ variant: 'destructive', title: 'Error fetching payment methods' }))
      .finally(() => setLoading(false));
  }, [firestore, toast]);

  const handleAdd = () => {
    setSelectedMethod(undefined);
    setOpen(true);
  };

  const handleEdit = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setOpen(true);
  };
  
  const handleDelete = async (methodId: string) => {
    if (!firestore) return;
    try {
        await deletePaymentMethod(firestore, methodId);
        setMethods(prev => prev.filter(m => m.id !== methodId));
        toast({ title: 'Payment Method Deleted' });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Failed to delete method' });
    }
  }

  const onFormSubmit = async (values: Omit<PaymentMethod, 'id'>, id?: string) => {
    if (!firestore) return;
    try {
      if (id) {
        await updatePaymentMethod(firestore, id, values);
        setMethods(prev => prev.map(m => m.id === id ? { ...m, ...values } : m));
        toast({ title: 'Payment Method Updated' });
      } else {
        const newId = await addPaymentMethod(firestore, values);
        setMethods(prev => [...prev, { id: newId, ...values }]);
        toast({ title: 'Payment Method Added' });
      }
      setOpen(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Save failed' });
    }
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
            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : (
                <PaymentMethodsTable methods={methods} onEdit={handleEdit} onDelete={handleDelete} />
            )}
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

    