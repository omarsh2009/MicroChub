import { products } from "@/lib/data";
import { ProductClientPage } from "./client";

export default function AdminProductsPage() {
  return <ProductClientPage products={products} />;
}
