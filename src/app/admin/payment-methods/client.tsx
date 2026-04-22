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
import { useToast } from '@/hooks/use-toast';
import type { PaymentMethod } from '@/lib/types';
import { getPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } from '@/lib/services/payment-methods';
import { PaymentMethodsTable } from './components/payment-methods-table';
import { PaymentMethodForm } from './components/payment-method-form';

export function PaymentMethodsClientPage() {
  const { toast } = useToast();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | undefined>(undefined);

  useEffect(() => {
    const fetchMethods = async () => {
        setLoading(true);
        const { data, error } = await getPaymentMethods();
        if (error) {
            toast({ variant: 'destructive', title: 'Error fetching payment methods', description: error.message });
            setMethods([]);
        } else {
            setMethods(data || []);
        }
        setLoading(false);
    }
    fetchMethods();
  }, [toast]);

  const handleAdd = () => {
    setSelectedMethod(undefined);
    setOpen(true);
  };

  const handleEdit = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setOpen(true);
  };
  
  const handleDelete = async (methodId: string) => {
    const { success, error } = await deletePaymentMethod(methodId);
    if (success) {
        setMethods(prev => prev.filter(m => m.id !== methodId));
        toast({ title: 'Payment Method Deleted' });
    } else {
        toast({ variant: 'destructive', title: 'Failed to delete method', description: error?.message });
    }
  }

  const onFormSubmit = async (values: Omit<PaymentMethod, 'id'>, id?: string) => {
    const response = id ? await updatePaymentMethod(id, values) : await addPaymentMethod(values);
    if (response.success && response.data) {
        if (id) {
            setMethods(prev => prev.map(m => m.id === id ? response.data! : m));
            toast({ title: 'Payment Method Updated' });
        } else {
            setMethods(prev => [...prev, response.data!]);
            toast({ title: 'Payment Method Added' });
        }
        setOpen(false);
    } else {
        toast({ variant: 'destructive', title: 'Save failed', description: response.error?.message });
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
