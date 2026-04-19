'use client';
import type { SocialLink, ServiceResponse } from '../types';

import {
    getSocialLinks as mockGetSocialLinks,
    addSocialLink as mockAddSocialLink,
    updateSocialLink as mockUpdateSocialLink,
    deleteSocialLink as mockDeleteSocialLink,
} from '@/lib/mocks/social-links';

export async function getSocialLinks(onlyEnabled = false): Promise<ServiceResponse<SocialLink[]>> {
    return mockGetSocialLinks(onlyEnabled);
}

export async function addSocialLink(data: Omit<SocialLink, 'id'>): Promise<ServiceResponse<string>> {
    return mockAddSocialLink(data);
}

export async function updateSocialLink(id: string, data: Partial<SocialLink>): Promise<ServiceResponse<void>> {
  return mockUpdateSocialLink(id, data);
}

export async function deleteSocialLink(id: string): Promise<ServiceResponse<void>> {
    return mockDeleteSocialLink(id);
}
