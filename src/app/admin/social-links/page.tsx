'use client';
import { SocialLinksClientPage } from './client';
import { useAppContext } from '@/context/app-provider';

export default function AdminSocialLinksPage() {
  const { socialLinks } = useAppContext();
  return <SocialLinksClientPage links={socialLinks} />;
}
