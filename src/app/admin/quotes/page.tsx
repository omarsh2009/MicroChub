import { QuotesClientPage } from './client';
import { mockQuotes } from '@/lib/demo-data';

export default function AdminQuotesPage() {
  const quotes = mockQuotes;
  return <QuotesClientPage initialQuotes={quotes || []} />;
}
