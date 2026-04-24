import { FaqClientPage } from './client';
import { mockFaqs } from '@/lib/demo-data';

export default function AdminFaqPage() {
  return <FaqClientPage faqs={mockFaqs} />;
}
