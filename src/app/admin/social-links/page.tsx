import { SocialLinksClientPage } from './client';
import { mockSocialLinks } from '@/lib/demo-data';

export default function AdminSocialLinksPage() {
  return <SocialLinksClientPage links={mockSocialLinks} />;
}
