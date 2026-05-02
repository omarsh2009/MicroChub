'use client';
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
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
import { type Product, type Category } from "@/lib/types";
import { useAppContext } from "@/context/app-provider";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  categories: Category[];
}

export function ProductCard({ product, categories }: ProductCardProps) {
  const { currentUser, toggleWishlist } = useAppContext();
  const { toast } = useToast();
  const primaryImage = product.image;
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  const inWishlist = currentUser?.wishlist.includes(product.id) || false;

  let discountedPrice: number | null = null;
  if (product.discountValue && product.discountType && product.discountType !== 'none') {
    if (product.discountType === 'fixed') {
      discountedPrice = product.price - product.discountValue;
    }
    if (product.discountType === 'percentage') {
      discountedPrice = product.price * (1 - product.discountValue / 100);
    }
  }

  const getStockStatus = (product: Product): { text: string; variant: "default" | "secondary" | "destructive" } => {
    if (!product.inStock) {
        return { text: "Made on Order", variant: "secondary" };
    }
    if (product.stockQuantity > 0) {
        return { text: "In Stock", variant: "default" };
    }
    return { text: "Out of Stock", variant: "destructive" };
  }
  
  const stockStatus = getStockStatus(product);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
        toast({ title: 'Login Required', description: 'Please login to manage your wishlist.' });
        return;
    }
    toggleWishlist(product.id);
  };

  return (
    <Card className="flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <Link href={`/products/${product.slug}`} aria-label={product.name}>
          <div className="aspect-video overflow-hidden">
            {primaryImage ? (
              <Image
                src={primaryImage}
                alt={product.name}
                width={600}
                height={400}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
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
         <Badge variant={stockStatus.variant} className="absolute top-2 right-2">{stockStatus.text}</Badge>
         <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 left-2 bg-background/50 backdrop-blur hover:bg-background/80 rounded-full"
            onClick={handleWishlist}
         >
             <Heart className={cn("h-4 w-4", inWishlist && "fill-primary text-primary")} />
         </Button>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </CardTitle>
        <CardDescription className="mt-2 text-sm line-clamp-2">
          {product.description}
        </CardDescription>
        {product.categoryIds && product.categoryIds.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-2">
            {product.categoryIds.map((catId) => (
              <Badge key={catId} variant="secondary">
                {categoryMap.get(catId) || catId}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div>
          {discountedPrice !== null ? (
            <>
              <p className="text-xl font-bold">
                EGP {discountedPrice.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground line-through">
                EGP {product.price.toLocaleString()}
              </p>
            </>
          ) : (
            <p className="text-xl font-bold">
              EGP {product.price.toLocaleString()}
            </p>
          )}
        </div>
        <Button asChild>
          <Link href={`/products/${product.slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
