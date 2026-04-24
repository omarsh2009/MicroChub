import { ProductClientPage } from "./client";
import { mockProducts, mockCategories } from "@/lib/demo-data";

export default function AdminProductsPage() {
  const products = mockProducts;
  const categories = mockCategories;
  
  return <ProductClientPage products={products || []} categories={categories || []} />;
}
