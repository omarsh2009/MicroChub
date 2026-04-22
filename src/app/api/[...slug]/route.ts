
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// --- MOCK DATA ---

const mockCategories = [
    { id: 'cat-1', name: 'DIY Kits', slug: 'diy-kits' },
    { id: 'cat-2', name: 'Arduino', slug: 'arduino' },
    { id: 'cat-3', name: 'Sensors', slug: 'sensors' },
    { id: 'cat-6', name: 'ESP Devices', slug: 'esp-devices' },
];

const mockProducts = [
  {
    id: 'prod-1',
    slug: 'arduino-uno-ultimate-starter-kit',
    name: 'Arduino Uno Ultimate Starter Kit',
    description: 'The perfect kit for beginners to dive into the world of Arduino. Includes an Arduino Uno, breadboard, and a huge assortment of sensors and components.',
    price: 1250,
    image: 'https://images.unsplash.com/photo-1559386484-97dfc0e150a9?q=80&w=600&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1620352538982-255a2a9b3f36?q=80&w=600&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1544890225-2f3faec4cd60?q=80&w=600&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1629051871926-9d3023d6bdf1?q=80&w=600&auto=format&fit=crop',
    categoryIds: ['cat-6'],
    specs: { 'MCU': 'ESP32-S3', 'Flash': '16MB', 'PSRAM': '8MB', 'Connectivity': 'Wi-Fi, Bluetooth 5.0' },
    useCases: ['Portable IoT projects', 'Edge AI applications', 'Complex robotics'],
    productType: 'ready',
  },
  {
    id: 'prod-5',
    slug: 'raspberry-pi-4-model-b-8gb',
    name: 'Raspberry Pi 4 Model B (8GB)',
    description: 'The most powerful Raspberry Pi yet, with a quad-core ARM Cortex-A72 processor, 8GB of RAM, and dual-monitor support at up to 4K resolution.',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1588630634289-53a5510f44e7?q=80&w=600&auto=format&fit=crop',
    categoryIds: ['cat-2'],
    specs: { 'SoC': 'Broadcom BCM2711', 'RAM': '8GB LPDDR4', 'Ports': '2x USB 3.0, 2x USB 2.0, 2x micro-HDMI' },
    useCases: ['Desktop computer replacement', 'Home media server (Plex)', 'Network-wide ad-blocker (Pi-hole)'],
    featured: false,
    productType: 'ready',
  },
  {
    id: 'prod-6',
    slug: 'ultrasonic-distance-sensor-hc-sr04',
    name: 'Ultrasonic Distance Sensor (HC-SR04)',
    description: 'A popular and low-cost sensor for measuring distance. Widely used in robotics for obstacle avoidance and in automation projects.',
    price: 75,
    image: 'https://images.unsplash.com/photo-1615906655572-4d2de3431f2b?q=80&w=600&auto=format&fit=crop',
    categoryIds: ['cat-3'],
    specs: { 'Range': '2cm - 400cm', 'Voltage': '5V DC', 'Interface': '4-pin (VCC, Trig, Echo, GND)' },
    useCases: ['Robot obstacle avoidance', 'Parking sensor systems', 'Liquid level measurement'],
    featured: false,
    productType: 'ready',
  },
  {
    id: 'prod-7',
    slug: 'diy-smart-watch-kit',
    name: 'DIY Smart Watch Kit',
    description: 'Build your own smart watch from scratch! This kit includes an ESP32, a round LCD display, and all the necessary components to create a functional wearable.',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600&auto=format&fit=crop',
    categoryIds: ['cat-1', 'cat-6'],
    specs: { 'Display': '1.28" Round LCD', 'MCU': 'ESP32-WROOM-32', 'Battery': '150mAh LiPo' },
    useCases: ['Learning about wearables', 'Customizing your own watch faces', 'IoT notifications on your wrist'],
    productType: 'build_to_order',
  },
  {
    id: 'prod-8',
    slug: 'bme280-environmental-sensor-module',
    name: 'BME280 Environmental Sensor Module',
    description: 'A high-precision sensor from Bosch that measures temperature, humidity, and barometric pressure. Perfect for weather stations and indoor air quality monitoring.',
    price: 350,
    image: 'https://images.unsplash.com/photo-1580371694726-a07cb18815f3?q=80&w=600&auto=format&fit=crop',
    categoryIds: ['cat-3'],
    specs: { 'Interface': 'I2C/SPI', 'Temperature Range': '-40 to 85°C', 'Pressure Range': '300 to 1100 hPa' },
    useCases: ['Mini weather station', 'Home automation', 'Altitude tracking'],
    featured: false,
    productType: 'ready',
  },
];

let mockUsers = [
  { id: 'user-super-admin', name: 'Super Admin', email: 'super_admin@example.com', phoneNumber: '01000000001', role: 'super_admin', wishlist: [] },
  { id: 'user-admin', name: 'Admin User', email: 'admin@example.com', phoneNumber: '01000000002', role: 'admin', wishlist: [] },
  { id: 'user-regular', name: 'Ahmed Hossam', email: 'ahmed@example.com', phoneNumber: '01000000003', role: 'user', wishlist: [] },
];

let mockPaymentMethods = [
    { id: 'pm-1', name: 'Cash on Delivery', type: 'username', value: 'N/A', instructions: 'Pay in cash when your order is delivered.', enabled: true },
    { id: 'pm-2', name: 'Credit Card', type: 'paymentLink', value: 'https://pay.example.com', instructions: 'Pay via our secure payment link.', enabled: false },
    { id: 'pm-3', name: 'Vodafone Cash', type: 'phoneNumber', value: '01012345678', instructions: 'Send the total amount to this number and enter the transaction ID.', enabled: true },
];

let mockOrders = [
  {
    id: 'ord_1', userId: 'user-regular', items: [{ id: 'prod-1-cart', productId: 'prod-1', name: 'Arduino Uno Ultimate Starter Kit', slug:'arduino-uno-ultimate-starter-kit', image: mockProducts[0].image, quantity: 1, price: 1250, configuration: {} }],
    totalPrice: 1250, status: 'Completed/Delivered', shippingAddress: { fullName: 'Ahmed Hossam', phoneNumber: '01000000003', address: '123 Abc Street', city: 'Cairo' }, paymentMethod: { id: 'pm-3', name: 'Vodafone Cash' }, transactionId: 'VF12345',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 7, nanoseconds: 0 },
    user: { id: 'user-regular', name: 'Ahmed Hossam', email: 'ahmed@example.com', phoneNumber: '01000000003' },
  },
  {
    id: 'ord_2', userId: 'user-regular', items: [{ id: 'prod-2-cart', productId: 'prod-2', name: 'Desktop CNC 3018 Pro Kit', slug: 'desktop-cnc-3018-pro', image: mockProducts[1].image, quantity: 1, price: 8500, configuration: {} }],
    totalPrice: 8500, status: 'In Production', shippingAddress: { fullName: 'Ahmed Hossam', phoneNumber: '01000000003', address: '123 Abc Street', city: 'Cairo' }, paymentMethod: { id: 'pm-3', name: 'Vodafone Cash' }, transactionId: 'VF67890',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 3, nanoseconds: 0 },
    user: { id: 'user-regular', name: 'Ahmed Hossam', email: 'ahmed@example.com', phoneNumber: '01000000003' },
  },
  {
    id: 'ord_3', userId: 'user-admin', items: [{ id: 'prod-4-cart', productId: 'prod-4', name: 'ESP32-S3 Development Board', slug: 'esp32-s3-dev-board', image: mockProducts[3].image, quantity: 5, price: 650, configuration: {} }],
    totalPrice: 3250, status: 'Pending Verification', shippingAddress: { fullName: 'Admin User', phoneNumber: '01000000002', address: '456 Admin Ave', city: 'Giza' }, paymentMethod: { id: 'pm-1', name: 'Cash on Delivery' }, transactionId: 'N/A',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400, nanoseconds: 0 },
    user: { id: 'user-admin', name: 'Admin User', email: 'admin@example.com', phoneNumber: '01000000002' },
  },
   {
    id: 'ord_4', userId: 'user-regular', items: [
        { id: 'prod-6-cart', productId: 'prod-6', name: 'Ultrasonic Distance Sensor (HC-SR04)', slug:'ultrasonic-distance-sensor-hc-sr04', image: mockProducts[5].image, quantity: 10, price: 75, configuration: {} },
        { id: 'prod-8-cart', productId: 'prod-8', name: 'BME280 Environmental Sensor Module', slug:'bme280-environmental-sensor-module', image: mockProducts[7].image, quantity: 2, price: 350, configuration: {} },
    ],
    totalPrice: 1450, status: 'Shipped', shippingAddress: { fullName: 'Ahmed Hossam', phoneNumber: '01000000003', address: '123 Abc Street', city: 'Cairo' }, paymentMethod: { id: 'pm-3', name: 'Vodafone Cash' }, transactionId: 'VF99887',
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
    id: 'quote_1', userId: 'user-regular', items: [{ id: 'prod-2-cart', productId: 'prod-2', name: 'Desktop CNC 3018 Pro Kit', slug: 'desktop-cnc-3018-pro', image: mockProducts[1].image, quantity: 1, price: 8500, configuration: { "Material": "Black Acrylic instead of Clear" } }],
    status: 'Quoted', userNotes: 'Is it possible to get this kit with black acrylic parts instead of the standard clear ones?', quotedPrice: 9000, adminNotes: 'Yes, we can cut it from black acrylic. The material cost is slightly higher.', createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 5, nanoseconds: 0 },
    user: { id: 'user-regular', name: 'Ahmed Hossam', email: 'ahmed@example.com', phoneNumber: '01000000003' }
  },
  {
    id: 'quote_2', userId: 'user-admin', items: [{ id: 'prod-7-cart', productId: 'prod-7', name: 'DIY Smart Watch Kit', slug: 'diy-smart-watch-kit', image: mockProducts[6].image, quantity: 10, price: 1800, configuration: { "Case Color": "Red" } }],
    status: 'Pending Review', userNotes: 'Need a bulk order of 10 red smart watch kits for a workshop.', createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 2, nanoseconds: 0 },
    user: { id: 'user-admin', name: 'Admin User', email: 'admin@example.com', phoneNumber: '01000000002' }
  },
  {
    id: 'quote_3', userId: 'user-regular', items: [{ id: 'prod-7-cart-2', productId: 'prod-7', name: 'DIY Smart Watch Kit', slug: 'diy-smart-watch-kit', image: mockProducts[6].image, quantity: 1, price: 1800, configuration: { "MCU": "ESP32-S3" } }],
    status: 'Rejected', userNotes: 'Can you swap the ESP32 for an ESP32-S3? Need it for the AI features.', quotedPrice: 2200, adminNotes: 'We can do this, but it requires a custom PCB layout. The new price reflects this change.', createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 12, nanoseconds: 0 },
    user: { id: 'user-regular', name: 'Ahmed Hossam', email: 'ahmed@example.com', phoneNumber: '01000000003' }
  },
  {
    id: 'quote_4', userId: 'user-regular', items: [{ id: 'prod-1-cart-quote', productId: 'prod-1', name: 'Arduino Uno Ultimate Starter Kit', slug: 'arduino-uno-ultimate-starter-kit', image: mockProducts[0].image, quantity: 1, price: 1250, configuration: { "Board": "Arduino Nano instead of Uno" } }],
    status: 'Accepted', userNotes: 'Can I get a Nano instead of an Uno in this kit?', quotedPrice: 1250, adminNotes: 'Sure, we can swap that for you at no extra cost.', createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 15, nanoseconds: 0 },
    user: { id: 'user-regular', name: 'Ahmed Hossam', email: 'ahmed@example.com', phoneNumber: '01000000003' }
  },
];

const mockLegalAgreement = {
    fileName: 'MicroChub-Restricted-Item-Agreement-v1.pdf',
    fileContent: 'data:application/pdf;base64,....', // a dummy base64 string
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
};

const mockAuthenticatedUser = { uid: 'user-super-admin', email: 'super_admin@example.com', displayName: 'Super Admin', profile: mockUsers[0] };
let mockCart: any[] = [];
let mockWishlist: any[] = [];


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
    // Specific item routes (e.g., /api/products/some-slug)
    const productSlugMatch = pathname.match(/^\/api\/products\/([a-zA-Z0-9-]+)$/);
    if (productSlugMatch) {
      const product = mockProducts.find(p => p.slug === productSlugMatch[1]);
      return product ? createMockResponse(product) : createErrorResponse('Product not found', 404);
    }
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
      case '/api/products':
        const categorySlug = req.nextUrl.searchParams.get('category');
        if (categorySlug) {
            const category = mockCategories.find(c => c.slug === categorySlug);
            const filtered = category ? mockProducts.filter(p => p.categoryIds.includes(category.id)) : [];
            return createMockResponse(filtered);
        }
        return createMockResponse(mockProducts);
      case '/api/products/featured':
        return createMockResponse(mockProducts.filter(p => p.featured));
      case '/api/categories':
        return createMockResponse(mockCategories);
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
            const product = mockProducts.find(p => p.id === body.productId);
            if (product) {
                const configHash = Buffer.from(JSON.stringify(body.configuration || {})).toString('hex').slice(0, 8);
                const cartItemId = `${body.productId}-${configHash}`;
                const existingItemIndex = mockCart.findIndex(item => item.id === cartItemId);
                if (existingItemIndex > -1) {
                    mockCart[existingItemIndex].quantity += body.quantity;
                } else {
                    mockCart.push({ id: cartItemId, ...body, name: product.name, slug: product.slug, image: product.image });
                }
            }
            return createMockResponse(mockCart);
        case '/api/wishlist':
            if (!mockWishlist.some(item => item.productId === body.productId)) {
                const newWishlistItem = { id: `${mockAuthenticatedUser.uid}-${body.productId}`, productId: body.productId, userId: mockAuthenticatedUser.uid, addedAt: Date.now() };
                mockWishlist.push(newWishlistItem);
            }
            return createMockResponse(mockWishlist);
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

    