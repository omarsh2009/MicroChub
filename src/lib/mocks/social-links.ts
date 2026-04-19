'use client';
import { mockSocialLinks } from './data';
import type { SocialLink, ServiceResponse } from '../types';

// MOCK API - simulates localStorage for social links
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const SOCIAL_LINKS_STORAGE_KEY = 'microchub-social-links';

function getStoredSocialLinks(): SocialLink[] {
    if (typeof window === 'undefined') return mockSocialLinks;
    const stored = localStorage.getItem(SOCIAL_LINKS_STORAGE_KEY);
    if (!stored || JSON.parse(stored).length === 0) {
        setStoredSocialLinks(mockSocialLinks);
        return mockSocialLinks;
    }
    return JSON.parse(stored);
}

function setStoredSocialLinks(links: SocialLink[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SOCIAL_LINKS_STORAGE_KEY, JSON.stringify(links));
}

export async function getSocialLinks(onlyEnabled = false): Promise<ServiceResponse<SocialLink[]>> {
    await sleep(200);
    try {
        let links = getStoredSocialLinks();
        if (onlyEnabled) {
            links = links.filter(link => link.enabled);
        }
        return { data: links, error: null, status: 200 };
    } catch (e: any) {
        return { data: null, error: e.message || 'Failed to fetch social links.', status: 500 };
    }
}

export async function addSocialLink(data: Omit<SocialLink, 'id'>): Promise<ServiceResponse<string>> {
    await sleep(300);
    try {
        const links = getStoredSocialLinks();
        const newId = `sl-${Date.now()}`;
        const newLink: SocialLink = { id: newId, ...data };
        const updatedLinks = [...links, newLink];
        setStoredSocialLinks(updatedLinks);
        console.log("Mock API: Added new social link", newLink);
        return { data: newId, error: null, status: 201 };
    } catch (e: any) {
        return { data: null, error: e.message || 'Failed to add social link.', status: 500 };
    }
}

export async function updateSocialLink(id: string, data: Partial<SocialLink>): Promise<ServiceResponse<void>> {
  await sleep(300);
  try {
    const links = getStoredSocialLinks();
    const index = links.findIndex(l => l.id === id);
    if (index !== -1) {
      links[index] = { ...links[index], ...data };
      setStoredSocialLinks(links);
      console.log("Mock API: Updated social link", links[index]);
      return { data: null, error: null, status: 200 };
    }
    return { data: null, error: 'Social link not found.', status: 404 };
  } catch (e: any) {
    return { data: null, error: e.message || 'Failed to update social link.', status: 500 };
  }
}

export async function deleteSocialLink(id: string): Promise<ServiceResponse<void>> {
    await sleep(300);
    try {
        const links = getStoredSocialLinks();
        const updatedLinks = links.filter(l => l.id !== id);
        setStoredSocialLinks(updatedLinks);
        console.log(`Mock API: Deleted social link ${id}`);
        return { data: null, error: null, status: 200 };
    } catch (e: any) {
        return { data: null, error: e.message || 'Failed to delete social link.', status: 500 };
    }
}
