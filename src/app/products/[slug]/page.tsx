import { notFound } from "next/navigation";
import { ProductClientPage } from "./client";
import { mockProducts } from "@/lib/demo-data";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = mockProducts.find(p => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  return <ProductClientPage product={product} />;
}
