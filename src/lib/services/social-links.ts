
import type { SocialLink, ServiceResponse } from '../types';
import { mockSocialLinks } from '@/lib/mock-data';

export async function getSocialLinks(onlyEnabled = false): Promise<ServiceResponse<SocialLink[]>> {
    if (onlyEnabled) {
        return { success: true, data: mockSocialLinks.filter(l => l.enabled), error: null };
    }
    return { success: true, data: mockSocialLinks, error: null };
}

export async function addSocialLink(data: Omit<SocialLink, 'id'>): Promise<ServiceResponse<SocialLink>> {
    const newLink: SocialLink = {
        ...data,
        id: `soc_${Math.random().toString(36).substring(2, 9)}`,
    };
    mockSocialLinks.push(newLink);
    return { success: true, data: newLink, error: null };
}

export async function updateSocialLink(id: string, data: Partial<SocialLink>): Promise<ServiceResponse<SocialLink>> {
  const linkIndex = mockSocialLinks.findIndex(l => l.id === id);
  if (linkIndex === -1) {
    return { success: false, data: null, error: { message: 'Social link not found.' } };
  }
  const updatedLink = { ...mockSocialLinks[linkIndex], ...data };
  mockSocialLinks[linkIndex] = updatedLink;
  return { success: true, data: updatedLink, error: null };
}

export async function deleteSocialLink(id: string): Promise<ServiceResponse<void>> {
    const linkIndex = mockSocialLinks.findIndex(l => l.id === id);
    if (linkIndex > -1) {
        mockSocialLinks.splice(linkIndex, 1);
    }
    return { success: true, data: null, error: null };
}

    