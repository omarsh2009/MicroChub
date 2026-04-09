'use client';
import { products } from "@/lib/data";
import dynamic from 'next/dynamic';

const ProductClientPage = dynamic(
  () => import('./client').then(mod => mod.ProductClientPage), 
  { ssr: false }
);

export default function AdminProductsPage() {
  return <ProductClientPage products={products} />;
}
