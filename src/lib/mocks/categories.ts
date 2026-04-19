
'use client';
import type { Category, ServiceResponse } from '../types';

export async function getCategories(): Promise<ServiceResponse<Category[]>> {
    throw new Error('API not implemented: getCategories');
}

export async function addCategory(data: Omit<Category, 'id' | 'slug'>): Promise<ServiceResponse<Category>> {
    throw new Error('API not implemented: addCategory');
}

export async function updateCategory(id: string, data: Partial<Omit<Category, 'id'>>): Promise<ServiceResponse<Category>> {
    throw new Error('API not implemented: updateCategory');
}

export async function deleteCategory(id: string): Promise<ServiceResponse<void>> {
    throw new Error('API not implemented: deleteCategory');
}
