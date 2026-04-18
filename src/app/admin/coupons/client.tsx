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
import type { Coupon } from '@/lib/types';
import { getCoupons, addCoupon, updateCoupon, deleteCoupon } from '@/lib/services/coupons';
import { CouponsTable } from './components/coupons-table';
import { CouponForm } from './components/coupon-form';

export function CouponsClientPage() {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    getCoupons()
      .then(setCoupons)
      .catch(err => toast({ variant: 'destructive', title: 'Error fetching coupons' }))
      .finally(() => setLoading(false));
  }, [toast]);

  const handleAdd = () => {
    setSelectedCoupon(undefined);
    setOpen(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setOpen(true);
  };
  
  const handleDelete = async (couponId: string) => {
    try {
        await deleteCoupon(couponId);
        setCoupons(prev => prev.filter(c => c.id !== couponId));
        toast({ title: 'Coupon Deleted' });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Failed to delete coupon' });
    }
  }

  const onFormSubmit = async (values: Omit<Coupon, 'id' | 'usedCount'>, id?: string) => {
    try {
      if (id) {
        await updateCoupon(id, values);
        const existingCoupon = coupons.find(c => c.id === id);
        if (existingCoupon) {
          setCoupons(prev => prev.map(c => c.id === id ? { ...existingCoupon, ...values } : c));
        }
        toast({ title: 'Coupon Updated' });
      } else {
        const newId = await addCoupon(values);
        setCoupons(prev => [...prev, { id: newId, ...values, usedCount: 0 }]);
        toast({ title: 'Coupon Added' });
      }
      setOpen(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Save failed' });
    }
  };

  return (
    <>
       <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Coupons</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Coupon
            </Button>
          </div>
        </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Coupons</CardTitle>
          <CardDescription>Create and manage discount coupons for your store.</CardDescription>
        </CardHeader>
        <CardContent>
            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : (
                <CouponsTable coupons={coupons} onEdit={handleEdit} onDelete={handleDelete} />
            )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{selectedCoupon ? 'Edit' : 'Add'} Coupon</DialogTitle>
          </DialogHeader>
          <CouponForm
            coupon={selectedCoupon}
            onSubmit={onFormSubmit}
            onFinished={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
