export type Category = {
  id: string;
  name: string;
  description: string;
};

export type CustomizationOption = {
  name: string;
  priceAdjustment: number;
  requestQuote?: boolean;
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
  isRestricted?: boolean;
  customizationGroups?: CustomizationGroup[];
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  wishlist: string[];
  role: 'user' | 'admin' | 'super_admin';
};

export type UserWithId = UserProfile & {
  id: string;
};

export type SelectedConfiguration = Record<string, string | string[]>;

export type CartItem = {
    id: string; // Unique ID for the cart item, e.g., `${productId}-${configHash}`
    productId: string;
    name: string;
    slug: string;
    image: string;
    quantity: number;
    price: number; // The calculated price for ONE unit at the time of adding to cart
    configuration: SelectedConfiguration;
};

export type Order = {
  id: string; // Firestore document ID
  userId: string;
  items: CartItem[];
  totalPrice: number;
  status: 'Pending Payment Proof' | 'Under Review' | 'Confirmed' | 'In Production' | 'Ready' | 'Completed/Delivered';
  paymentProofUrl: string;
  paymentMethod: 'instapay' | 'telda';
  legalAgreementUrl?: string;
  requiresLegalApproval?: boolean;
  legalAgreementApproved?: boolean;
  notes?: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};

export type OrderWithUserData = Order & {
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
  }
};

export type QuoteRequest = {
  id: string;
  userId: string;
  items: CartItem[]; // Using CartItem to represent the product and configuration
  userNotes?: string;
  fileUrl?: string; // Single file for simplicity
  status: 'Pending Review' | 'Quoted' | 'Accepted' | 'Rejected' | 'Ordered';
  quotedPrice?: number;
  adminNotes?: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  quotedAt?: {
    seconds: number;
    nanoseconds: number;
  };
};


export type QuoteRequestWithUserData = QuoteRequest & {
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
  }
};
