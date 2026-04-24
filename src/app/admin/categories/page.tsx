import { CategoriesClientPage } from './client';
import { mockCategories } from '@/lib/demo-data';

export default function AdminCategoriesPage() {
  const categories = mockCategories;
  return <CategoriesClientPage categories={categories} />;
}
