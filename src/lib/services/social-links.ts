
import type { SocialLink, ServiceResponse } from '../types';
import { api } from '@/lib/api';

export async function getSocialLinks(onlyEnabled = false): Promise<ServiceResponse<SocialLink[]>> {
    return api.get<SocialLink[]>(`/social-links${onlyEnabled ? '?enabled=true' : ''}`);
}

export async function addSocialLink(data: Omit<SocialLink, 'id'>): Promise<ServiceResponse<SocialLink>> {
    return api.post<SocialLink>('/social-links', data);
}

export async function updateSocialLink(id: string, data: Partial<SocialLink>): Promise<ServiceResponse<SocialLink>> {
  return api.put<SocialLink>(`/social-links/${id}`, data);
}

export async function deleteSocialLink(id: string): Promise<ServiceResponse<void>> {
    return api.delete<void>(`/social-links/${id}`);
}
