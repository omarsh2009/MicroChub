
'use client';
import type { SocialLink, ServiceResponse } from '../types';

export async function getSocialLinks(onlyEnabled = false): Promise<ServiceResponse<SocialLink[]>> {
    throw new Error('API not implemented: mockGetSocialLinks');
}

export async function addSocialLink(data: Omit<SocialLink, 'id'>): Promise<ServiceResponse<string>> {
    throw new Error('API not implemented: mockAddSocialLink');
}

export async function updateSocialLink(id: string, data: Partial<SocialLink>): Promise<ServiceResponse<void>> {
  throw new Error('API not implemented: mockUpdateSocialLink');
}

export async function deleteSocialLink(id: string): Promise<ServiceResponse<void>> {
    throw new Error('API not implemented: mockDeleteSocialLink');
}
