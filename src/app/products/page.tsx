import { getProducts } from "@/lib/services/products";
import { getCategories } from "@/lib/services/categories";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const products = await getProducts();
  const categories = await getCategories();
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  const selectedCategorySlug = searchParams?.category;
  const selectedCategory = categories.find(
    (c) => c.slug === selectedCategorySlug
  );

  const filteredProducts = selectedCategory
    ? products.filter((product) =>
        product.categoryIds.includes(selectedCategory.id)
      )
    : products;

  const pageTitle = selectedCategory ? selectedCategory.name : "The Maker's Arsenal";
  const pageDescription = selectedCategory
    ? `Browse all products in the ${selectedCategory.name} category.`
    : "Browse our full collection of electronics, components, and kits. Everything you need for your next project is right here.";

  return (
    <div className="bg-background text-foreground">
      <section className="w-full py-24 md:py-32">
        <div className="container px-4 md:px-6 text-center">
          <Badge variant="outline" className="py-1 px-3">
            {selectedCategory ? selectedCategory.name : "Our Products"}
          </Badge>
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mt-4">
            {pageTitle}
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
            {pageDescription}
          </p>
        </div>
      </section>

      <section className="w-full pb-12 md:pb-24 lg:pb-32">
        <div className="container px-4 md:px-6">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={
                    categoryMap.get(product.categoryIds[0]) || "Uncategorized"
                  }
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold">No Products Found</h2>
              <p className="text-muted-foreground mt-2">
                There are no products available in the{" "}
                {selectedCategory?.name || "selected"} category.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
