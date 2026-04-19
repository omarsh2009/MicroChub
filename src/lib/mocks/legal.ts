
'use client';
import type { LegalAgreement, ServiceResponse } from '../types';

export async function getLegalAgreement(): Promise<ServiceResponse<LegalAgreement | null>> {
    throw new Error('API not implemented: getLegalAgreement');
}

export async function saveLegalAgreement(agreement: LegalAgreement): Promise<ServiceResponse<void>> {
    throw new Error('API not implemented: saveLegalAgreement');
}
