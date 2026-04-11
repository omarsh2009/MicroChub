import { products } from "@/lib/data";
import { notFound } from "next/navigation";
import { ProductClientPage } from "./client";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  return <ProductClientPage product={product} />;
}
