'use client';
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/app-provider";

export default function DiyKitsPage() {
  const { products, categories } = useAppContext();

  const diyKits = products.filter((product) =>
    product.categoryIds.includes('cat-1')
  );

  return (
    <div className="bg-background text-foreground">
      <section className="w-full py-24 md:py-32">
        <div className="container px-4 md:px-6 text-center">
          <Badge variant="outline" className="py-1 px-3">
            DIY Kits
          </Badge>
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mt-4">
            DIY Kits & Bundles
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
            Everything you need to build something amazing, bundled in one package.
          </p>
        </div>
      </section>

      <section className="w-full pb-12 md:pb-24 lg:pb-32">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {diyKits.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categories={categories}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
