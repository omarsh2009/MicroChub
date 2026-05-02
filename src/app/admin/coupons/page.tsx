'use client';
import { CouponsClientPage } from './client';
import { useAppContext } from '@/context/app-provider';

export default function AdminCouponsPage() {
  const { coupons } = useAppContext();
  return <CouponsClientPage coupons={coupons} />;
}
