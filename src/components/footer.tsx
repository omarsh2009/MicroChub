
'use client';
import Link from "next/link";
import { Logo } from "./logo";
import { SocialLink } from "@/lib/types";
import { mockSocialLinks } from "@/lib/demo-data";
import { Facebook, Github, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  const socialLinks: SocialLink[] = mockSocialLinks.filter(link => link.enabled);

  const getIconForPlatform = (platform: string) => {
    switch (platform.toLowerCase()) {
        case 'facebook': return <Facebook className="w-5 h-5" />;
        case 'github': return <Github className="w-5 h-5" />;
        case 'instagram': return <Instagram className="w-5 h-5" />;
        case 'linkedin': return <Linkedin className="w-5 h-5" />;
        case 'twitter': return <Twitter className="w-5 h-5" />;
        case 'youtube': return <Youtube className="w-5 h-5" />;
        default: return null;
    }
  };

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
                <Link href="/policy" className="text-sm hover:text-primary transition-colors" prefetch={false}>
                  Our Policy
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
