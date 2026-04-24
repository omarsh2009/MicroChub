'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { 
    mockProducts,
    mockCategories,
    mockUsers,
    mockPaymentMethods,
    mockOrders,
    mockQuotes,
    mockCoupons,
    mockSocialLinks,
    mockPolicies,
    mockFaqs,
    mockContactInfo
} from '@/lib/demo-data';
import type { Product, Category, UserWithId, PaymentMethod, OrderWithUserData, QuoteRequestWithUserData, Coupon, SocialLink, PolicySection, FaqItem, ContactInfo } from '@/lib/types';

interface AppContextType {
    products: Product[];
    setProducts: (products: Product[]) => void;
    categories: Category[];
    setCategories: (categories: Category[]) => void;
    users: UserWithId[];
    setUsers: (users: UserWithId[]) => void;
    paymentMethods: PaymentMethod[];
    setPaymentMethods: (methods: PaymentMethod[]) => void;
    orders: OrderWithUserData[];
    setOrders: (orders: OrderWithUserData[]) => void;
    quotes: QuoteRequestWithUserData[];
    setQuotes: (quotes: QuoteRequestWithUserData[]) => void;
    coupons: Coupon[];
    setCoupons: (coupons: Coupon[]) => void;
    socialLinks: SocialLink[];
    setSocialLinks: (links: SocialLink[]) => void;
    policies: PolicySection[];
    setPolicies: (policies: PolicySection[]) => void;
    faqs: FaqItem[];
    setFaqs: (faqs: FaqItem[]) => void;
    contactInfo: ContactInfo;
    setContactInfo: (info: ContactInfo) => void;
    allProducts: Product[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [categories, setCategories] = useState<Category[]>(mockCategories);
    const [users, setUsers] = useState<UserWithId[]>(mockUsers);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
    const [orders, setOrders] = useState<OrderWithUserData[]>(mockOrders);
    const [quotes, setQuotes] = useState<QuoteRequestWithUserData[]>(mockQuotes);
    const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>(mockSocialLinks);
    const [policies, setPolicies] = useState<PolicySection[]>(mockPolicies);
    const [faqs, setFaqs] = useState<FaqItem[]>(mockFaqs);
    const [contactInfo, setContactInfo] = useState<ContactInfo>(mockContactInfo);

    const value = {
        products,
        setProducts,
        categories,
        setCategories,
        users,
        setUsers,
        paymentMethods,
        setPaymentMethods,
        orders,
        setOrders,
        quotes,
        setQuotes,
        coupons,
        setCoupons,
        socialLinks,
        setSocialLinks,
        policies,
        setPolicies,
        faqs,
        setFaqs,
        contactInfo,
        setContactInfo,
        allProducts: products,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
