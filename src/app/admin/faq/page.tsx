'use client';
import { FaqClientPage } from './client';
import { useAppContext } from '@/context/app-provider';

export default function AdminFaqPage() {
  const { faqs } = useAppContext();
  return <FaqClientPage faqs={faqs} />;
}
