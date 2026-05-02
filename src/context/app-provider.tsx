'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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
import type { Product, Category, UserWithId, PaymentMethod, OrderWithUserData, QuoteRequestWithUserData, Coupon, SocialLink, PolicySection, FaqItem, ContactInfo, CartItem } from '@/lib/types';

interface AppContextType {
    products: Product[];
    setProducts: (products: Product[]) => void;
    categories: Category[];
    setCategories: (categories: Category[]) => void;
    users: UserWithId[];
    setUsers: (users: UserWithId[]) => void;
    deleteUser: (userId: string) => void;
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
    currentUser: UserWithId | null;
    login: (user: UserWithId) => void;
    logout: () => void;
    toggleWishlist: (productId: string) => void;
    // Cart Logic
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string) => void;
    updateCartQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'microchub_storage_v2';

export function AppProvider({ children }: { children: ReactNode }) {
    // State Initialization
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [users, setUsers] = useState<UserWithId[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [orders, setOrders] = useState<OrderWithUserData[]>([]);
    const [quotes, setQuotes] = useState<QuoteRequestWithUserData[]>([]);
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [policies, setPolicies] = useState<PolicySection[]>([]);
    const [faqs, setFaqs] = useState<FaqItem[]>([]);
    const [contactInfo, setContactInfo] = useState<ContactInfo>(mockContactInfo);
    const [currentUser, setCurrentUser] = useState<UserWithId | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Hydrate state from LocalStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const data = JSON.parse(stored);
                setProducts(data.products || mockProducts);
                setCategories(data.categories || mockCategories);
                setUsers(data.users || mockUsers);
                setPaymentMethods(data.paymentMethods || mockPaymentMethods);
                setOrders(data.orders || mockOrders);
                setQuotes(data.quotes || mockQuotes);
                setCoupons(data.coupons || mockCoupons);
                setSocialLinks(data.socialLinks || mockSocialLinks);
                setPolicies(data.policies || mockPolicies);
                setFaqs(data.faqs || mockFaqs);
                setContactInfo(data.contactInfo || mockContactInfo);
                setCurrentUser(data.currentUser || null);
                setCart(data.cart || []);
            } catch (e) {
                console.error("Failed to load state", e);
            }
        } else {
            // Use defaults
            setProducts(mockProducts);
            setCategories(mockCategories);
            setUsers(mockUsers);
            setPaymentMethods(mockPaymentMethods);
            setOrders(mockOrders);
            setQuotes(mockQuotes);
            setCoupons(mockCoupons);
            setSocialLinks(mockSocialLinks);
            setPolicies(mockPolicies);
            setFaqs(mockFaqs);
            setContactInfo(mockContactInfo);
            // Default login for demo convenience
            setCurrentUser(mockUsers.find(u => u.id === 'user-super-admin') || null);
        }
        setIsInitialized(true);
    }, []);

    // Persist state to LocalStorage on changes
    useEffect(() => {
        if (!isInitialized) return;
        const state = {
            products, categories, users, paymentMethods, orders, quotes, coupons, socialLinks, policies, faqs, contactInfo, currentUser, cart
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [products, categories, users, paymentMethods, orders, quotes, coupons, socialLinks, policies, faqs, contactInfo, currentUser, cart, isInitialized]);

    const login = (user: UserWithId) => {
        setCurrentUser(user);
    };

    const logout = () => {
        setCurrentUser(null);
    };

    const toggleWishlist = (productId: string) => {
        if (!currentUser) return;
        const newWishlist = currentUser.wishlist.includes(productId)
            ? currentUser.wishlist.filter(id => id !== productId)
            : [...currentUser.wishlist, productId];
        
        const updatedUser = { ...currentUser, wishlist: newWishlist };
        setCurrentUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    };

    const deleteUser = (userId: string) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
        if (currentUser?.id === userId) {
            setCurrentUser(null);
        }
    };

    const addToCart = (item: CartItem) => {
        setCart(prev => {
            const existingIndex = prev.findIndex(i => i.id === item.id);
            if (existingIndex > -1) {
                const newCart = [...prev];
                newCart[existingIndex].quantity += item.quantity;
                return newCart;
            }
            return [...prev, item];
        });
    };

    const removeFromCart = (itemId: string) => {
        setCart(prev => prev.filter(item => item.id !== itemId));
    };

    const updateCartQuantity = (itemId: string, quantity: number) => {
        setCart(prev => prev.map(item => item.id === itemId ? { ...item, quantity } : item));
    };

    const clearCart = () => setCart([]);

    const value = {
        products,
        setProducts,
        categories,
        setCategories,
        users,
        setUsers,
        deleteUser,
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
        currentUser,
        login,
        logout,
        toggleWishlist,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
    };

    if (!isInitialized) return null; // Prevent hydration mismatch

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
