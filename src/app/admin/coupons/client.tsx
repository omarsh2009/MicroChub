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
import type { Coupon } from '@/lib/types';
import { CouponsTable } from './components/coupons-table';
import { CouponForm } from './components/coupon-form';

export function CouponsClientPage({ coupons: initialCoupons }: { coupons: Coupon[]}) {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [open, setOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | undefined>(undefined);

  const handleAdd = () => {
    setSelectedCoupon(undefined);
    setOpen(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setOpen(true);
  };
  
  const handleDelete = async (couponId: string) => {
    toast({ variant: 'destructive', title: 'Delete Action (Demo)', description: 'This action is disabled in the static UI demo.' });
  }

  const onFormSubmit = async (values: Omit<Coupon, 'id' | 'usedCount'>, id?: string) => {
    toast({ title: 'Saved (Demo)', description: 'Coupon changes would be saved in a real application.' });
    setOpen(false);
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
            <CouponsTable coupons={coupons} onEdit={handleEdit} onDelete={handleDelete} />
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
