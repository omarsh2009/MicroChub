import { notFound } from "next/navigation";
import { ProductClientPage } from "./client";
import { mockProducts, mockCategories } from "@/lib/demo-data";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = mockProducts.find(p => p.slug === params.slug);
  const allProducts = mockProducts;
  const categories = mockCategories;

  if (!product) {
    notFound();
  }

  return <ProductClientPage product={product} allProducts={allProducts || []} categories={categories || []} />;
}
