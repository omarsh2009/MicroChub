'use client';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';

export function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');

  return (
    <div
      className={cn(
        !isAdminPath && 'flex min-h-screen flex-col'
      )}
    >
      {!isAdminPath && <Header />}
      <main className="flex-1">{children}</main>
      {!isAdminPath && <Footer />}
    </div>
  );
}
