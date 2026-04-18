'use client';
import { mockSocialLinks } from './data';
import type { SocialLink } from './types';

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

export async function getSocialLinks(onlyEnabled = false): Promise<SocialLink[]> {
    await sleep(200);
    const links = getStoredSocialLinks();
    if (onlyEnabled) {
        return links.filter(link => link.enabled);
    }
    return links;
}

export async function addSocialLink(data: Omit<SocialLink, 'id'>): Promise<string> {
    await sleep(300);
    const links = getStoredSocialLinks();
    const newId = `sl-${Date.now()}`;
    const newLink: SocialLink = { id: newId, ...data };
    const updatedLinks = [...links, newLink];
    setStoredSocialLinks(updatedLinks);
    console.log("Mock API: Added new social link", newLink);
    return newId;
}

export async function updateSocialLink(id: string, data: Partial<SocialLink>): Promise<void> {
  await sleep(300);
  const links = getStoredSocialLinks();
  const index = links.findIndex(l => l.id === id);
  if (index !== -1) {
    links[index] = { ...links[index], ...data };
    setStoredSocialLinks(links);
    console.log("Mock API: Updated social link", links[index]);
  }
}

export async function deleteSocialLink(id: string): Promise<void> {
    await sleep(300);
    const links = getStoredSocialLinks();
    const updatedLinks = links.filter(l => l.id !== id);
    setStoredSocialLinks(updatedLinks);
    console.log(`Mock API: Deleted social link ${id}`);
}
