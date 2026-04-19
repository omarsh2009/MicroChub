'use client';

import type { LegalAgreement, ServiceResponse } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const LEGAL_AGREEMENT_KEY = 'global_legal_agreement';

export async function getLegalAgreement(): Promise<ServiceResponse<LegalAgreement | null>> {
    await sleep(200);
    try {
        if (typeof window === 'undefined') return { data: null, error: null, status: 200 };
        const stored = localStorage.getItem(LEGAL_AGREEMENT_KEY);
        const data = stored ? JSON.parse(stored) : null;
        return { data, error: null, status: 200 };
    } catch (e: any) {
        return { data: null, error: e.message || 'Failed to fetch legal agreement.', status: 500 };
    }
}

export async function saveLegalAgreement(agreement: LegalAgreement): Promise<ServiceResponse<void>> {
    await sleep(300);
    try {
        if (typeof window === 'undefined') return { data: null, error: 'localStorage is not available.', status: 500 };
        localStorage.setItem(LEGAL_AGREEMENT_KEY, JSON.stringify(agreement));
        console.log("Mock API: Saved global legal agreement", agreement.fileName);
        return { data: null, error: null, status: 200 };
    } catch (e: any) {
        return { data: null, error: e.message || 'Failed to save legal agreement.', status: 500 };
    }
}
