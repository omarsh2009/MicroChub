
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// --- MOCK DATA ---
// NOTE: Most GET requests are now handled directly in the service layer for stability.
// This file primarily handles POST/PATCH/DELETE and fallback requests.

let mockUsers = [
  { id: 'user-super-admin', name: 'Super Admin', email: 'super_admin@example.com', phoneNumber: '01000000001', role: 'super_admin', wishlist: [] },
  { id: 'user-admin', name: 'Admin User', email: 'admin@example.com', phoneNumber: '01000000002', role: 'admin', wishlist: [] },
  { id: 'user-regular', name: 'Ahmed Hossam', email: 'ahmed@example.com', phoneNumber: '01000000003', role: 'user', wishlist: ['prod-2', 'prod-7'] },
  { id: 'user-new', name: 'Fatima Al-Sayed', email: 'fatima@example.com', phoneNumber: '01122334455', role: 'user', wishlist: [] },
];

let mockPaymentMethods = [
    { id: 'pm-1', name: 'Cash on Delivery', type: 'username', value: 'N/A', instructions: 'Pay in cash when your order is delivered.', enabled: true },
    { id: 'pm-2', name: 'Credit Card', type: 'paymentLink', value: 'https://pay.example.com', instructions: 'Pay via our secure payment link.', enabled: false },
    { id: 'pm-3', name: 'Vodafone Cash', type: 'phoneNumber', value: '01012345678', instructions: 'Send the total amount to this number and enter the transaction ID.', enabled: true },
];

let mockOrders = [
  {
    id: 'ord_1', userId: 'user-regular', items: [{ id: 'prod-1-cart', productId: 'prod-1', name: 'Arduino Uno Ultimate Starter Kit', slug:'arduino-uno-ultimate-starter-kit', image: 'https://images.unsplash.com/photo-1559386484-97dfc0e150a9?q=80&w=600&auto=format&fit=crop', quantity: 1, price: 1250, configuration: {} }],
    totalPrice: 1250, status: 'Completed/Delivered', shippingAddress: { fullName: 'Ahmed Hossam', phoneNumber: '01000000003', address: '123 Abc Street', city: 'Cairo' }, paymentMethod: { id: 'pm-3', name: 'Vodafone Cash' }, transactionId: 'VF12345',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 7, nanoseconds: 0 },
    user: { id: 'user-regular', name: 'Ahmed Hossam', email: 'ahmed@example.com', phoneNumber: '01000000003' },
  },
  {
    id: 'ord_2', userId: 'user-regular', items: [{ id: 'prod-2-cart', productId: 'prod-2', name: 'Desktop CNC 3018 Pro Kit', slug: 'desktop-cnc-3018-pro', image: 'https://images.unsplash.com/photo-1620352538982-255a2a9b3f36?q=80&w=600&auto=format&fit=crop', quantity: 1, price: 8500, configuration: {} }],
    totalPrice: 8500, status: 'In Production', shippingAddress: { fullName: 'Ahmed Hossam', phoneNumber: '01000000003', address: '123 Abc Street', city: 'Cairo' }, paymentMethod: { id: 'pm-3', name: 'Vodafone Cash' }, transactionId: 'VF67890',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 3, nanoseconds: 0 },
    user: { id: 'user-regular', name: 'Ahmed Hossam', email: 'ahmed@example.com', phoneNumber: '01000000003' },
  },
  {
    id: 'ord_3', userId: 'user-admin', items: [{ id: 'prod-4-cart', productId: 'prod-4', name: 'ESP32-S3 Development Board', slug: 'esp32-s3-dev-board', image: 'https://images.unsplash.com/photo-1629051871926-9d3023d6bdf1?q=80&w=600&auto=format&fit=crop', quantity: 5, price: 650, configuration: {} }],
    totalPrice: 3250, status: 'Pending Verification', shippingAddress: { fullName: 'Admin User', phoneNumber: '01000000002', address: '456 Admin Ave', city: 'Giza' }, paymentMethod: { id: 'pm-1', name: 'Cash on Delivery' }, transactionId: 'N/A',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400, nanoseconds: 0 },
    user: { id: 'user-admin', name: 'Admin User', email: 'admin@example.com', phoneNumber: '01000000002' },
  },
   {
    id: 'ord_4', userId: 'user-regular', items: [
        { id: 'prod-6-cart', productId: 'prod-6', name: 'Ultrasonic Distance Sensor (HC-SR04)', slug:'ultrasonic-distance-sensor-hc-sr04', image: 'https://images.unsplash.com/photo-1615906655572-4d2de3431f2b?q=80&w=600&auto=format&fit=crop', quantity: 10, price: 75, configuration: {} },
        { id: 'prod-8-cart', productId: 'prod-8', name: 'BME280 Environmental Sensor Module', slug:'bme280-environmental-sensor-module', image: 'https://images.unsplash.com/photo-1580371694726-a07cb18815f3?q=80&w=600&auto=format&fit=crop', quantity: 2, price: 350, configuration: {} },
    ],
    totalPrice: 1450, status: 'Completed/Delivered', shippingAddress: { fullName: 'Ahmed Hossam', phoneNumber: '01000000003', address: '123 Abc Street', city: 'Cairo' }, paymentMethod: { id: 'pm-3', name: 'Vodafone Cash' }, transactionId: 'VF99887',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 10, nanoseconds: 0 },
    user: { id: 'user-regular', name: 'Ahmed Hossam', email: 'ahmed@example.com', phoneNumber: '01000000003' },
  },
];

let mockCoupons = [
    { id: 'coup-1', code: 'MAKERSPACE', type: 'percentage', value: 10, maxUses: 100, usedCount: 23, expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0] },
    { id: 'coup-2', code: 'WELCOME100', type: 'fixed', value: 100, maxUses: 500, usedCount: 150, expiryDate: null },
];

let mockSocialLinks = [
    { id: 'soc-fb', platform: 'Facebook', url: 'https://facebook.com/microchub', enabled: true },
    { id: 'soc-gh', platform: 'GitHub', url: 'https://github.com/microchub', enabled: true },
    { id: 'soc-in', platform: 'Instagram', url: 'https://instagram.com/microchub', enabled: true },
];

let mockQuotes = [
  {
    id: 'quote_1', userId: 'user-regular', items: [{ id: 'prod-2-cart', productId: 'prod-2', name: 'Desktop CNC 3018 Pro Kit', slug: 'desktop-cnc-3018-pro', image: 'https://images.unsplash.com/photo-1620352538982-255a2a9b3f36?q=80&w=600&auto=format&fit=crop', quantity: 1, price: 8500, configuration: { "Material": "Black Acrylic instead of Clear" } }],
    status: 'Quoted', userNotes: 'Is it possible to get this kit with black acrylic parts instead of the standard clear ones?', quotedPrice: 9000, adminNotes: 'Yes, we can cut it from black acrylic. The material cost is slightly higher.', createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 5, nanoseconds: 0 },
    user: { id: 'user-regular', name: 'Ahmed Hossam', email: 'ahmed@example.com', phoneNumber: '01000000003' }
  },
  {
    id: 'quote_2', userId: 'user-admin', items: [{ id: 'prod-7-cart', productId: 'prod-7', name: 'DIY Smart Watch Kit', slug: 'diy-smart-watch-kit', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600&auto=format&fit=crop', quantity: 10, price: 1800, configuration: { "Case Color": "Red" } }],
    status: 'Pending Review', userNotes: 'Need a bulk order of 10 red smart watch kits for a workshop.', createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 2, nanoseconds: 0 },
    user: { id: 'user-admin', name: 'Admin User', email: 'admin@example.com', phoneNumber: '01000000002' }
  },
  {
    id: 'quote_3', userId: 'user-regular', items: [{ id: 'prod-7-cart-2', productId: 'prod-7', name: 'DIY Smart Watch Kit', slug: 'diy-smart-watch-kit', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600&auto=format&fit=crop', quantity: 1, price: 1800, configuration: { "MCU": "ESP32-S3" } }],
    status: 'Rejected', userNotes: 'Can you swap the ESP32 for an ESP32-S3? Need it for the AI features.', quotedPrice: 2200, adminNotes: 'We can do this, but it requires a custom PCB layout. The new price reflects this change.', createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 12, nanoseconds: 0 },
    user: { id: 'user-regular', name: 'Ahmed Hossam', email: 'ahmed@example.com', phoneNumber: '01000000003' }
  },
  {
    id: 'quote_4', userId: 'user-regular', items: [{ id: 'prod-1-cart-quote', productId: 'prod-1', name: 'Arduino Uno Ultimate Starter Kit', slug: 'arduino-uno-ultimate-starter-kit', image: 'https://images.unsplash.com/photo-1559386484-97dfc0e150a9?q=80&w=600&auto=format&fit=crop', quantity: 1, price: 1250, configuration: { "Board": "Arduino Nano instead of Uno" } }],
    status: 'Accepted', userNotes: 'Can I get a Nano instead of an Uno in this kit?', quotedPrice: 1250, adminNotes: 'Sure, we can swap that for you at no extra cost.', createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 15, nanoseconds: 0 },
    user: { id: 'user-regular', name: 'Ahmed Hossam', email: 'ahmed@example.com', phoneNumber: '01000000003' }
  },
];

let mockLegalAgreement = {
    fileName: 'MicroChub-Restricted-Item-Agreement-v1.pdf',
    fileContent: 'data:application/pdf;base64,....', // a dummy base64 string
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
};

const mockAuthenticatedUser = { uid: 'user-super-admin', email: 'super_admin@example.com', displayName: 'Super Admin', profile: mockUsers[0] };
let mockCart: any[] = [];
let mockWishlist: any[] = [
    { id: 'wish-1', userId: 'user-super-admin', productId: 'prod-2', addedAt: Date.now() },
    { id: 'wish-2', userId: 'user-super-admin', productId: 'prod-7', addedAt: Date.now() },
];


// --- API HANDLER ---

function createMockResponse(data: any) {
  return NextResponse.json({ success: true, data, error: null });
}

function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, data: null, error: { message }}, { status });
}

async function handler(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method;

  // Handle GET requests
  if (method === 'GET') {
    const userMatch = pathname.match(/^\/api\/users\/([a-zA-Z0-9-]+)$/);
    if (userMatch) {
      const user = mockUsers.find(u => u.id === userMatch[1]);
      return user ? createMockResponse(user) : createErrorResponse('User not found', 404);
    }
    const userOrdersMatch = pathname.match(/^\/api\/orders\/user\/([a-zA-Z0-9-]+)$/);
    if (userOrdersMatch) {
        return createMockResponse(mockOrders.filter(o => o.userId === userOrdersMatch[1]));
    }

    // Collection routes
    switch (pathname) {
      case '/api/orders':
        return createMockResponse(mockOrders);
      case '/api/orders/me':
        return createMockResponse(mockOrders.filter(o => o.userId === mockAuthenticatedUser.uid));
      case '/api/quotes':
        return createMockResponse(mockQuotes);
      case '/api/quotes/me':
        return createMockResponse(mockQuotes.filter(q => q.userId === mockAuthenticatedUser.uid));
      case '/api/users':
        return createMockResponse(mockUsers);
      case '/api/payment-methods':
        const onlyEnabled = req.nextUrl.searchParams.get('enabled') === 'true';
        return createMockResponse(onlyEnabled ? mockPaymentMethods.filter(l => l.enabled) : mockPaymentMethods);
      case '/api/social-links':
        return createMockResponse(mockSocialLinks);
      case '/api/legal/agreement':
        return createMockResponse(mockLegalAgreement);
      case '/api/coupons':
        return createMockResponse(mockCoupons);
      case '/api/cart':
        return createMockResponse(mockCart);
      case '/api/wishlist':
        return createMockResponse(mockWishlist);
      case '/api/auth/me':
        return createMockResponse(mockAuthenticatedUser);
      default:
        break; // Fall through to 404
    }
  }

  // Handle POST requests
  if (method === 'POST') {
    const body = await req.json();
    switch (pathname) {
        case '/api/auth/login':
        case '/api/auth/signup':
            return createMockResponse(mockAuthenticatedUser);
        case '/api/auth/logout':
            return createMockResponse(null);
        case '/api/coupons/apply':
            const coupon = mockCoupons.find(c => c.code === body.code);
            return coupon ? createMockResponse(coupon) : createErrorResponse('Invalid coupon code.');
        case '/api/cart/items':
            const { product, quantity, configuration, price } = body;
            if (product) {
                const configHash = Buffer.from(JSON.stringify(configuration || {})).toString('hex').slice(0, 8);
                const cartItemId = `${product.id}-${configHash}`;
                const existingItemIndex = mockCart.findIndex(item => item.id === cartItemId);
                if (existingItemIndex > -1) {
                    mockCart[existingItemIndex].quantity += quantity;
                } else {
                    mockCart.push({ id: cartItemId, price, ...body });
                }
            }
            return createMockResponse(mockCart);
        case '/api/wishlist':
            if (!mockWishlist.some(item => item.productId === body.productId)) {
                const newWishlistItem = { id: `${mockAuthenticatedUser.uid}-${body.productId}`, productId: body.productId, userId: mockAuthenticatedUser.uid, addedAt: Date.now() };
                mockWishlist.push(newWishlistItem);
            }
            return createMockResponse(mockWishlist.find(item => item.productId === body.productId));
        case '/api/orders':
            return createMockResponse({ orderId: `ord_${Math.random().toString(36).substring(2, 9)}` });
        default:
            break;
    }
  }

  // Handle DELETE requests
  if (method === 'DELETE') {
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

  // Handle PATCH requests
  if (method === 'PATCH') {
      const cartItemMatch = pathname.match(/^\/api\/cart\/items\/(.+)$/);
      if (cartItemMatch) {
          const { quantity } = await req.json();
          const itemIndex = mockCart.findIndex(item => item.id === cartItemMatch[1]);
          if (itemIndex > -1) {
              if (quantity > 0) mockCart[itemIndex].quantity = quantity;
              else mockCart.splice(itemIndex, 1);
          }
          return createMockResponse(mockCart);
      }
  }


  // Fallback for any unhandled route
  return createErrorResponse(`Mock route not found for ${pathname}`, 404);
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
