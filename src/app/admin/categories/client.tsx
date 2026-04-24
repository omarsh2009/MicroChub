
'use client';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/lib/types';
import { CategoriesTable } from './components/categories-table';
import { CategoryForm } from './components/category-form';

export function CategoriesClientPage({ categories: initialCategories }: { categories: Category[]}) {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);

  const handleAdd = () => {
    setSelectedCategory(undefined);
    setOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setOpen(true);
  };
  
  const handleDelete = (categoryId: string) => {
    toast({
        variant: 'destructive',
        title: 'Delete Action (Demo)',
        description: 'This action is disabled in the static UI demo.',
    });
  }

  const onFormSubmit = async (values: Omit<Category, 'id' | 'slug'>, id?: string) => {
    toast({
        title: 'Saved (Demo)',
        description: 'Category changes would be saved in a real application.',
    });
    setOpen(false);
  };

  return (
    <>
       <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Categories</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Product Categories</CardTitle>
          <CardDescription>Organize your products by creating and managing categories.</CardDescription>
        </CardHeader>
        <CardContent>
            <CategoriesTable categories={categories} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedCategory ? 'Edit' : 'Add'} Category</DialogTitle>
          </DialogHeader>
          <CategoryForm
            category={selectedCategory}
            onSubmit={onFormSubmit}
            onFinished={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
