import { ContactInfoClientPage } from './client';
import { mockContactInfo } from '@/lib/demo-data';

export default function AdminContactInfoPage() {
  return <ContactInfoClientPage contactInfo={mockContactInfo} />;
}
