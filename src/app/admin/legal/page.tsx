
import { PolicyClientPage } from './client';
import { mockPolicies } from '@/lib/demo-data';

export default function AdminPolicyPage() {
  return <PolicyClientPage policies={mockPolicies} />;
}
