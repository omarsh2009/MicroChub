export type Category = {
  id: string;
  name: string;
  description: string;
};

export type CustomizationOption = {
  name: string;
  priceAdjustment: number;
};

export type CustomizationGroup = {
  name: string;
  type: 'single' | 'multi';
  required: boolean;
  options: CustomizationOption[];
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
  customizationGroups?: CustomizationGroup[];
};

export type UserProfile = {
  name: string;
  email: string;
  phoneNumber: string;
  wishlist: string[];
};
