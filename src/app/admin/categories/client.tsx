'use client';
import { useState, useEffect } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
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
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/lib/categories';
import { CategoriesTable } from './components/categories-table';
import { CategoryForm } from './components/category-form';

export function CategoriesClientPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    getCategories()
      .then(setCategories)
      .catch(err => toast({ variant: 'destructive', title: 'Error fetching categories' }))
      .finally(() => setLoading(false));
  }, [toast]);

  const handleAdd = () => {
    setSelectedCategory(undefined);
    setOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setOpen(true);
  };
  
  const handleDelete = async (categoryId: string) => {
    try {
        await deleteCategory(categoryId);
        setCategories(prev => prev.filter(c => c.id !== categoryId));
        toast({ title: 'Category Deleted' });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Failed to delete category' });
    }
  }

  const onFormSubmit = async (values: Omit<Category, 'id' | 'slug'>, id?: string) => {
    try {
      if (id) {
        await updateCategory(id, values);
        const slug = values.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        setCategories(prev => prev.map(m => m.id === id ? { ...m, ...values, id, slug } : m));
        toast({ title: 'Category Updated' });
      } else {
        const newSlug = await addCategory(values);
        setCategories(prev => [...prev, { id: newSlug, slug: newSlug, ...values }]);
        toast({ title: 'Category Added' });
      }
      setOpen(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Save failed' });
    }
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
            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : (
                <CategoriesTable categories={categories} onEdit={handleEdit} onDelete={handleDelete} />
            )}
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
