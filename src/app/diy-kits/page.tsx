import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { mockProducts, mockCategories } from "@/lib/demo-data";

export default function DiyKitsPage() {
  const allProducts = mockProducts;
  const categories = mockCategories;

  const diyCategory = categories.find(c => c.slug === 'diy-kits');
  const diyKits = diyCategory
    ? allProducts.filter(product =>
        Array.isArray(product.categoryIds) && product.categoryIds.includes(diyCategory.id)
      )
    : [];

  return (
    <div className="bg-background text-foreground">
      <section className="w-full py-24 md:py-32">
        <div className="container px-4 md:px-6 text-center">
          <Badge variant="outline" className="py-1 px-3">
            Do It Yourself
          </Badge>
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mt-4">
            DIY Kits
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
            Everything you need to build your own amazing projects. From CNCs to custom keyboards, start creating today.
          </p>
        </div>
      </section>

      <section className="w-full pb-12 md:pb-24 lg:pb-32">
        <div className="container px-4 md:px-6">
          {diyKits.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {diyKits.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  categories={categories}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No DIY kits available at the moment. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
