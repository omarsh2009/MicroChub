import { mockCategories } from './data';
import type { Category } from '../types';

// MOCK API - simulates localStorage for categories
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const CATEGORIES_STORAGE_KEY = 'microchub-categories';

function getStoredCategories(): Category[] {
    if (typeof window === 'undefined') return mockCategories;
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    // Initialize with mock data if nothing is in localStorage
    if (!stored || JSON.parse(stored).length === 0) {
        setStoredCategories(mockCategories);
        return mockCategories;
    }
    return JSON.parse(stored);
}

function setStoredCategories(categories: Category[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
}

export async function getCategories(): Promise<Category[]> {
    await sleep(200);
    return getStoredCategories();
}

export async function addCategory(data: Omit<Category, 'id' | 'slug'>): Promise<string> {
    await sleep(300);
    const categories = getStoredCategories();
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const newCategory: Category = { id: slug, slug, ...data };
    const updatedCategories = [...categories, newCategory];
    setStoredCategories(updatedCategories);
    console.log("Mock API: Added new category", newCategory);
    return slug;
}

export async function updateCategory(id: string, data: Partial<Omit<Category, 'id'>>): Promise<void> {
  await sleep(300);
  const categories = getStoredCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index !== -1) {
    const newSlug = data.name ? data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') : categories[index].slug;
    categories[index] = { ...categories[index], ...data, slug: newSlug };
    setStoredCategories(categories);
    console.log("Mock API: Updated category", categories[index]);
  }
}

export async function deleteCategory(id: string): Promise<void> {
    await sleep(300);
    const categories = getStoredCategories();
    const updatedCategories = categories.filter(c => c.id !== id);
    setStoredCategories(updatedCategories);
    console.log(`Mock API: Deleted category ${id}`);
}
