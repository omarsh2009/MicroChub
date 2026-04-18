import { getProductBySlug, getProducts } from "@/lib/services/products";
import { notFound } from "next/navigation";
import { ProductClientPage } from "./client";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  const allProducts = await getProducts();

  if (!product) {
    notFound();
  }

  return <ProductClientPage product={product} allProducts={allProducts} />;
}
