import { LegalClientPage } from './client';
import { mockLegalAgreement } from '@/lib/demo-data';

export default function AdminLegalPage() {
  return <LegalClientPage agreement={mockLegalAgreement} />;
}
