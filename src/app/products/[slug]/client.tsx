'use client';

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
import { CheckCircle, ShoppingCart, Wrench, AlertTriangle, Clock, FileQuestion, Heart, Minus, Plus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { Separator } from "@/components/ui/separator";
import { useAppContext } from "@/context/app-provider";

export function ProductClientPage({ product }: { product: Product }) {
  const { toast } = useToast();
  const { products: allProducts, categories, contactInfo, addToCart, currentUser, toggleWishlist } = useAppContext();
  const isStoreClosed = contactInfo.storeStatus === 'closed';

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string | string[]>>({});
  const [quantity, setQuantity] = useState(1);
  
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
  
  const maxQuantity = useMemo(() => {
    return product.inStock ? product.stockQuantity : 99; // Arbitrary high number for made-to-order
  }, [product]);

  const inWishlist = currentUser?.wishlist.includes(product.id) || false;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = parseInt(e.target.value, 10);
      if (isNaN(value) || value < 1) {
          value = 1;
      }
      if (value > maxQuantity) {
          value = maxQuantity;
      }
      setQuantity(value);
  };

  const incrementQuantity = () => {
      setQuantity(prev => Math.min(maxQuantity, prev + 1));
  };

  const decrementQuantity = () => {
      setQuantity(prev => Math.max(1, prev - 1));
  };

  const calculatedBasePrice = useMemo(() => {
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
    if (product.orderType === 'quote') return true;
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
  }, [selectedOptions, product.customizationGroups, product.orderType]);

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

  const discountedPrice = useMemo(() => {
    if (!product.discountValue || !product.discountType || product.discountType === 'none') {
      return calculatedBasePrice;
    }
    let discounted = calculatedBasePrice;
    if (product.discountType === 'fixed') {
      discounted = calculatedBasePrice - product.discountValue;
    }
    if (product.discountType === 'percentage') {
      discounted = calculatedBasePrice * (1 - product.discountValue / 100);
    }
    return discounted > 0 ? discounted : 0;
  }, [product, calculatedBasePrice]);
  
  const handleAddToCart = () => {
    addToCart({
        id: `${product.id}-${JSON.stringify(selectedOptions)}`,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        quantity: quantity,
        price: discountedPrice,
        configuration: selectedOptions
    });

    toast({
      title: 'Added to Cart!',
      description: `${quantity} x ${product.name} has been added to your cart.`,
    });
  };
  
  const handleRequestQuote = async () => {
      toast({
        title: 'Quote Requested (Demo)',
        description: "In a real app, this would send your request to our team.",
    });
  };
  
  const handleWishlistToggle = () => {
    if (!currentUser) {
        toast({ title: 'Login Required', description: 'Please login to manage your wishlist.' });
        return;
    }
    toggleWishlist(product.id);
    toast({
      title: inWishlist ? 'Removed from Wishlist' : 'Added to Wishlist',
    });
  };

  const priceSuffix = needsQuote ? '+' : '';
  const hasDiscount = discountedPrice !== calculatedBasePrice;
  
  const relatedProducts = useMemo(() => {
    if (!product || product.categoryIds.length === 0) {
      return [];
    }

    return allProducts
      .filter(p => 
        p.id !== product.id &&
        p.categoryIds.some(catId => product.categoryIds.includes(catId))
      )
      .slice(0, 4);
  }, [product, allProducts]);

  const stockStatus = !product.inStock 
    ? { text: "Made on Order", variant: "secondary" as const } 
    : product.stockQuantity > 0 
    ? { text: `${product.stockQuantity} in stock`, variant: "default" as const } 
    : { text: "Out of Stock", variant: "destructive" as const };
    
  const isOutOfStock = product.inStock && product.stockQuantity === 0;
  const canOrder = !isStoreClosed && !isOutOfStock;
  const cannotOrderReason = isStoreClosed ? "Store is temporarily closed" : isOutOfStock ? "Out of Stock" : "Add to Cart";

  return (
    <div className="py-12 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="aspect-square object-cover w-full"
                  />
                ) : (
                  <div className="aspect-square bg-muted flex items-center justify-center text-muted-foreground">
                    No Image Available
                  </div>
                )}
                </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <Link href="/products" className="text-sm text-muted-foreground hover:text-primary">
                &larr; Back to Products
              </Link>
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                {product.categoryIds.map(catId => <Badge key={catId} variant="outline">{categoryMap.get(catId) || catId}</Badge>)}
                <Badge variant={stockStatus.variant} className={cn(stockStatus.variant === 'default' && 'bg-green-100 text-green-800')}>{stockStatus.text}</Badge>
              </div>
              <h1 className="font-headline text-4xl lg:text-5xl font-bold mt-2">{product.name}</h1>
              <p className="text-muted-foreground text-lg mt-4">{product.description}</p>
            </div>
            
            {!product.inStock && (
              <Alert variant="default" className="bg-primary/5 border-primary/20">
                  <Clock className="h-4 w-4 text-primary" />
                  <AlertTitle className="text-primary">Build-to-Order Item</AlertTitle>
                  <AlertDescription>
                      This item is currently out of stock but can be built on demand. Estimated production time is 7-14 business days.
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
                  EGP {calculatedBasePrice.toLocaleString()}
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
            
            {!needsQuote && (
                 <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1 || !canOrder}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                            id="quantity"
                            type="number"
                            className="w-20 text-center"
                            value={quantity}
                            onChange={handleQuantityChange}
                            min="1"
                            max={maxQuantity}
                            disabled={!canOrder}
                        />
                        <Button variant="outline" size="icon" onClick={incrementQuantity} disabled={quantity >= maxQuantity || !canOrder}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}


            <div className="flex flex-col sm:flex-row gap-4">
               {needsQuote || !product.inStock ? (
                  <Button size="lg" className="flex-1" onClick={handleRequestQuote} disabled={isStoreClosed}>
                     <FileQuestion className="mr-2" />
                     {isStoreClosed ? "Store is temporarily closed" : "Request a Quote"}
                  </Button>
               ) : (
                  <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={!canOrder}>
                     <ShoppingCart className="mr-2" />
                     {canOrder ? "Add to Cart" : cannotOrderReason}
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
                        />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="custom-file">Reference File (Optional)</Label>
                        <Input id="custom-file" type="file" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleRequestQuote} className="w-full" disabled={isStoreClosed}>
                        <FileQuestion className="mr-2" />
                         {isStoreClosed ? "Store is temporarily closed" : "Request Quote for Customization"}
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
