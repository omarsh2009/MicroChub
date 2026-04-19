
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
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/lib/services/categories';
import { CategoriesTable } from './components/categories-table';
import { CategoryForm } from './components/category-form';

export function CategoriesClientPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await getCategories();
    if (error || !data) {
        toast({ variant: 'destructive', title: 'Error fetching categories', description: error?.message });
        setCategories([]);
    } else {
        setCategories(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setSelectedCategory(undefined);
    setOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setOpen(true);
  };
  
  const handleDelete = async (categoryId: string) => {
    const { error } = await deleteCategory(categoryId);
    if (error) {
        toast({ variant: 'destructive', title: 'Failed to delete category', description: error.message });
    } else {
        setCategories(prev => prev.filter(c => c.id !== categoryId));
        toast({ title: 'Category Deleted' });
    }
  }

  const onFormSubmit = async (values: Omit<Category, 'id' | 'slug'>, id?: string) => {
    if (id) {
      const { error } = await updateCategory(id, values);
      if (error) {
        toast({ variant: 'destructive', title: 'Update failed', description: error.message });
      } else {
        await fetchCategories(); // Refetch to get updated data
        toast({ title: 'Category Updated' });
        setOpen(false);
      }
    } else {
      const { data: newCategory, error } = await addCategory(values);
      if (error || !newCategory) {
        toast({ variant: 'destructive', title: 'Save failed', description: error?.message });
      } else {
        await fetchCategories(); // Refetch to get new data
        toast({ title: 'Category Added' });
        setOpen(false);
      }
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
