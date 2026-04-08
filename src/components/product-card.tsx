import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Product } from "@/lib/types";
import { placeholderImagesById } from "@/lib/data";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImageId = product.images[0];
  const placeholderImage = placeholderImagesById[primaryImageId];

  return (
    <Card className="flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={`/products/${product.slug}`} aria-label={product.name}>
          <div className="aspect-video overflow-hidden">
            {placeholderImage ? (
              <Image
                src={placeholderImage.imageUrl}
                alt={product.name}
                width={600}
                height={400}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={placeholderImage.imageHint}
              />
            ) : (
              <div className="bg-muted aspect-video w-full flex items-center justify-center">
                <span className="text-sm text-muted-foreground">
                  No Image
                </span>
              </div>
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Badge variant="outline" className="mb-2">
          {product.category}
        </Badge>
        <CardTitle className="text-lg font-headline">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </CardTitle>
        <CardDescription className="mt-2 text-sm line-clamp-2">
          {product.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-xl font-bold">
          EGP {product.price.toLocaleString()}
        </p>
        <Button asChild>
          <Link href={`/products/${product.slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
