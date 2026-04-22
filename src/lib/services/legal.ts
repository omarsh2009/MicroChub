
import type { LegalAgreement, ServiceResponse } from '../types';
import { mockLegalAgreement } from '@/lib/mock-data';

// Keep an in-memory copy to simulate updates
let currentLegalAgreement = { ...mockLegalAgreement };

export async function getLegalAgreement(): Promise<ServiceResponse<LegalAgreement | null>> {
    return { success: true, data: currentLegalAgreement, error: null };
}

export async function saveLegalAgreement(agreement: LegalAgreement): Promise<ServiceResponse<void>> {
    currentLegalAgreement.fileName = agreement.fileName;
    currentLegalAgreement.fileContent = agreement.fileContent;
    currentLegalAgreement.uploadedAt = agreement.uploadedAt;
    return { success: true, data: null, error: null };
}

    