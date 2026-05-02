
import { notFound } from "next/navigation";
import { ProductClientPage } from "./client";
import { mockProducts } from "@/lib/demo-data";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = mockProducts.find(p => p.slug === slug);

  if (!product) {
    notFound();
  }

  return <ProductClientPage product={product} />;
}
