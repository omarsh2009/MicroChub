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
    const fetchCoupons = async () => {
        setLoading(true);
        const { data, error } = await getCoupons();
        if (error) {
            toast({ variant: 'destructive', title: 'Error fetching coupons', description: error.message });
            setCoupons([]);
        } else {
            setCoupons(data || []);
        }
        setLoading(false);
    }
    fetchCoupons();
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
    const { success, error } = await deleteCoupon(couponId);
    if (success) {
        setCoupons(prev => prev.filter(c => c.id !== couponId));
        toast({ title: 'Coupon Deleted' });
    } else {
        toast({ variant: 'destructive', title: 'Failed to delete coupon', description: error?.message });
    }
  }

  const onFormSubmit = async (values: Omit<Coupon, 'id' | 'usedCount'>, id?: string) => {
    const response = id ? await updateCoupon(id, values) : await addCoupon(values);

    if (response.success && response.data) {
        if (id) {
            setCoupons(prev => prev.map(c => c.id === id ? response.data! : c));
            toast({ title: 'Coupon Updated' });
        } else {
            setCoupons(prev => [...prev, response.data!]);
            toast({ title: 'Coupon Added' });
        }
        setOpen(false);
    } else {
        toast({ variant: 'destructive', title: 'Save failed', description: response.error?.message });
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
