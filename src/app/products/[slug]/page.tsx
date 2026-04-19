import { getProductBySlug, getProducts } from "@/lib/services/products";
import { getCategories } from "@/lib/services/categories";
import { notFound } from "next/navigation";
import { ProductClientPage } from "./client";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { data: product } = await getProductBySlug(params.slug);
  const { data: allProducts } = await getProducts();
  const { data: categories } = await getCategories();

  if (!product) {
    notFound();
  }

  return <ProductClientPage product={product} allProducts={allProducts || []} categories={categories || []} />;
}
