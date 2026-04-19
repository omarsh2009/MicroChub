
'use client';
import type { LegalAgreement, ServiceResponse } from '../types';
import { api } from '@/lib/api';

export async function getLegalAgreement(): Promise<ServiceResponse<LegalAgreement | null>> {
    return api.get<LegalAgreement | null>('/legal/agreement');
}

export async function saveLegalAgreement(agreement: LegalAgreement): Promise<ServiceResponse<void>> {
    return api.post<void>('/legal/agreement', agreement);
}
