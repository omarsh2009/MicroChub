'use client';

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { type Product, type Category } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, ShoppingCart, Wrench, AlertTriangle, Clock, FileQuestion, Loader2, Heart } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useMemo } from "react";
import { useCart } from '@/hooks/use-cart';
import { useUser } from "@/auth";
import { createQuoteRequest } from "@/lib/services/quotes";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { Separator } from "@/components/ui/separator";

export function ProductClientPage({ product, allProducts, categories }: { product: Product, allProducts: Product[], categories: Category[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const user = useUser();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string | string[]>>({});
  const [quantity, setQuantity] = useState(1);
  const [isRequestingQuote, setIsRequestingQuote] = useState(false);
  
  const [customNotes, setCustomNotes] = useState('');
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [isRequestingCustomQuote, setIsRequestingCustomQuote] = useState(false);

  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
  const inWishlist = isInWishlist(product.id);

  const calculatedPrice = useMemo(() => {
    let price = product.price;
    if (!product.customizationGroups) {
      return price;
    }

    Object.entries(selectedOptions).forEach(([groupName, selection]) => {
      const group = product.customizationGroups?.find(g => g.name === groupName);
      if (!group) return;

      const processOption = (optionName: string) => {
        const option = group.options.find(o => o.name === optionName);
        if (option && !option.requestQuote) {
            price += option.priceAdjustment;
        }
      }
      
      if (Array.isArray(selection)) {
          selection.forEach(processOption);
      } else if (typeof selection === 'string') {
          processOption(selection);
      }
    });

    return price;
  }, [selectedOptions, product]);
  
  const needsQuote = useMemo(() => {
    if (!product.customizationGroups) return false;

    return Object.entries(selectedOptions).some(([groupName, selection]) => {
      const group = product.customizationGroups?.find(g => g.name === groupName);
      if (!group) return false;

      const checkOptionForQuote = (optionName: string) => {
          const option = group.options.find(o => o.name === optionName);
          return option?.requestQuote;
      }

      if (Array.isArray(selection)) {
          return selection.some(checkOptionForQuote);
      } else if (typeof selection === 'string') {
          return checkOptionForQuote(selection);
      }
      return false;
    });
  }, [selectedOptions, product.customizationGroups]);


  const handleSingleSelectChange = (groupName: string, optionName: string) => {
    setSelectedOptions(prev => ({
        ...prev,
        [groupName]: optionName,
    }));
  };

  const handleMultiSelectChange = (groupName:string, optionName: string) => (isChecked: boolean | 'indeterminate') => {
      if (isChecked === 'indeterminate') return;
      setSelectedOptions(prev => {
          const currentSelection = (prev[groupName] as string[] | undefined) || [];
          let newSelection: string[];

          if (isChecked) {
              newSelection = [...currentSelection, optionName];
          } else {
              newSelection = currentSelection.filter(name => name !== optionName);
          }
          
          return {
              ...prev,
              [groupName]: newSelection,
          };
      });
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity, selectedOptions, discountedPrice);
  };
  
  const handleRequestQuote = async () => {
      if (!user) {
          toast({ variant: 'destructive', title: 'Please log in', description: 'You need to be logged in to request a quote.'});
          router.push(`/login?redirect=/products/${product.slug}`);
          return;
      }

      setIsRequestingQuote(true);
      try {
        await createQuoteRequest({
            userId: user.uid,
            product,
            quantity,
            configuration: selectedOptions,
            basePrice: product.price,
        });
        toast({
            title: 'Quote Request Sent!',
            description: "We've received your request and will get back to you with a quote shortly.",
        });
        router.push('/quotes');
      } catch (error: any) {
          console.error("Failed to create quote request:", error);
          toast({ variant: 'destructive', title: 'Request Failed', description: error.message || 'Could not send your quote request.' });
      } finally {
          setIsRequestingQuote(false);
      }
  };

  const handleCustomQuoteRequest = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Please log in', description: 'You need to be logged in to request a quote.' });
      router.push(`/products/${product.slug}`);
      return;
    }
    if (!customNotes) {
      toast({ variant: 'destructive', title: 'Description needed', description: 'Please describe your custom modification.' });
      return;
    }

    setIsRequestingCustomQuote(true);

    try {
      await createQuoteRequest({
        userId: user.uid,
        product,
        quantity: 1, // Default to 1 for custom requests
        configuration: { Customization: 'See Notes' },
        basePrice: product.price,
        userNotes: customNotes,
        file: customFile || undefined,
      });
      toast({
        title: 'Custom Quote Request Sent!',
        description: "We've received your request and will get back to you with a quote shortly.",
      });
      router.push('/quotes');
    } catch (error: any) {
      console.error("Failed to create custom quote request:", error);
      toast({ variant: 'destructive', title: 'Request Failed', description: error.message || 'Could not send your quote request.' });
    } finally {
      setIsRequestingCustomQuote(false);
    }
  };

  const handleWishlistToggle = () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Please log in', description: 'You need to be logged in to manage your wishlist.' });
      router.push(`/login?redirect=/products/${product.slug}`);
      return;
    }
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };


  const priceSuffix = needsQuote ? '+' : '';

  const discountedPrice = useMemo(() => {
    if (!product.discountValue || !product.discountType || product.discountType === 'none') {
      return calculatedPrice;
    }
    let discounted = calculatedPrice;
    if (product.discountType === 'fixed') {
      discounted = calculatedPrice - product.discountValue;
    }
    if (product.discountType === 'percentage') {
      discounted = calculatedPrice * (1 - product.discountValue / 100);
    }
    return discounted > 0 ? discounted : 0;
  }, [product, calculatedPrice]);
  
  const hasDiscount = discountedPrice !== calculatedPrice;
  
  const relatedProducts = useMemo(() => {
    if (!product || product.categoryIds.length === 0) {
      return [];
    }

    return allProducts
      .filter(p => 
        p.id !== product.id && // Exclude the current product
        p.categoryIds.some(catId => product.categoryIds.includes(catId)) // Find products with at least one shared category
      )
      .slice(0, 4); // Limit to 4 related products
  }, [product, allProducts]);


  return (
    <div className="py-12 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                <Image
                    src={product.image}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="aspect-square object-cover w-full"
                />
                </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <Link href="/products" className="text-sm text-muted-foreground hover:text-primary">
                &larr; Back to Products
              </Link>
              <div className="flex items-center gap-2 mt-4">
                {product.categoryIds.map(catId => <Badge key={catId} variant="outline">{categoryMap.get(catId) || catId}</Badge>)}
                {product.productType === 'build_to_order' ? (
                  <Badge variant="secondary">Made to Order</Badge>
                ) : (
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700">In Stock</Badge>
                )}
              </div>
              <h1 className="font-headline text-4xl lg:text-5xl font-bold mt-2">{product.name}</h1>
              <p className="text-muted-foreground text-lg mt-4">{product.description}</p>
            </div>
            
            {product.productType === 'build_to_order' && (
              <Alert variant="default" className="bg-primary/5 border-primary/20">
                  <Clock className="h-4 w-4 text-primary" />
                  <AlertTitle className="text-primary">Heads Up!</AlertTitle>
                  <AlertDescription>
                      This is a made-to-order item. Estimated production time is 7-14 business days.
                  </AlertDescription>
              </Alert>
            )}

            {product.isRestricted && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Restricted Product</AlertTitle>
                    <AlertDescription>
                        This product may be sensitive or regulated. You must complete and upload a signed legal agreement during checkout before purchase.
                        <Button variant="link" asChild className="p-0 h-auto ml-1 text-inherit hover:underline">
                            <a href="/MicroChub-Restricted-Item-Agreement.pdf" target="_blank" rel="noopener noreferrer" download>Download Agreement</a>
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold">
                EGP {discountedPrice.toLocaleString()}{priceSuffix}
              </span>
              {hasDiscount && (
                <span className="text-2xl font-medium text-muted-foreground line-through">
                  EGP {calculatedPrice.toLocaleString()}
                </span>
              )}
            </div>
            
            {product.customizationGroups && product.customizationGroups.length > 0 && (
              <div className="space-y-6">
                <h2 className="font-headline text-2xl font-bold flex items-center gap-2">
                  <Wrench className="w-6 h-6 text-primary"/>
                  Customize Your {product.name}
                </h2>
                {product.customizationGroups.map((group) => (
                  <Card key={group.name}>
                    <CardHeader>
                      <CardTitle className="text-xl">{group.name} {group.required && <span className="text-destructive text-sm ml-1">*</span>}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {group.type === 'single' ? (
                        <RadioGroup 
                          onValueChange={(value) => handleSingleSelectChange(group.name, value)}
                          value={selectedOptions[group.name] as string | undefined}
                          required={group.required}
                        >
                          {group.options.map(option => (
                            <div key={option.name} className="flex items-center space-x-2">
                              <RadioGroupItem value={option.name} id={`${group.name}-${option.name}`} />
                              <Label htmlFor={`${group.name}-${option.name}`} className="flex-grow flex justify-between items-center cursor-pointer">
                                <span>{option.name}</span>
                                {option.requestQuote ? (
                                    <Badge variant="outline">Request Quote</Badge>
                                ) : option.priceAdjustment !== 0 && (
                                    <span className="text-sm text-muted-foreground">{option.priceAdjustment > 0 ? '+':''}{'EGP'} {option.priceAdjustment.toLocaleString()}</span>
                                )}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      ) : (
                        <div className="space-y-2">
                          {group.options.map(option => (
                            <div key={option.name} className="flex items-center space-x-3">
                              <Checkbox 
                                id={`${group.name}-${option.name}`} 
                                onCheckedChange={handleMultiSelectChange(group.name, option.name)}
                                checked={((selectedOptions[group.name] as string[]) || []).includes(option.name)}
                              />
                               <Label htmlFor={`${group.name}-${option.name}`} className="flex-grow flex justify-between items-center cursor-pointer">
                                <span>{option.name}</span>
                                {option.requestQuote ? (
                                    <Badge variant="outline">Request Quote</Badge>
                                ) : option.priceAdjustment !== 0 && (
                                    <span className="text-sm text-muted-foreground">{option.priceAdjustment > 0 ? '+':''}{'EGP'} {option.priceAdjustment.toLocaleString()}</span>
                                )}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}


            <div className="flex flex-col sm:flex-row gap-4">
               {needsQuote ? (
                  <Button size="lg" className="flex-1" onClick={handleRequestQuote} disabled={isRequestingQuote}>
                     {isRequestingQuote ? <Loader2 className="mr-2 animate-spin" /> : <FileQuestion className="mr-2" />}
                     Request a Quote
                  </Button>
               ) : (
                  <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                     <ShoppingCart className="mr-2" />
                     Add to Cart
                  </Button>
               )}
               <Button size="lg" variant="outline" onClick={handleWishlistToggle} className="w-full sm:w-auto">
                    <Heart className={cn("mr-2", inWishlist && "fill-current text-red-500")} />
                    {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <Wrench className="w-6 h-6 text-primary"/>
                        Request a Custom Modification
                    </CardTitle>
                    <CardDescription>
                        Need something special? Describe your desired changes, and we'll send you a custom quote.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="custom-notes">Modification Details</Label>
                        <Textarea
                            id="custom-notes"
                            placeholder="e.g., 'I need this with a different MCU', or 'Can you add a GPS module?'"
                            value={customNotes}
                            onChange={(e) => setCustomNotes(e.target.value)}
                        />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="custom-file">Reference File (Optional)</Label>
                        <Input id="custom-file" type="file" accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf" onChange={(e) => setCustomFile(e.target.files ? e.target.files[0] : null)} />
                         <p className="text-xs text-muted-foreground">File uploads are simulated in this prototype.</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleCustomQuoteRequest} disabled={isRequestingCustomQuote} className="w-full">
                        {isRequestingCustomQuote ? <Loader2 className="mr-2 animate-spin" /> : <FileQuestion className="mr-2" />}
                        Request Quote for Customization
                    </Button>
                </CardFooter>
            </Card>


            <div>
              <h3 className="font-headline text-xl font-bold mb-4">Specifications</h3>
              <Table>
                <TableBody>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium text-muted-foreground">{key}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div>
              <h3 className="font-headline text-xl font-bold mb-4">Use Cases</h3>
              <ul className="space-y-2">
                {product.useCases.map((useCase, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-1 text-primary" />
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {relatedProducts.length > 0 && (
            <div className="mt-20">
                <Separator />
                <div className="mt-12">
                    <h2 className="font-headline text-3xl font-bold tracking-tighter text-center sm:text-4xl mb-8">Related Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map(p => (
                            <ProductCard key={p.id} product={p} categories={categories} />
                        ))}
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}
