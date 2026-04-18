import { getProducts } from "@/lib/services/products";
import { ProductClientPage } from "./client";
import { getCategories } from "@/lib/services/categories";

export default async function AdminProductsPage() {
  const products = await getProducts();
  const categories = await getCategories();
  
  return <ProductClientPage products={products} categories={categories} />;
}
