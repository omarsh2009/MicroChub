
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
import { useAppContext } from '@/context/app-provider';

export function CategoriesClientPage() {
  const { categories, setCategories } = useAppContext();
  const { toast } = useToast();
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
    setCategories(categories.filter(c => c.id !== categoryId));
    toast({
        title: 'Category Deleted',
        description: 'The category has been removed.',
    });
  }

  const onFormSubmit = async (values: { name: string }, id?: string) => {
    if (id) {
        setCategories(categories.map(c => c.id === id ? { ...c, name: values.name, slug: values.name.toLowerCase().replace(/ /g, '-') } : c));
    } else {
        const newCat: Category = {
            id: `cat-${Date.now()}`,
            name: values.name,
            slug: values.name.toLowerCase().replace(/ /g, '-'),
        };
        setCategories([...categories, newCat]);
    }
    toast({
        title: 'Saved',
        description: 'Category changes updated successfully.',
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
