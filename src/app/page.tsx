'use client';

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CircuitBoard,
  Cpu,
  Fingerprint,
  HardDrive,
  Rocket,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/app-provider";

const categoryIcons: Record<string, React.ReactNode> = {
  mochi: <Fingerprint className="h-8 w-8" />,
  "esp-devices": <Cpu className="h-8 w-8" />,
  "arduino-projects": <CircuitBoard className="h-8 w-8" />,
  "smart-displays": <HardDrive className="h-8 w-8" />,
};

export default function Home() {
  const { products, categories } = useAppContext();
  const featuredProducts = products.filter(p => p.featured);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <section className="relative w-full py-24 md:py-32 lg:py-40 xl:py-48">
        <div className="absolute inset-0 bg-grid-purple/[0.05]"></div>
        <div className="container px-4 md:px-6 text-center z-10 relative">
          <div className="flex flex-col items-center space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Build. Hack. Innovate.
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              MicroChub is your local hub for cutting-edge electronics,
              prototyping tools, and custom hardware services. Unleash your
              inner maker.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="group">
                <Link href="/products">
                  Shop Products
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/custom-services">Request a Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="font-headline text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl mb-12">
            Explore Our Arsenal
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link href={`/products?category=${category.slug}`} key={category.id}>
                <Card className="group hover:border-primary transition-colors duration-300 transform hover:-translate-y-1">
                  <CardHeader className="flex flex-col items-center justify-center text-center p-6">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                      {categoryIcons[category.slug] || (
                        <Wrench className="h-8 w-8" />
                      )}
                    </div>
                    <CardTitle className="font-headline text-xl">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="featured" className="w-full py-12 md:py-24 lg:py-32 bg-card">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Featured Gear
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl mt-4">
              Hand-picked tools and kits to kickstart your next big project.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                categories={categories}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="custom" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-4">
            <Badge variant="outline" className="py-1 px-3">Custom Services</Badge>
            <h2 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Got a Custom Project?
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              From PCB design to full-stack embedded systems, our engineers can
              bring your vision to life. If you can dream it, we can build it.
            </p>
            <ul className="grid gap-2 py-4">
              <li>
                <div className="grid grid-flow-col auto-cols-max items-start gap-2">
                  <Rocket className="w-5 h-5 mt-1 text-primary" />
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold">Concept to Reality</h3>
                    <p className="text-muted-foreground">Full-cycle product development.</p>
                  </div>
                </div>
              </li>
              <li>
                <div className="grid grid-flow-col auto-cols-max items-start gap-2">
                  <CircuitBoard className="w-5 h-5 mt-1 text-primary" />
                   <div className="space-y-1">
                    <h3 className="text-lg font-bold">PCB & Schematic Design</h3>
                    <p className="text-muted-foreground">Professional-grade circuit design and layout.</p>
                  </div>
                </div>
              </li>
              <li>
                <div className="grid grid-flow-col auto-cols-max items-start gap-2">
                  <Cpu className="w-5 h-5 mt-1 text-primary" />
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold">Firmware Development</h3>
                    <p className="text-muted-foreground">Custom code for any microcontroller.</p>
                  </div>
                </div>
              </li>
            </ul>
            <Button asChild size="lg" className="group">
              <Link href="/custom-services">
                Get Your Free Quote
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          <div className="relative">
            <Image
              src="https://picsum.photos/seed/circuits/600/600"
              alt="Custom Services"
              width={600}
              height={600}
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
              data-ai-hint="circuit board"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
