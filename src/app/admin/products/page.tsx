import { getProducts } from "@/lib/services/products";
import { ProductClientPage } from "./client";
import { getCategories } from "@/lib/services/categories";

export default async function AdminProductsPage() {
  const { data: productsData } = await getProducts();
  const { data: categoriesData } = await getCategories();
  
  return <ProductClientPage products={productsData || []} categories={categoriesData || []} />;
}
