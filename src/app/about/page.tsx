import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Rocket } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="relative w-full py-24 md:py-32 lg:py-40">
        <div className="absolute inset-0 bg-grid-purple/[0.05]"></div>
        <div className="container px-4 md:px-6 text-center z-10 relative">
          <div className="flex flex-col items-center space-y-4">
            <Badge variant="outline" className="py-1 px-3">
              About Us
            </Badge>
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Empowering Makers in Egypt
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              MicroChub is more than just a store. We are a community of passionate builders, hackers, and innovators dedicated to making electronics accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container grid items-center gap-12 px-4 md:px-6 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-4">
            <h2 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Our Story
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Founded in a small workshop in Cairo, MicroChub started with a simple idea: to provide local makers, students, and professionals with the tools and components they need to bring their ideas to life. We were tired of the long shipping times, high costs, and lack of local support for electronics enthusiasts.
            </p>
            <p className="text-muted-foreground md:text-lg">
              Today, we're proud to be a leading supplier of electronics in the region, offering everything from basic components to advanced development boards and custom-designed hardware. But our mission remains the same: to foster a vibrant maker culture and empower the next generation of innovators.
            </p>
          </div>
          <div className="relative">
            <Image
              src="https://picsum.photos/seed/workshop/600/600"
              alt="Our Workshop"
              width={600}
              height={600}
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
              data-ai-hint="electronics workshop"
            />
          </div>
        </div>
      </section>
      
      <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <Rocket className="w-12 h-12 mb-4 text-primary" />
              <h3 className="font-headline text-2xl font-bold">Our Mission</h3>
              <p className="text-muted-foreground mt-2">
                To provide the best tools, resources, and support for the maker community in Egypt and beyond, breaking down barriers to innovation.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Target className="w-12 h-12 mb-4 text-primary" />
              <h3 className="font-headline text-2xl font-bold">Our Vision</h3>
              <p className="text-muted-foreground mt-2">
                To be the central hub for hardware innovation in the Middle East, fostering collaboration, learning, and groundbreaking projects.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Users className="w-12 h-12 mb-4 text-primary" />
              <h3 className="font-headline text-2xl font-bold">Our Team</h3>
              <p className="text-muted-foreground mt-2">
                We are a diverse team of engineers, designers, and makers, all united by a shared passion for technology and creation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
