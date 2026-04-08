export type Category = {
  id: string;
  name: string;
  description: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  specs: Record<string, string>;
  useCases: string[];
  featured?: boolean;
  configurable?: boolean;
};
