'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { getSocialLinks } from "@/lib/services/social-links";
import { SocialLink } from "@/lib/types";
import { getIconForPlatform } from "@/app/admin/social-links/components/social-link-form";

export function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    getSocialLinks(true).then(({ data }) => setSocialLinks(data || []));
  }, []);

  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2" prefetch={false}>
              <Logo />
              <span className="font-headline text-xl font-bold">
                MicroChub
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your one-stop shop for electronics, embedded systems, and custom hardware in Egypt.
            </p>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-sm hover:text-primary transition-colors" prefetch={false}>
                  Products
                </Link>
              </li>
              <li>
                <Link href="/custom-services" className="text-sm hover:text-primary transition-colors" prefetch={false}>
                  Custom Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-primary transition-colors" prefetch={false}>
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-sm hover:text-primary transition-colors" prefetch={false}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm hover:text-primary transition-colors" prefetch={false}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm hover:text-primary transition-colors" prefetch={false}>
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                 <Link key={link.id} href={link.url} className="text-muted-foreground hover:text-primary" aria-label={link.platform} target="_blank" rel="noopener noreferrer">
                   {getIconForPlatform(link.platform)}
                 </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MicroChub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
