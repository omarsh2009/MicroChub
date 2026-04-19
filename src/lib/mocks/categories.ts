
import type { Category, ServiceResponse } from '../types';

export async function getCategories(): Promise<ServiceResponse<Category[]>> {
    throw new Error('API not implemented: mockGetCategories');
}

export async function addCategory(data: Omit<Category, 'id' | 'slug'>): Promise<ServiceResponse<string>> {
    throw new Error('API not implemented: mockAddCategory');
}

export async function updateCategory(id: string, data: Partial<Omit<Category, 'id'>>): Promise<ServiceResponse<void>> {
  throw new Error('API not implemented: mockUpdateCategory');
}

export async function deleteCategory(id: string): Promise<ServiceResponse<void>> {
    throw new Error('API not implemented: mockDeleteCategory');
}
