'use client';

import { notFound, useParams } from "next/navigation";
import { ProductClientPage } from "./client";
import { useAppContext } from "@/context/app-provider";

export default function ProductPage() {
  const { products } = useAppContext();
  const params = useParams();
  const slug = params.slug as string;
  
  const product = products.find(p => p.slug === slug);

  if (!product) {
    notFound();
  }

  return <ProductClientPage product={product} />;
}
