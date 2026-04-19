'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product, Category } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductForm } from './components/product-form';
import { ProductTable } from './components/product-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteProduct } from '@/lib/services/products';
import { useToast } from '@/hooks/use-toast';

export function ProductClientPage({ products, categories }: { products: Product[], categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleAdd = () => {
    setSelectedProduct(undefined);
    setOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleDelete = async (productId: string) => {
    setIsDeleting(productId);
    const { error } = await deleteProduct(productId);
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error Deleting Product',
        description: error,
      });
    } else {
      toast({
        title: 'Product Deleted',
        description: 'The product has been successfully removed.',
      });
      router.refresh();
    }
    setIsDeleting(null);
  }
  
  const handleFormFinished = () => {
      setOpen(false);
      router.refresh();
  }

  return (
    <>
       <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Products</CardTitle>
          <CardDescription>View, edit, and add new products to your store.</CardDescription>
        </CardHeader>
        <CardContent>
            <ProductTable 
              products={products} 
              categories={categories} 
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
        </CardContent>
         <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{products.length}</strong> of <strong>{products.length}</strong> products
          </div>
        </CardFooter>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <ProductForm 
            product={selectedProduct} 
            categories={categories} 
            onFinished={handleFormFinished} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
