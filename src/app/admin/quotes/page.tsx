'use client';
import { QuotesClientPage } from './client';
import { useAppContext } from '@/context/app-provider';

export default function AdminQuotesPage() {
  const { quotes } = useAppContext();
  return <QuotesClientPage initialQuotes={quotes || []} />;
}
