
export type ApiError = {
  message: string;
  code?: string;
};

export type ServiceResponse<T> = {
  success: boolean;
  data: T | null;
  error: ApiError | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
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
  image: string;
  categoryIds: string[];
  specs: Record<string, string>;
  useCases: string[];
  featured?: boolean;
  isRestricted?: boolean;
  customizationGroups?: CustomizationGroup[];
  discountValue?: number;
  discountType?: 'fixed' | 'percentage' | 'none';
  inStock: boolean;
  stockQuantity: number;
};

export type UserProfile = {
  id: string;
  name:string;
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

export type ShippingAddress = {
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
};

export type PaymentMethod = {
  id: string;
  name: string;
  type: 'phoneNumber' | 'username' | 'paymentLink';
  value: string;
  instructions?: string;
  enabled: boolean;
};

export type Order = {
  id: string; // Firestore document ID
  userId: string;
  items: CartItem[];
  totalPrice: number;
  status: 'Pending Verification' | 'Confirmed' | 'In Production' | 'Ready' | 'Completed/Delivered' | 'Cancelled';
  shippingAddress: ShippingAddress;
  paymentMethod: {
    id: string;
    name: string;
  };
  transactionId: string;
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

export type Coupon = {
  id: string;
  code: string;
  type: 'fixed' | 'percentage';
  value: number;
  maxUses?: number;
  usedCount: number;
  expiryDate?: string;
};

export type PolicySection = {
  id: string;
  title: string;
  content: string;
  isVisible: boolean;
};

export type SocialLink = {
    id: string;
    platform: string;
    url: string;
    enabled: boolean;
}

export interface WishlistItem {
    id: string;
    productId: string;
    userId: string;
    addedAt: number;
}

export type FaqItem = {
    id: string;
    question: string;
    answer: string;
    isPublished: boolean;
};

export type ContactInfo = {
    location: string;
    email: string;
    phone: string;
    workingHours: string;
    workingDays: string;
    googleMapsLink?: string;
    storeStatus: 'open' | 'closed';
    storeMode: 'online' | 'physical';
    pickupInstructions: string;
};

