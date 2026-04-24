
'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShoppingCart,
  UserCircle,
  Menu,
  Package,
  FileQuestion,
  Shield,
  LogOut,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "./logo";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { mockCategories, mockContactInfo } from "@/lib/demo-data";
import type { UserProfile, Category } from "@/lib/types";

// Mock user for demo purposes
const user: { displayName: string; profile: UserProfile } = {
  displayName: "Demo User",
  profile: {
    id: "user-super-admin",
    name: "Super Admin",
    email: "super_admin@example.com",
    phoneNumber: "01000000001",
    role: 'super_admin',
    wishlist: [],
  }
};


export function Header() {
  const router = useRouter();
  const { toast } = useToast();
  const categories: Category[] = mockCategories;
  const storeStatus = mockContactInfo.storeStatus;

  const handleLogout = () => {
    toast({ title: "Logged Out (Demo)", description: "You have been successfully logged out." });
    router.push("/");
  };

  const isAdmin = user?.profile?.role === 'admin' || user?.profile?.role === 'super_admin';


  return (
    <>
      {storeStatus === 'closed' && (
          <div className="bg-destructive text-destructive-foreground text-center py-2 px-4 text-sm font-medium flex items-center justify-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              The store is temporarily closed. Ordering is currently unavailable.
          </div>
      )}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="mr-6 flex items-center gap-2">
            <Logo />
            <span className="font-headline text-lg font-bold">MicroChub</span>
          </Link>

          <nav className="hidden md:flex md:items-center md:gap-6 text-sm font-medium">
            <Link
              href="/products"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Products
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground focus:outline-none">
                Categories
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                    <Link href="/products">All Products</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {categories.map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link href={`/products?category=${category.slug}`}>{category.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/custom-services"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Custom Services
            </Link>
            <Link
              href="/diy-kits"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              DIY Kits
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
          </nav>

          <div className="flex flex-1 items-center justify-end gap-2">
            <Button asChild variant="ghost" size="icon" aria-label="Wishlist">
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" aria-label="Cart" className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="User Account">
                  <UserCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user ? (
                  <>
                    <DropdownMenuLabel>Hi, {user.displayName}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/orders">
                        <Package className="mr-2 h-4 w-4" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/quotes">
                        <FileQuestion className="mr-2 h-4 w-4" />
                        My Quotes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/login">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/signup">Sign Up</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="mr-6 flex items-center gap-2 mb-6">
                      <Logo />
                      <span className="font-headline text-lg font-bold">
                        MicroChub
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="grid gap-4 text-lg font-medium">
                  <Link
                    href="/products"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    Products
                  </Link>
                  <Accordion type="single" collapsible className="w-full -my-2 text-lg font-medium">
                      <AccordionItem value="categories" className="border-b-0">
                      <AccordionTrigger className="flex items-center justify-between w-full px-2.5 py-2 text-muted-foreground hover:text-foreground hover:no-underline">
                          <span className="flex items-center gap-4">Categories</span>
                      </AccordionTrigger>
                      <AccordionContent className="pl-12">
                          <div className="grid gap-2 pt-2">
                          <Link href="/products" className="text-base text-muted-foreground hover:text-foreground">
                              All Products
                          </Link>
                          {categories.map((category) => (
                              <Link
                              key={category.id}
                              href={`/products?category=${category.slug}`}
                              className="text-base text-muted-foreground hover:text-foreground"
                              >
                              {category.name}
                              </Link>
                          ))}
                          </div>
                      </AccordionContent>
                      </AccordionItem>
                  </Accordion>
                  <Link
                    href="/custom-services"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    Custom Services
                  </Link>
                  <Link
                    href="/diy-kits"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    DIY Kits
                  </Link>
                  <Link
                    href="/about"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    About
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
