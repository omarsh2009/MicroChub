import { products } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";

export default function ProductsPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="w-full py-24 md:py-32">
        <div className="container px-4 md:px-6 text-center">
          <Badge variant="outline" className="py-1 px-3">
            Our Products
          </Badge>
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mt-4">
            The Maker's Arsenal
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
            Browse our full collection of electronics, components, and kits. Everything you need for your next project is right here.
          </p>
        </div>
      </section>

      <section className="w-full pb-12 md:pb-24 lg:pb-32">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
