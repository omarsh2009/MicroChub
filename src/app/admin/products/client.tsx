
'use client';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
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
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/app-provider';

export function ProductClientPage() {
  const { products, setProducts, categories } = useAppContext();
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const { toast } = useToast();

  const handleAdd = () => {
    setSelectedProduct(undefined);
    setOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleDelete = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    toast({
      title: 'Product Deleted',
      description: 'The product has been removed successfully.',
    });
  }
  
  const handleFormFinished = (values: any) => {
      if (selectedProduct) {
          setProducts(products.map(p => p.id === selectedProduct.id ? { ...p, ...values } : p));
      } else {
          const newProduct: Product = {
              ...values,
              id: `prod-${Date.now()}`,
              slug: values.name.toLowerCase().replace(/ /g, '-'),
              specs: {}, // In a real app we'd parse the technicalSpecs string
              useCases: [],
          };
          setProducts([...products, newProduct]);
      }
      setOpen(false);
      toast({
        title: 'Saved Successfully',
        description: 'Product changes have been applied.',
      });
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
              isDeleting={null}
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
