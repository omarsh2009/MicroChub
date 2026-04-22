
import { NextResponse } from 'next/server';

// --- MOCK DATA DEFINITIONS ---

const mockCategories = [
    { id: '1', name: 'Mochi', slug: 'mochi' },
    { id: '2', name: 'ESP Devices', slug: 'esp-devices' },
    { id: '3', name: 'Arduino Projects', slug: 'arduino-projects' },
    { id: '4', name: 'Smart Displays', slug: 'smart-displays' },
    { id: '5', name: 'DIY Kits', slug: 'diy-kits' },
    { id: '6', name: 'Robotics', slug: 'robotics' },
    { id: '7', name: '3D Printing', slug: '3d-printing' },
];

const mockProducts = [
  {
    id: '1',
    slug: 'mochi-v5-pro',
    name: 'Mochi v5 Pro',
    description: 'The ultimate tool for WiFi penetration testing and development, packed in a sleek, portable form factor with an external antenna.',
    price: 1800,
    image: 'https://picsum.photos/seed/mochipro/600/400',
    categoryIds: ['1', '2'],
    specs: { 'MCU': 'ESP32-S3', 'Connectivity': 'Wi-Fi, Bluetooth 5.0', 'Antenna': 'External SMA' },
    useCases: ['Wi-Fi Deauthentication', 'Packet sniffing', 'Evil Twin attacks', 'Wardriving'],
    featured: true,
    isRestricted: true,
    productType: 'build_to_order'
  },
  {
    id: '2',
    slug: 'pico-deck-plus',
    name: 'Pico Deck Plus',
    description: 'A versatile 8-key macro-pad powered by the Raspberry Pi Pico, perfect for custom shortcuts and commands.',
    price: 850,
    image: 'https://picsum.photos/seed/picodeckplus/600/400',
    categoryIds: ['3', '5'],
    specs: { 'MCU': 'RP2040', 'Keys': '8 programmable mechanical keys', 'Encoder': 'Rotary Encoder Knob' },
    useCases: ['Custom macros for coding', 'Streaming controls (OBS)', 'Gaming shortcuts', 'Volume control'],
    featured: true,
    productType: 'ready',
    customizationGroups: [
        {
            name: 'Switch Type',
            type: 'single',
            required: true,
            options: [
                { name: 'Red Switches (Linear)', priceAdjustment: 0 },
                { name: 'Brown Switches (Tactile)', priceAdjustment: 50 },
                { name: 'Blue Switches (Clicky)', priceAdjustment: 50 },
            ]
        },
        {
            name: 'Addons',
            type: 'multi',
            required: false,
            options: [
                { name: 'Custom Keycaps', priceAdjustment: 0, requestQuote: true },
                { name: 'Braided USB-C Cable', priceAdjustment: 150 },
            ]
        }
    ]
  },
  {
      id: '3',
      slug: 'esp32-s3-dev-pro',
      name: 'ESP32-S3 Dev Board Pro',
      description: 'A powerful and feature-rich development board based on the ESP32-S3 with integrated battery management.',
      price: 600,
      image: 'https://picsum.photos/seed/esp32pro/600/400',
      categoryIds: ['2'],
      specs: { 'MCU': 'ESP32-S3', 'Flash': '16MB', 'PSRAM': '8MB', 'Battery': 'JST-PH connector + Charging Circuit' },
      useCases: ['Portable IoT projects', 'Edge AI with battery backup', 'Complex robotics'],
      featured: true,
      productType: 'ready'
  },
  {
      id: '4',
      slug: 'smart-display-hub-7',
      name: 'Smart Display Hub 7"',
      description: 'A 7-inch high-resolution touch display with an ESP32 for building beautiful custom smart home dashboards.',
      price: 1500,
      image: 'https://picsum.photos/seed/display7/600/400',
      categoryIds: ['4'],
      specs: { 'Display': '7" IPS Touchscreen', 'Resolution': '1024x600', 'MCU': 'ESP32-S3 WROOM' },
      useCases: ['Home Assistant dashboard', 'Interactive Kiosks', 'Custom user interfaces for projects'],
      featured: false,
      productType: 'build_to_order'
  },
  {
    id: '5',
    slug: 'robot-arm-kit',
    name: 'Robotic Arm Kit',
    description: 'A 4-axis robotic arm kit based on Arduino. Perfect for learning robotics and inverse kinematics.',
    price: 2200,
    image: 'https://picsum.photos/seed/robotarm/600/400',
    categoryIds: ['6', '3', '5'],
    specs: { 'Axes': '4', 'Control': 'Arduino UNO (included)', 'Material': 'Laser-cut Acrylic' },
    useCases: ['Learning robotics programming', 'Pick and place automation', 'Educational projects'],
    featured: true,
    productType: 'ready'
  },
  {
    id: '6',
    slug: 'ender-3-v3-se',
    name: 'Creality Ender-3 V3 SE',
    description: 'The latest iteration of the famous Ender-3 3D printer. Easy to assemble and packed with features like auto-leveling.',
    price: 10500,
    image: 'https://picsum.photos/seed/ender3/600/400',
    categoryIds: ['7'],
    specs: { 'Build Volume': '220x220x250mm', 'Leveling': 'CR-Touch Auto Leveling', 'Extruder': 'Direct Drive "Sprite"' },
    useCases: ['Prototyping parts', 'Printing miniatures', 'Functional prints for home'],
    featured: false,
    productType: 'ready'
  },
  {
    id: '7',
    slug: 'soldering-station-pro',
    name: 'Soldering Station Pro',
    description: 'A professional-grade soldering station with digital temperature control and a variety of tips.',
    price: 3500,
    image: 'https://picsum.photos/seed/soldering/600/400',
    categoryIds: ['5'],
    specs: { 'Temperature Range': '100°C - 480°C', 'Power': '75W', 'Display': 'Digital LCD' },
    useCases: ['PCB assembly', 'Component repair', 'DIY electronics'],
    featured: false,
    productType: 'ready'
  },
];

const mockUsers = [
  {
    id: 'super-admin-user-id',
    name: 'Super Admin',
    email: 'super_admin@example.com',
    phoneNumber: '01234567890',
    wishlist: [],
    role: 'super_admin',
  },
  {
    id: 'admin-user-id',
    name: 'Admin User',
    email: 'admin@example.com',
    phoneNumber: '01000000000',
    wishlist: ['2'],
    role: 'admin',
  },
  {
    id: 'test-user-1',
    name: 'Ali Hassan',
    email: 'ali@example.com',
    phoneNumber: '01112223334',
    wishlist: ['1', '5'],
    role: 'user',
  },
  {
    id: 'test-user-2',
    name: 'Fatima Ahmed',
    email: 'fatima@example.com',
    phoneNumber: '01556677889',
    wishlist: ['6'],
    role: 'user',
  },
  {
    id: 'test-user-3',
    name: 'Youssef Mohamed',
    email: 'youssef@example.com',
    phoneNumber: '01287654321',
    wishlist: ['3', '4'],
    role: 'user',
  }
];

const mockAuthenticatedUser = {
    uid: 'super-admin-user-id',
    email: 'super_admin@example.com',
    displayName: 'Super Admin',
    profile: mockUsers[0]
};

const mockOrders = [
  {
    id: 'ord_abc12',
    userId: 'test-user-1',
    items: [{ id: '1', productId: '1', name: 'Mochi v5 Pro', slug: 'mochi-v5-pro', image: 'https://picsum.photos/seed/mochipro/600/400', quantity: 1, price: 1800, configuration: {} }],
    totalPrice: 1800, status: 'Completed/Delivered', shippingAddress: { fullName: 'Ali Hassan', phoneNumber: '01112223334', address: '123 Nasr City', city: 'Cairo' }, paymentMethod: { id: 'pm_1', name: 'Instapay' }, transactionId: 'txn_mock_123',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - (86400 * 5), nanoseconds: 0 },
    user: { id: 'test-user-1', name: 'Ali Hassan', email: 'ali@example.com', phoneNumber: '01112223334' },
    requiresLegalApproval: true, legalAgreementApproved: true, legalAgreementUrl: '#'
  },
  {
    id: 'ord_def34',
    userId: 'test-user-2',
    items: [{ id: '2', productId: '2', name: 'Pico Deck Plus', slug: 'pico-deck-plus', image: 'https://picsum.photos/seed/picodeckplus/600/400', quantity: 1, price: 900, configuration: { 'Switch Type': 'Brown Switches (Tactile)' } }],
    totalPrice: 900, status: 'In Production', shippingAddress: { fullName: 'Fatima Ahmed', phoneNumber: '01556677889', address: '456 Maadi', city: 'Cairo' }, paymentMethod: { id: 'pm_2', name: 'Vodafone Cash' }, transactionId: 'txn_mock_456',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - (86400 * 3), nanoseconds: 0 },
    user: { id: 'test-user-2', name: 'Fatima Ahmed', email: 'fatima@example.com', phoneNumber: '01556677889' }
  },
  {
    id: 'ord_ghi56',
    userId: 'test-user-1',
    items: [{ id: '6', productId: '6', name: 'Creality Ender-3 V3 SE', slug: 'ender-3-v3-se', image: 'https://picsum.photos/seed/ender3/600/400', quantity: 1, price: 10500, configuration: {} }],
    totalPrice: 10500, status: 'Pending Verification', shippingAddress: { fullName: 'Ali Hassan', phoneNumber: '01112223334', address: '123 Nasr City', city: 'Cairo' }, paymentMethod: { id: 'pm_1', name: 'Instapay' }, transactionId: 'txn_mock_789',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 3600, nanoseconds: 0 },
    user: { id: 'test-user-1', name: 'Ali Hassan', email: 'ali@example.com', phoneNumber: '01112223334' }
  },
   {
    id: 'ord_jkl78',
    userId: 'admin-user-id',
    items: [{ id: '5', productId: '5', name: 'Robotic Arm Kit', slug: 'robot-arm-kit', image: 'https://picsum.photos/seed/robotarm/600/400', quantity: 2, price: 2200, configuration: {} }],
    totalPrice: 4400, status: 'Cancelled', shippingAddress: { fullName: 'Admin User', phoneNumber: '01000000000', address: '789 Admin St', city: 'Giza' }, paymentMethod: { id: 'pm_1', name: 'Instapay' }, transactionId: 'txn_mock_012',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - (86400 * 10), nanoseconds: 0 },
    user: { id: 'admin-user-id', name: 'Admin User', email: 'admin@example.com', phoneNumber: '01000000000' }
  },
  {
    id: 'ord_mno90',
    userId: 'test-user-3',
    items: [{ id: '7', productId: '7', name: 'Soldering Station Pro', slug: 'soldering-station-pro', image: 'https://picsum.photos/seed/soldering/600/400', quantity: 1, price: 3500, configuration: {} }],
    totalPrice: 3500, status: 'Ready', shippingAddress: { fullName: 'Youssef Mohamed', phoneNumber: '01287654321', address: '101 Rehab City', city: 'Cairo' }, paymentMethod: { id: 'pm_2', name: 'Vodafone Cash' }, transactionId: 'txn_mock_345',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - (86400 * 2), nanoseconds: 0 },
    user: { id: 'test-user-3', name: 'Youssef Mohamed', email: 'youssef@example.com', phoneNumber: '01287654321' }
  },
];

const mockQuotes = [
    {
        id: 'quote_abcde',
        userId: 'test-user-1',
        items: [{ id: '2', productId: '2', name: 'Pico Deck Plus', slug: 'pico-deck-plus', image: 'https://picsum.photos/seed/picodeckplus/600/400', quantity: 1, price: 850, configuration: { 'Switch Type': 'Blue Switches (Clicky)', 'Addons': 'Custom Keycaps' } }],
        status: 'Quoted',
        quotedPrice: 1250,
        adminNotes: 'Custom keycaps will be 3D printed with a design of your choice.',
        createdAt: { seconds: Math.floor(Date.now() / 1000) - (86400 * 2), nanoseconds: 0 },
        user: { id: 'test-user-1', name: 'Ali Hassan', email: 'ali@example.com', phoneNumber: '01112223334' }
    },
    {
        id: 'quote_fghij',
        userId: 'test-user-2',
        items: [{ id: '5', productId: '5', name: 'Robotic Arm Kit', slug: 'robot-arm-kit', image: 'https://picsum.photos/seed/robotarm/600/400', quantity: 1, price: 2200, configuration: {} }],
        status: 'Accepted',
        userNotes: 'Can this be made with black acrylic instead of clear?',
        quotedPrice: 2400,
        adminNotes: 'Yes, we can use black acrylic for an additional EGP 200.',
        createdAt: { seconds: Math.floor(Date.now() / 1000) - (86400 * 4), nanoseconds: 0 },
        user: { id: 'test-user-2', name: 'Fatima Ahmed', email: 'fatima@example.com', phoneNumber: '01556677889' }
    },
    {
        id: 'quote_klmno',
        userId: 'admin-user-id',
        items: [{ id: '1', productId: '1', name: 'Mochi v5 Pro', slug: 'mochi-v5-pro', image: 'https://picsum.photos/seed/mochipro/600/400', quantity: 1, price: 1800, configuration: {} }],
        status: 'Pending Review',
        userNotes: 'I need a custom firmware with packet monitoring mode enabled by default.',
        createdAt: { seconds: Math.floor(Date.now() / 1000) - (86400 * 1), nanoseconds: 0 },
        user: { id: 'admin-user-id', name: 'Admin User', email: 'admin@example.com', phoneNumber: '01000000000' }
    },
    {
        id: 'quote_pqrst',
        userId: 'test-user-3',
        items: [{ id: '4', productId: '4', name: 'Smart Display Hub 7"', slug: 'smart-display-hub-7', image: 'https://picsum.photos/seed/display7/600/400', quantity: 5, price: 1500, configuration: {} }],
        status: 'Rejected',
        userNotes: 'Need a bulk discount for 5 units.',
        quotedPrice: 7250,
        adminNotes: 'We can offer a 5% discount for a total of EGP 7125.',
        createdAt: { seconds: Math.floor(Date.now() / 1000) - (86400 * 6), nanoseconds: 0 },
        user: { id: 'test-user-3', name: 'Youssef Mohamed', email: 'youssef@example.com', phoneNumber: '01287654321' }
    },
];

const mockCoupons = [
    { id: 'coup_1', code: 'MAKER10', type: 'percentage', value: 10, maxUses: 100, usedCount: 23, expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0] },
    { id: 'coup_2', code: 'RAMADAN50', type: 'fixed', value: 50, maxUses: 200, usedCount: 150, expiryDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0] },
    { id: 'coup_3', code: 'EXPIRED', type: 'percentage', value: 20, maxUses: 50, usedCount: 49, expiryDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0] },
    { id: 'coup_4', code: 'LIMITOUT', type: 'fixed', value: 100, maxUses: 10, usedCount: 10 },
];

const mockPaymentMethods = [
    { id: 'pm_1', name: 'Instapay', type: 'username', value: '@microchub', instructions: 'Send the total amount to our Instapay username and enter the transaction ID.', enabled: true },
    { id: 'pm_2', name: 'Vodafone Cash', type: 'phoneNumber', value: '01012345678', instructions: 'Send to this number and enter the transaction ID.', enabled: true },
    { id: 'pm_3', name: 'Telda', type: 'username', value: '@microchub.telda', instructions: 'Pay via Telda and provide the transaction reference.', enabled: false },
];

const mockSocialLinks = [
    { id: 'soc_1', platform: 'Facebook', url: 'https://facebook.com', enabled: true },
    { id: 'soc_2', platform: 'GitHub', url: 'https://github.com', enabled: true },
    { id: 'soc_3', platform: 'YouTube', url: 'https://youtube.com', enabled: true },
    { id: 'soc_4', platform: 'Instagram', url: 'https://instagram.com', enabled: false },
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
  
  if (request.method === 'POST' && pathname.startsWith('/api/auth/')) {
    return createMockResponse(mockAuthenticatedUser);
  }

  if (pathname === '/api/auth/me') {
      return createMockResponse(mockAuthenticatedUser);
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
  if (pathname === '/api/orders') {
    return createMockResponse(mockOrders);
  }

  if (pathname === '/api/quotes') {
    return createMockResponse(mockQuotes);
  }

  if (pathname === '/api/coupons') {
      return createMockResponse(mockCoupons);
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
  return createMockResponse([]);
}


export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };

    