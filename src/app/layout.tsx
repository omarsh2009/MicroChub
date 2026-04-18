import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { MainLayout } from "@/components/main-layout";
import { AuthProvider } from "@/auth/provider";
import { CartProvider } from "@/context/cart-provider";
import { WishlistProvider } from "@/context/wishlist-provider";

export const metadata: Metadata = {
  title: "MicroChub - Electronics for Makers",
  description:
    "Your one-stop shop for electronics, embedded systems, and custom hardware in Egypt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          "font-body antialiased",
        )}
      >
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <MainLayout>{children}</MainLayout>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
