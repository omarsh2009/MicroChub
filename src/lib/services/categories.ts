import type { Category, ServiceResponse } from '../types';

import { 
    getCategories as mockGetCategories,
    addCategory as mockAddCategory,
    updateCategory as mockUpdateCategory,
    deleteCategory as mockDeleteCategory,
} from '@/lib/mocks/categories';

export async function getCategories(): Promise<ServiceResponse<Category[]>> {
    return mockGetCategories();
}

export async function addCategory(data: Omit<Category, 'id' | 'slug'>): Promise<ServiceResponse<string>> {
    return mockAddCategory(data);
}

export async function updateCategory(id: string, data: Partial<Omit<Category, 'id'>>): Promise<ServiceResponse<void>> {
    return mockUpdateCategory(id, data);
}

export async function deleteCategory(id: string): Promise<ServiceResponse<void>> {
    return mockDeleteCategory(id);
}
