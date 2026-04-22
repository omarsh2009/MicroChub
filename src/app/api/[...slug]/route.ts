
import { NextResponse } from 'next/server';

// --- MOCK DATA DEFINITIONS ---

// 1. Categories
const mockCategories = [
    { id: 'cat-1', name: 'DIY Kits', slug: 'diy-kits' },
    { id: 'cat-2', name: 'Arduino', slug: 'arduino' },
    { id: 'cat-3', name: 'Sensors', slug: 'sensors' },
    { id: 'cat-6', name: 'ESP Devices', slug: 'esp-devices' },
];

// 2. Products
const mockProducts = [
  {
    id: 'prod-1',
    slug: 'arduino-uno-ultimate-starter-kit',
    name: 'Arduino Uno Ultimate Starter Kit',
    description: 'The perfect kit for beginners to dive into the world of Arduino. Includes an Arduino Uno, breadboard, and a huge assortment of sensors and components.',
    price: 1200,
    image: 'https://picsum.photos/seed/arduino-kit/600/400',
    categoryIds: ['cat-2', 'cat-1'],
    specs: { 'MCU': 'ATmega328P', 'Components': 'Over 200 included', 'Guide': '25 lessons included' },
    useCases: ['Learning electronics', 'Prototyping IoT ideas', 'Building interactive projects'],
    featured: true,
    productType: 'ready',
  },
  {
    id: 'prod-2',
    slug: 'desktop-cnc-3018-pro',
    name: 'Desktop CNC 3018 Pro Kit',
    description: 'A powerful and affordable desktop CNC machine for carving wood, plastic, and soft metals. Perfect for hobbyists and small businesses.',
    price: 8500,
    image: 'https://picsum.photos/seed/cnc-machine/600/400',
    categoryIds: ['cat-1'],
    specs: { 'Working Area': '300x180x45mm', 'Spindle': '775 Motor, 10000 RPM', 'Control': 'GRBL' },
    useCases: ['Custom PCB milling', 'Wood engraving', 'Prototyping mechanical parts'],
    featured: true,
    productType: 'build_to_order',
  },
  {
    id: 'prod-3',
    slug: 'iot-sensor-pack-pro',
    name: 'IoT Sensor Pack Pro (37-in-1)',
    description: 'A comprehensive kit with 37 different sensors and modules for your Arduino or ESP32 projects. Everything you need to start experimenting.',
    price: 950,
    image: 'https://picsum.photos/seed/sensor-pack/600/400',
    categoryIds: ['cat-3', 'cat-2', 'cat-6'],
    specs: { 'Sensors': '37 modules included', 'Compatibility': 'Arduino, ESP32, Raspberry Pi' },
    useCases: ['Building weather stations', 'Home automation prototypes', 'Environmental monitoring'],
    featured: true,
    productType: 'ready',
  },
  {
    id: 'prod-4',
    slug: 'esp32-s3-dev-board',
    name: 'ESP32-S3 Development Board',
    description: 'A powerful board with WiFi, Bluetooth 5.0, and native USB-C, perfect for advanced IoT and AI on the edge applications.',
    price: 650,
    image: 'https://picsum.photos/seed/esp32-s3/600/400',
    categoryIds: ['cat-6'],
    specs: { 'MCU': 'ESP32-S3', 'Flash': '16MB', 'PSRAM': '8MB', 'Connectivity': 'Wi-Fi, Bluetooth 5.0' },
    useCases: ['Portable IoT projects', 'Edge AI applications', 'Complex robotics'],
    productType: 'ready',
  },
];

// 3. Users
const mockUsers = [
  { id: 'user-super-admin', name: 'Super Admin', email: 'super_admin@example.com', phoneNumber: '01000000001', role: 'super_admin', wishlist: [] },
  { id: 'user-admin', name: 'Admin User', email: 'admin@example.com', phoneNumber: '01000000002', role: 'admin', wishlist: [] },
  { id: 'user-regular', name: 'Ahmed Hossam', email: 'ahmed@example.com', phoneNumber: '01000000003', role: 'user', wishlist: [] },
];
const mockAuthenticatedUser = { uid: 'user-super-admin', email: 'super_admin@example.com', displayName: 'Super Admin', profile: mockUsers[0] };

// 4. Payment Methods
const mockPaymentMethods = [
    { id: 'pm-1', name: 'Cash on Delivery', type: 'username', value: 'N/A', instructions: 'Pay in cash when your order is delivered.', enabled: true },
    { id: 'pm-3', name: 'Vodafone Cash', type: 'phoneNumber', value: '01012345678', instructions: 'Send the total amount to this number and enter the transaction ID.', enabled: true },
];

// 5. Orders
const mockOrders = [
  {
    id: 'ord_1',
    userId: 'user-regular',
    items: [{ id: 'prod-1-cart', productId: 'prod-1', name: 'Arduino Uno Ultimate Starter Kit', slug:'arduino-uno-ultimate-starter-kit', image: 'https://picsum.photos/seed/arduino-kit/600/400', quantity: 1, price: 1200, configuration: {} }],
    totalPrice: 1200, status: 'Completed/Delivered', shippingAddress: { fullName: 'Ahmed Hossam', phoneNumber: '01000000003', address: '123 Abc Street', city: 'Cairo' }, paymentMethod: { id: 'pm-3', name: 'Vodafone Cash' }, transactionId: 'VF12345',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 7, nanoseconds: 0 },
    user: { id: 'user-regular', name: 'Ahmed Hossam', email: 'ahmed@example.com', phoneNumber: '01000000003' },
  },
  {
    id: 'ord_2',
    userId: 'user-regular',
    items: [{ id: 'prod-2-cart', productId: 'prod-2', name: 'Desktop CNC 3018 Pro Kit', slug: 'desktop-cnc-3018-pro', image: 'https://picsum.photos/seed/cnc-machine/600/400', quantity: 1, price: 8500, configuration: {} }],
    totalPrice: 8500, status: 'In Production', shippingAddress: { fullName: 'Ahmed Hossam', phoneNumber: '01000000003', address: '123 Abc Street', city: 'Cairo' }, paymentMethod: { id: 'pm-3', name: 'Vodafone Cash' }, transactionId: 'VF67890',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 3, nanoseconds: 0 },
    user: { id: 'user-regular', name: 'Ahmed Hossam', email: 'ahmed@example.com', phoneNumber: '01000000003' },
  },
];

// 6. Coupons
const mockCoupons = [
    { id: 'coup-1', code: 'MAKERSPACE', type: 'percentage', value: 10, maxUses: 100, usedCount: 23, expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0] },
];

// 7. Social Links
const mockSocialLinks = [
    { id: 'soc-fb', platform: 'Facebook', url: 'https://facebook.com/microchub', enabled: true },
    { id: 'soc-gh', platform: 'GitHub', url: 'https://github.com/microchub', enabled: true },
];

// 8. Quotes
const mockQuotes = [
  {
    id: 'quote_1',
    userId: 'user-regular',
    items: [{ id: 'prod-2-cart', productId: 'prod-2', name: 'Desktop CNC 3018 Pro Kit', slug: 'desktop-cnc-3018-pro', image: 'https://picsum.photos/seed/cnc-machine/600/400', quantity: 1, price: 8500, configuration: { "Material": "Black Acrylic instead of Clear" } }],
    status: 'Quoted',
    userNotes: 'Is it possible to get this kit with black acrylic parts instead of the standard clear ones?',
    quotedPrice: 9000,
    adminNotes: 'Yes, we can cut it from black acrylic. The material cost is slightly higher.',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 5, nanoseconds: 0 },
    user: { id: 'user-regular', name: 'Ahmed Hossam', email: 'ahmed@example.com', phoneNumber: '01000000003' }
  },
];

const mockLegalAgreement = {
    fileName: 'MicroChub-Restricted-Item-Agreement-v1.pdf',
    fileContent: 'data:application/pdf;base64,....', // a dummy base64 string
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
};

let mockCart: any[] = [];
let mockWishlist: any[] = [];


// --- API HANDLER ---

function createMockResponse(data: any) {
  return NextResponse.json({ success: true, data, error: null });
}

async function handler(request: Request) {
  const { pathname, searchParams } = new URL(request.url);

  // Auth
  if (pathname.startsWith('/api/auth')) {
    if (pathname === '/api/auth/login' || pathname === '/api/auth/signup' || pathname === '/api/auth/me') {
      return createMockResponse(mockAuthenticatedUser);
    }
    if (pathname === '/api/auth/logout') {
      return createMockResponse(null);
    }
  }

  // Collections
  if (request.method === 'GET') {
    if (pathname === '/api/products') {
      const categorySlug = searchParams.get('category');
      if (categorySlug) {
        const category = mockCategories.find(c => c.slug === categorySlug);
        if (category) {
          const filtered = mockProducts.filter(p => p.categoryIds.includes(category.id));
          return createMockResponse(filtered);
        }
      }
      return createMockResponse(mockProducts);
    }
    if (pathname === '/api/products/featured') {
      return createMockResponse(mockProducts.filter(p => p.featured));
    }
    if (pathname === '/api/categories') {
      return createMockResponse(mockCategories);
    }
    if (pathname === '/api/orders') {
      return createMockResponse(mockOrders);
    }
     if (pathname === '/api/orders/me') {
      return createMockResponse(mockOrders.filter(o => o.userId === mockAuthenticatedUser.uid));
    }
    if (pathname === '/api/quotes') {
      return createMockResponse(mockQuotes);
    }
     if (pathname === '/api/quotes/me') {
      return createMockResponse(mockQuotes.filter(q => q.userId === mockAuthenticatedUser.uid));
    }
    if (pathname === '/api/users') {
      return createMockResponse(mockUsers);
    }
    if (pathname === '/api/payment-methods') {
      const onlyEnabled = searchParams.get('enabled') === 'true';
      return createMockResponse(onlyEnabled ? mockPaymentMethods.filter(l => l.enabled) : mockPaymentMethods);
    }
    if (pathname === '/api/social-links') {
      const onlyEnabled = searchParams.get('enabled') === 'true';
      return createMockResponse(onlyEnabled ? mockSocialLinks.filter(l => l.enabled) : mockSocialLinks);
    }
    if (pathname === '/api/legal/agreement') {
      return createMockResponse(mockLegalAgreement);
    }
    if (pathname === '/api/coupons') {
      return createMockResponse(mockCoupons);
    }
    if (pathname === '/api/cart') {
      return createMockResponse(mockCart);
    }
    if (pathname === '/api/wishlist') {
      return createMockResponse(mockWishlist);
    }
  }
  
  // Single Items
  if (request.method === 'GET') {
     const productSlugMatch = pathname.match(/^\/api\/products\/([a-zA-Z0-9-]+)$/);
     if (productSlugMatch) {
      const slug = productSlugMatch[1];
      const product = mockProducts.find(p => p.slug === slug);
      return createMockResponse(product || null);
    }
     const userMatch = pathname.match(/^\/api\/users\/([a-zA-Z0-9-]+)$/);
    if (userMatch) {
      const userId = userMatch[1];
      return createMockResponse(mockUsers.find(u => u.id === userId));
    }
    const userOrdersMatch = pathname.match(/^\/api\/orders\/user\/([a-zA-Z0-9-]+)$/);
    if (userOrdersMatch) {
        const userId = userOrdersMatch[1];
        return createMockResponse(mockOrders.filter(o => o.userId === userId));
    }
  }
  
  // POST / Actions
  if (request.method === 'POST') {
     if (pathname === '/api/coupons/apply') {
        const { code } = await request.json();
        const coupon = mockCoupons.find(c => c.code === code);
        if (coupon) return createMockResponse(coupon);
        return NextResponse.json({ success: false, data: null, error: { message: 'Invalid coupon code.' }}, { status: 400 });
    }
     if (pathname === '/api/cart/items') {
        const { productId, quantity, configuration, price } = await request.json();
        const product = mockProducts.find(p => p.id === productId);
        if (product) {
            const configHash = Buffer.from(JSON.stringify(configuration || {})).toString('hex').slice(0, 8);
            const cartItemId = `${productId}-${configHash}`;
            const existingItemIndex = mockCart.findIndex(item => item.id === cartItemId);
            if (existingItemIndex > -1) {
                mockCart[existingItemIndex].quantity += quantity;
            } else {
                mockCart.push({
                    id: cartItemId, productId, quantity, configuration, price, 
                    name: product.name, slug: product.slug, image: product.image,
                });
            }
        }
        return createMockResponse(mockCart);
     }
      if (pathname === '/api/wishlist') {
        const { productId } = await request.json();
        if (!mockWishlist.some(item => item.productId === productId)) {
            const newWishlistItem = { id: `${mockAuthenticatedUser.uid}-${productId}`, productId, userId: mockAuthenticatedUser.uid, addedAt: Date.now() };
            mockWishlist.push(newWishlistItem);
        }
        return createMockResponse(mockWishlist);
      }
      if (pathname === '/api/orders') {
          return createMockResponse({ orderId: `ord_${Math.random().toString(36).substring(2, 9)}`})
      }
  }

  // DELETE
  if (request.method === 'DELETE') {
      if (pathname === '/api/cart') {
        mockCart = [];
        return createMockResponse(null);
      }
      const cartItemMatch = pathname.match(/^\/api\/cart\/items\/(.+)$/);
      if (cartItemMatch) {
          mockCart = mockCart.filter(item => item.id !== cartItemMatch[1]);
          return createMockResponse(mockCart);
      }
       const wishlistMatch = pathname.match(/^\/api\/wishlist\/([a-zA-Z0-9-]+)$/);
        if (wishlistMatch) {
            mockWishlist = mockWishlist.filter(item => item.productId !== wishlistMatch[1]);
            return createMockResponse(null);
        }
  }

   // PATCH
  if (request.method === 'PATCH') {
      const cartItemMatch = pathname.match(/^\/api\/cart\/items\/(.+)$/);
      if (cartItemMatch) {
          const { quantity } = await request.json();
          const itemIndex = mockCart.findIndex(item => item.id === cartItemMatch[1]);
          if (itemIndex > -1) {
              if (quantity > 0) mockCart[itemIndex].quantity = quantity;
              else mockCart.splice(itemIndex, 1);
          }
          return createMockResponse(mockCart);
      }
  }


  // Fallback for any other route
  return NextResponse.json({ success: false, data: null, error: { message: `Mock route not found for ${pathname}` }}, { status: 404 });
}


export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };

    