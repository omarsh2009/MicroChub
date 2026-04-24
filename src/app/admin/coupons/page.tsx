import { CouponsClientPage } from './client';
import { mockCoupons } from '@/lib/demo-data';

export default function AdminCouponsPage() {
  return <CouponsClientPage coupons={mockCoupons} />;
}
