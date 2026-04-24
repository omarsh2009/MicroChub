import { PaymentMethodsClientPage } from './client';
import { mockPaymentMethods } from '@/lib/demo-data';

export default function AdminPaymentMethodsPage() {
  return <PaymentMethodsClientPage methods={mockPaymentMethods} />;
}
