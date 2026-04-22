
import type { Category, ServiceResponse } from '../types';
import { api } from '@/lib/api';
import { mockCategories } from '@/lib/mock-data';

export async function getCategories(): Promise<ServiceResponse<Category[]>> {
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate network delay
    return { success: true, data: mockCategories, error: null };
}

export async function addCategory(data: Omit<Category, 'id' | 'slug'>): Promise<ServiceResponse<Category>> {
    return api.post<Category>('/categories', data);
}

export async function updateCategory(id: string, data: Partial<Omit<Category, 'id'>>): Promise<ServiceResponse<Category>> {
    return api.put<Category>(`/categories/${id}`, data);
}

export async function deleteCategory(id: string): Promise<ServiceResponse<void>> {
    return api.delete<void>(`/categories/${id}`);
}
