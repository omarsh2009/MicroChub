import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { products, placeholderImagesById } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, ShoppingCart } from "lucide-react";

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const productImages = product.images.map(id => placeholderImagesById[id]).filter(Boolean);

  return (
    <div className="py-12 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <Carousel className="w-full">
              <CarouselContent>
                {productImages.map((img, index) => (
                  <CarouselItem key={index}>
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <Image
                          src={img.imageUrl}
                          alt={`${product.name} image ${index + 1}`}
                          width={600}
                          height={600}
                          className="aspect-square object-cover w-full"
                          data-ai-hint={img.imageHint}
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <Link href="/products" className="text-sm text-muted-foreground hover:text-primary">
                &larr; Back to Products
              </Link>
              <Badge variant="outline" className="mt-4">{product.category}</Badge>
              <h1 className="font-headline text-4xl lg:text-5xl font-bold mt-2">{product.name}</h1>
              <p className="text-muted-foreground text-lg mt-4">{product.description}</p>
            </div>

            <div className="text-4xl font-bold">
              EGP {product.price.toLocaleString()}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1">
                <ShoppingCart className="mr-2" />
                Add to Cart
              </Button>
              {product.configurable && (
                <Button size="lg" variant="outline" className="flex-1">
                  Configure
                </Button>
              )}
            </div>

            <div>
              <h3 className="font-headline text-xl font-bold mb-4">Specifications</h3>
              <Table>
                <TableBody>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium text-muted-foreground">{key}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div>
              <h3 className="font-headline text-xl font-bold mb-4">Use Cases</h3>
              <ul className="space-y-2">
                {product.useCases.map((useCase, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-1 text-primary" />
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
