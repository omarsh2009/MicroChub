import { QuotesClientPage } from './client';
import { getAllQuoteRequests } from '@/lib/services/quotes';

export default async function AdminQuotesPage() {
  const { data } = await getAllQuoteRequests();
  return <QuotesClientPage initialQuotes={data || []} />;
}
