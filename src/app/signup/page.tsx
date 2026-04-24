'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { useAppContext } from "@/context/app-provider";
import { UserWithId } from "@/lib/types";

export default function SignupPage() {
  const { login } = useAppContext();
  const { toast } = useToast();
  const router = useRouter();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const phoneNumber = (form.elements.namedItem("phoneNumber") as HTMLInputElement).value;

    const newUser: UserWithId = {
      id: `user-${Date.now()}`,
      name,
      email,
      phoneNumber,
      role: 'user',
      wishlist: []
    };
    
    // In a real app, you would save the user to the database.
    // For this demo, we'll just log them in with the new details.
    login(newUser);

    toast({
      title: "Account Created! (Demo)",
      description: "Welcome to the MicroChub community.",
    });
    router.push("/");
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
           <div className="flex justify-center mb-4">
            <Logo className="h-10 w-10"/>
          </div>
          <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
          <CardDescription>Join the MicroChub community and start building</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" name="phoneNumber" placeholder="e.g. 01234567890" required/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" required/>
              </div>
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline text-primary">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
