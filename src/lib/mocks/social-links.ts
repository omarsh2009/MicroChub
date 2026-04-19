
'use client';
import type { SocialLink, ServiceResponse } from '../types';

export async function getSocialLinks(onlyEnabled = false): Promise<ServiceResponse<SocialLink[]>> {
    throw new Error('API not implemented: getSocialLinks');
}

export async function addSocialLink(data: Omit<SocialLink, 'id'>): Promise<ServiceResponse<SocialLink>> {
    throw new Error('API not implemented: addSocialLink');
}

export async function updateSocialLink(id: string, data: Partial<SocialLink>): Promise<ServiceResponse<SocialLink>> {
  throw new Error('API not implemented: updateSocialLink');
}

export async function deleteSocialLink(id: string): Promise<ServiceResponse<void>> {
    throw new Error('API not implemented: deleteSocialLink');
}
