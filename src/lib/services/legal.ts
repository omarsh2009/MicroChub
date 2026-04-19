'use client';
import type { LegalAgreement, ServiceResponse } from '../types';

import {
    getLegalAgreement as mockGetLegalAgreement,
    saveLegalAgreement as mockSaveLegalAgreement,
} from '@/lib/mocks/legal';

export async function getLegalAgreement(): Promise<ServiceResponse<LegalAgreement | null>> {
    return mockGetLegalAgreement();
}

export async function saveLegalAgreement(agreement: LegalAgreement): Promise<ServiceResponse<void>> {
    return mockSaveLegalAgreement(agreement);
}
