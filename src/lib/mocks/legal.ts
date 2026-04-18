'use client';

import type { LegalAgreement } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const LEGAL_AGREEMENT_KEY = 'global_legal_agreement';

export async function getLegalAgreement(): Promise<LegalAgreement | null> {
    await sleep(200);
    if (typeof window === 'undefined') return null;

    const stored = localStorage.getItem(LEGAL_AGREEMENT_KEY);
    return stored ? JSON.parse(stored) : null;
}

export async function saveLegalAgreement(agreement: LegalAgreement): Promise<void> {
    await sleep(300);
    if (typeof window === 'undefined') return;

    localStorage.setItem(LEGAL_AGREEMENT_KEY, JSON.stringify(agreement));
    console.log("Mock API: Saved global legal agreement", agreement.fileName);
}
