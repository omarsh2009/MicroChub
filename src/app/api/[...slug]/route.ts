
import { NextResponse } from 'next/server';

// --- MOCK DATA DEFINITIONS ---

// 1. Categories
const mockCategories = [
    { id: 'cat-1', name: 'DIY Kits', slug: 'diy-kits' },
    { id: 'cat-2', name: 'Arduino', slug: 'arduino' },
    { id: 'cat-3', name: 'Sensors', slug: 'sensors' },
    { id: 'cat-4', name: 'Robotics', slug: 'robotics' },
    { id: 'cat-5', name: '3D Printing', slug: '3d-printing' },
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
    categoryIds: ['cat-1', 'cat-4'],
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
  {
    id: 'prod-5',
    slug: 'dht22-temperature-humidity-sensor',
    name: 'DHT22 Temperature & Humidity Sensor',
    description: 'A reliable and accurate digital sensor for measuring temperature and humidity. A must-have for any climate monitoring project.',
    price: 150,
    image: 'https://picsum.photos/seed/dht22/600/400',
    categoryIds: ['cat-3'],
    specs: { 'Temperature Range': '-40 to 80°C', 'Humidity Range': '0-100% RH', 'Interface': '1-Wire' },
    useCases: ['Weather stations', 'Smart thermostats', 'Incubator control'],
    productType: 'ready',
  },
  {
    id: 'prod-6',
    slug: '4-dof-robotic-arm-kit',
    name: '4-DOF Robotic Arm Kit',
    description: 'Build your own 4-axis robotic arm controlled by an Arduino. This kit is perfect for learning about robotics, kinematics, and automation.',
    price: 2200,
    image: 'https://picsum.photos/seed/robot-arm/600/400',
    categoryIds: ['cat-4', 'cat-1', 'cat-2'],
    specs: { 'Axes': '4', 'Control': 'Arduino UNO (included)', 'Material': 'Laser-cut Acrylic' },
    useCases: ['Pick and place automation', 'Educational projects', 'Learning inverse kinematics'],
    featured: false,
    productType: 'build_to_order',
  },
  {
    id: 'prod-7',
    slug: 'creality-ender-3-v3',
    name: 'Creality Ender-3 V3 3D Printer',
    description: 'The latest generation of the world\'s most popular 3D printer. Features auto-leveling and a direct-drive extruder for reliable prints.',
    price: 10500,
    image: 'https://picsum.photos/seed/ender3-v3/600/400',
    categoryIds: ['cat-5'],
    specs: { 'Build Volume': '220x220x250mm', 'Leveling': 'CR-Touch Auto Leveling', 'Extruder': 'Direct Drive "Sprite"' },
    useCases: ['Prototyping parts', 'Printing miniatures', 'Creating functional prints'],
    featured: true,
    isRestricted: true,
    productType: 'ready',
  },
  {
    id: 'prod-8',
    slug: 't962a-reflow-oven',
    name: 'T-962A Reflow Oven',
    description: 'A compact and efficient reflow oven for surface mount soldering. Perfect for small batch PCB assembly and prototyping.',
    price: 9000,
    image: 'https://picsum.photos/seed/reflow-oven/600/400',
    categoryIds: ['cat-1'],
    specs: { 'Working Area': '300x320mm', 'Power': '1500W', 'Temperature': 'Up to 280°C' },
    useCases: ['SMD soldering', 'Small-scale production', 'Professional prototyping'],
    isRestricted: true,
    productType: 'ready',
  },
];

// 3. Users
const mockUsers = [
  {
    id: 'user-super-admin',
    name: 'Super Admin',
    email: 'super_admin@example.com',
    phoneNumber: '01001112223',
    wishlist: [],
    role: 'super_admin',
  },
  {
    id: 'user-admin',
    name: 'Admin User',
    email: 'admin@example.com',
    phoneNumber: '01112223334',
    wishlist: ['prod-2'],
    role: 'admin',
  },
  {
    id: 'user-regular',
    name: 'Ahmed Hossam',
    email: 'ahmed@example.com',
    phoneNumber: '01223334445',
    wishlist: ['prod-1', 'prod-6'],
    role: 'user',
  },
];
const mockAuthenticatedUser = { uid: 'user-super-admin', email: 'super_admin@example.com', displayName: 'Super Admin', profile: mockUsers[0] };

// 4. Payment Methods
const mockPaymentMethods = [
    { id: 'pm-1', name: 'Cash on Delivery', type: 'username', value: 'N/A', instructions: 'Pay in cash when your order is delivered.', enabled: true },
    { id: 'pm-2', name: 'Credit Card', type: 'paymentLink', value: 'https://pay.example.com', instructions: 'You will be redirected to a secure payment gateway.', enabled: false }, // Disabled for now
    { id: 'pm-3', name: 'Vodafone Cash', type: 'phoneNumber', value: '01012345678', instructions: 'Send the total amount to this number and enter the transaction ID.', enabled: true },
];

// 5. Orders
const mockOrders = [
  {
    id: 'ord_1',
    userId: 'user-regular',
    items: [{ id: 'prod-1', productId: 'prod-1', name: 'Arduino Uno Ultimate Starter Kit', slug:'arduino-uno-ultimate-starter-kit', image: 'https://picsum.photos/seed/arduino-kit/600/400', quantity: 1, price: 1200, configuration: {} }],
    totalPrice: 1200, status: 'Completed/Delivered', shippingAddress: { fullName: 'Ahmed Hossam', phoneNumber: '01223334445', address: '123 Abc Street', city: 'Cairo' }, paymentMethod: { id: 'pm-3', name: 'Vodafone Cash' }, transactionId: 'VF12345',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 7, nanoseconds: 0 },
    user: { id: 'user-regular', name: 'Ahmed Hossam', email: 'ahmed@example.com', phoneNumber: '01223334445' },
  },
  {
    id: 'ord_2',
    userId: 'user-regular',
    items: [{ id: 'prod-2', productId: 'prod-2', name: 'Desktop CNC 3018 Pro Kit', slug: 'desktop-cnc-3018-pro', image: 'https://picsum.photos/seed/cnc-machine/600/400', quantity: 1, price: 8500, configuration: {} }],
    totalPrice: 8500, status: 'In Production', shippingAddress: { fullName: 'Ahmed Hossam', phoneNumber: '01223334445', address: '123 Abc Street', city: 'Cairo' }, paymentMethod: { id: 'pm-3', name: 'Vodafone Cash' }, transactionId: 'VF67890',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 3, nanoseconds: 0 },
    user: { id: 'user-regular', name: 'Ahmed Hossam', email: 'ahmed@example.com', phoneNumber: '01223334445' },
  },
  {
    id: 'ord_3',
    userId: 'user-admin',
    items: [
        { id: 'prod-3', productId: 'prod-3', name: 'IoT Sensor Pack Pro (37-in-1)', slug: 'iot-sensor-pack-pro', image: 'https://picsum.photos/seed/sensor-pack/600/400', quantity: 2, price: 950, configuration: {} },
        { id: 'prod-4', productId: 'prod-4', name: 'ESP32-S3 Development Board', slug: 'esp32-s3-dev-board', image: 'https://picsum.photos/seed/esp32-s3/600/400', quantity: 5, price: 650, configuration: {} }
    ],
    totalPrice: (950 * 2) + (650 * 5), status: 'Pending Verification', shippingAddress: { fullName: 'Admin User', phoneNumber: '01112223334', address: '456 Xyz Avenue', city: 'Giza' }, paymentMethod: { id: 'pm-1', name: 'Cash on Delivery' }, transactionId: 'N/A',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 3600, nanoseconds: 0 },
    user: { id: 'user-admin', name: 'Admin User', email: 'admin@example.com', phoneNumber: '01112223334' },
  },
  {
    id: 'ord_4',
    userId: 'user-regular',
    items: [{ id: 'prod-7', productId: 'prod-7', name: 'Creality Ender-3 V3 3D Printer', slug: 'creality-ender-3-v3', image: 'https://picsum.photos/seed/ender3-v3/600/400', quantity: 1, price: 10500, configuration: {} }],
    totalPrice: 10500, status: 'Pending Verification', shippingAddress: { fullName: 'Ahmed Hossam', phoneNumber: '01223334445', address: '123 Abc Street', city: 'Cairo' }, paymentMethod: { id: 'pm-3', name: 'Vodafone Cash' }, transactionId: 'VF11223',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 1, nanoseconds: 0 },
    user: { id: 'user-regular', name: 'Ahmed Hossam', email: 'ahmed@example.com', phoneNumber: '01223334445' },
    requiresLegalApproval: true, legalAgreementApproved: false, legalAgreementUrl: '#'
  },
];

// 6. Coupons
const mockCoupons = [
    { id: 'coup-1', code: 'MAKERSPACE', type: 'percentage', value: 10, maxUses: 100, usedCount: 23, expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0] },
    { id: 'coup-2', code: 'EID2024', type: 'fixed', value: 100, maxUses: 50, usedCount: 10, expiryDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0] },
];

// 7. Social Links
const mockSocialLinks = [
    { id: 'soc-fb', platform: 'Facebook', url: 'https://facebook.com/microchub', enabled: true },
    { id: 'soc-gh', platform: 'GitHub', url: 'https://github.com/microchub', enabled: true },
    { id: 'soc-ig', platform: 'Instagram', url: 'https://instagram.com/microchub', enabled: true },
];

// 8. Quotes
const mockQuotes = [
  {
    id: 'quote_1',
    userId: 'user-regular',
    items: [{ id: 'prod-6', productId: 'prod-6', name: '4-DOF Robotic Arm Kit', slug: '4-dof-robotic-arm-kit', image: 'https://picsum.photos/seed/robot-arm/600/400', quantity: 1, price: 2200, configuration: { "Material": "Black Acrylic instead of Clear" } }],
    status: 'Quoted',
    userNotes: 'Is it possible to get this kit with black acrylic parts instead of the standard clear ones?',
    quotedPrice: 2400,
    adminNotes: 'Yes, we can cut it from black acrylic. The material cost is slightly higher.',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 5, nanoseconds: 0 },
    user: { id: 'user-regular', name: 'Ahmed Hossam', email: 'ahmed@example.com', phoneNumber: '01223334445' }
  },
  {
    id: 'quote_2',
    userId: 'user-admin',
    items: [{ id: 'prod-8', productId: 'prod-8', name: 'T-962A Reflow Oven', slug: 't962a-reflow-oven', image: 'https://picsum.photos/seed/reflow-oven/600/400', quantity: 1, price: 9000, configuration: {} }],
    status: 'Pending Review',
    userNotes: 'I need a custom firmware for this oven to support lead-free solder profiles. Can you provide a quote?',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400, nanoseconds: 0 },
    user: { id: 'user-admin', name: 'Admin User', email: 'admin@example.com', phoneNumber: '01112223334' }
  },
  {
    id: 'quote_3',
    userId: 'user-regular',
    items: [{ id: 'prod-2', productId: 'prod-2', name: 'Desktop CNC 3018 Pro Kit', slug: 'desktop-cnc-3018-pro', image: 'https://picsum.photos/seed/cnc-machine/600/400', quantity: 2, price: 8500, configuration: {} }],
    status: 'Accepted',
    userNotes: 'Looking for a bulk discount on two units.',
    quotedPrice: 16500,
    adminNotes: 'We can offer a discount for a total of EGP 16,500 for two units.',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 10, nanoseconds: 0 },
    user: { id: 'user-regular', name: 'Ahmed Hossam', email: 'ahmed@example.com', phoneNumber: '01223334445' }
  },
  {
    id: 'quote_4',
    userId: 'user-admin',
    items: [{ id: 'prod-7', productId: 'prod-7', name: 'Creality Ender-3 V3 3D Printer', slug: 'creality-ender-3-v3', image: 'https://picsum.photos/seed/ender3-v3/600/400', quantity: 1, price: 10500, configuration: { 'Nozzle': '0.6mm Hardened Steel' } }],
    status: 'Rejected',
    userNotes: 'Can you install a 0.6mm hardened steel nozzle for printing abrasive filaments?',
    quotedPrice: 11000,
    adminNotes: 'The upgrade is possible for an additional EGP 500.',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 12, nanoseconds: 0 },
    user: { id: 'user-admin', name: 'Admin User', email: 'admin@example.com', phoneNumber: '01112223334' }
  },
];

const mockLegalAgreement = {
    fileName: 'MicroChub-Restricted-Item-Agreement-v1.pdf',
    fileContent: 'data:application/pdf;base64,....', // a dummy base64 string
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
};


// --- API HANDLER ---

function createMockResponse(data: any) {
  return NextResponse.json({ success: true, data, error: null });
}

async function handler(request: Request) {
  const { pathname, searchParams } = new URL(request.url);
  console.log(`[MOCK API] Received request for: ${request.method} ${pathname}`);

  // Auth routes
  if (pathname === '/api/auth/login' || pathname === '/api/auth/signup') {
    return createMockResponse(mockAuthenticatedUser);
  }
  if (pathname === '/api/auth/me') {
      return createMockResponse(mockAuthenticatedUser);
  }
  if (pathname === '/api/auth/logout') {
      return createMockResponse(null);
  }

  // User routes
  const userMatch = pathname.match(/^\/api\/users\/([a-zA-Z0-9-]+)$/);
  if (userMatch) {
    const userId = userMatch[1];
    return createMockResponse(mockUsers.find(u => u.id === userId));
  }
  if (pathname === '/api/users') {
    return createMockResponse(mockUsers);
  }

  // Order routes
  const userOrdersMatch = pathname.match(/^\/api\/orders\/user\/([a-zA-Z0-9-]+)$/);
  if (userOrdersMatch) {
      const userId = userOrdersMatch[1];
      return createMockResponse(mockOrders.filter(o => o.userId === userId));
  }
   if (pathname === '/api/orders/me') {
    return createMockResponse(mockOrders.filter(o => o.userId === mockAuthenticatedUser.uid));
  }
  if (pathname === '/api/orders') {
    return createMockResponse(mockOrders);
  }

  // Quote routes
   if (pathname === '/api/quotes/me') {
    return createMockResponse(mockQuotes.filter(q => q.userId === mockAuthenticatedUser.uid));
  }
  if (pathname === '/api/quotes') {
    return createMockResponse(mockQuotes);
  }

  // Coupon routes
  if (pathname === '/api/coupons') {
      return createMockResponse(mockCoupons);
  }
  if (pathname === '/api/coupons/apply') {
      const { code } = await request.json();
      const coupon = mockCoupons.find(c => c.code === code);
      if (coupon) {
          return createMockResponse(coupon);
      }
      return NextResponse.json({ success: false, data: null, error: { message: 'Invalid coupon code.' }}, { status: 400 });
  }

  // Payment Methods
  if (pathname === '/api/payment-methods') {
      const onlyEnabled = searchParams.get('enabled') === 'true';
      return createMockResponse(onlyEnabled ? mockPaymentMethods.filter(l => l.enabled) : mockPaymentMethods);
  }

  // Social Links
  if (pathname === '/api/social-links') {
      const onlyEnabled = searchParams.get('enabled') === 'true';
      return createMockResponse(onlyEnabled ? mockSocialLinks.filter(l => l.enabled) : mockSocialLinks);
  }

  // Legal Agreement
  if (pathname === '/api/legal/agreement') {
      return createMockResponse(mockLegalAgreement);
  }

  // Category routes
  if (pathname === '/api/categories') {
    return createMockResponse(mockCategories);
  }

  // Product routes
  if (pathname === '/api/products/featured') {
    return createMockResponse(mockProducts.filter(p => p.featured));
  }
   const productSlugMatch = pathname.match(/^\/api\/products\/([a-zA-Z0-9-]+)$/);
   if (productSlugMatch) {
    const slug = productSlugMatch[1];
    const product = mockProducts.find(p => p.slug === slug);
    return createMockResponse(product || null);
  }
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

  // Fallback for any other route
  return NextResponse.json({ success: false, data: null, error: { message: `Mock route not found for ${pathname}` }}, { status: 404 });
}


export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
