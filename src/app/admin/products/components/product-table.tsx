'use client';
import Image from 'next/image';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Product, Category } from '@/lib/types';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function ProductTable({
  products,
  categories,
  onEdit,
  onDelete,
  isDeleting,
}: {
  products: Product[];
  categories: Category[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  isDeleting: string | null;
}) {
  const categoryMap = new Map(categories.map(c => [c.id, c.name]));

  const getStockStatus = (product: Product): { text: string; variant: "default" | "secondary" | "destructive" | "outline" } => {
    if (!product.inStock) {
        return { text: "Made on Order", variant: "secondary" };
    }
    if (product.stockQuantity > 0) {
        return { text: `${product.stockQuantity} in stock`, variant: "default" };
    }
    return { text: "Out of Stock", variant: "destructive" };
  }

  return (
    <div className="relative w-full overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Image</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="hidden md:table-cell">Price</TableHead>
          <TableHead className="hidden md:table-cell">Stock</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => {
          const categoryName = categoryMap.get(product.categoryId) || 'Uncategorized';
          const stockStatus = getStockStatus(product);
          return (
            <TableRow key={product.id}>
              <TableCell className="hidden sm:table-cell">
                {product.image ? (
                  <Image
                    alt={product.name}
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={product.image}
                    width="64"
                  />
                ) : (
                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center text-xs">No Image</div>
                )}
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{categoryName}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                EGP {product.price.toLocaleString()}
              </TableCell>
               <TableCell className="hidden md:table-cell">
                 <Badge variant={stockStatus.variant}>{stockStatus.text}</Badge>
              </TableCell>
              <TableCell>
                <AlertDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        aria-haspopup="true"
                        size="icon"
                        variant="ghost"
                        disabled={isDeleting === product.id}
                      >
                        {isDeleting === product.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(product)}>
                        Edit
                      </DropdownMenuItem>
                       <DropdownMenuSeparator />
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                   <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the product
                                <span className="font-bold"> {product.name}</span>.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() => onDelete(product.id)}
                            >
                                Yes, delete product
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
    </div>
  );
}
