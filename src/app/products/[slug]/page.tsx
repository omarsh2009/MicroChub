'use client';

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { products, placeholderImagesById } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, ShoppingCart, Wrench } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useMemo } from "react";
import { useCart } from '@/hooks/use-cart';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);
  const { addToCart } = useCart();

  if (!product) {
    notFound();
  }

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string | string[]>>({});
  const [quantity, setQuantity] = useState(1);

  const productImages = product.images.map(id => placeholderImagesById[id]).filter(Boolean);

  const calculatedPrice = useMemo(() => {
    let price = product.price;
    if (!product.customizationGroups) {
      return price;
    }

    Object.entries(selectedOptions).forEach(([groupName, selection]) => {
      const group = product.customizationGroups?.find(g => g.name === groupName);
      if (!group) return;
      
      if (group.type === 'single' && typeof selection === 'string') {
          const option = group.options.find(o => o.name === selection);
          if (option) {
              price += option.priceAdjustment;
          }
      } else if (group.type === 'multi' && Array.isArray(selection)) {
          selection.forEach(optionName => {
              const option = group.options.find(o => o.name === optionName);
              if (option) {
                  price += option.priceAdjustment;
              }
          });
      }
    });

    return price;
  }, [selectedOptions, product]);


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
    addToCart(product, quantity, selectedOptions, calculatedPrice);
  };

  return (
    <div className="py-12 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <Carousel className="w-full">
              <CarouselContent>
                {productImages.map((img, index) => (
                  <CarouselItem key={index}>
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <Image
                          src={img.imageUrl}
                          alt={`${product.name} image ${index + 1}`}
                          width={600}
                          height={600}
                          className="aspect-square object-cover w-full"
                          data-ai-hint={img.imageHint}
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <Link href="/products" className="text-sm text-muted-foreground hover:text-primary">
                &larr; Back to Products
              </Link>
              <Badge variant="outline" className="mt-4">{product.category}</Badge>
              <h1 className="font-headline text-4xl lg:text-5xl font-bold mt-2">{product.name}</h1>
              <p className="text-muted-foreground text-lg mt-4">{product.description}</p>
            </div>

            <div className="text-4xl font-bold">
              EGP {calculatedPrice.toLocaleString()}
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
                                {option.priceAdjustment !== 0 && (
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
                                {option.priceAdjustment !== 0 && (
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
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2" />
                Add to Cart
              </Button>
            </div>

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
      </div>
    </div>
  );
}
