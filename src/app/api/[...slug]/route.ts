
import { NextResponse } from 'next/server';

const mockCategories = [
    { id: '1', name: 'Mochi', slug: 'mochi' },
    { id: '2', name: 'ESP Devices', slug: 'esp-devices' },
    { id: '3', name: 'Arduino Projects', slug: 'arduino-projects' },
    { id: '4', name: 'Smart Displays', slug: 'smart-displays' },
    { id: '5', name: 'DIY Kits', slug: 'diy-kits' },
];

const mockProducts = [
  {
    id: '1',
    slug: 'mochi-v5',
    name: 'Mochi v5',
    description: 'The ultimate tool for WiFi penetration testing and development, packed in a sleek, portable form factor.',
    price: 1200,
    image: 'https://picsum.photos/seed/mochi/600/400',
    categoryIds: ['1', '2'],
    specs: { 'MCU': 'ESP32-S3', 'Connectivity': 'Wi-Fi, Bluetooth 5.0' },
    useCases: ['Wi-Fi Deauthentication', 'Packet sniffing', 'Evil Twin attacks'],
    featured: true,
    productType: 'build_to_order'
  },
  {
    id: '2',
    slug: 'pico-deck',
    name: 'Pico Deck',
    description: 'A versatile macro-pad powered by the Raspberry Pi Pico, perfect for custom shortcuts and commands.',
    price: 650,
    image: 'https://picsum.photos/seed/picodeck/600/400',
    categoryIds: ['3', '5'],
    specs: { 'MCU': 'RP2040', 'Keys': '6 programmable mechanical keys' },
    useCases: ['Custom macros for coding', 'Streaming controls', 'Gaming shortcuts'],
    featured: true,
    productType: 'ready'
  },
  {
      id: '3',
      slug: 'esp32-s3-dev-board',
      name: 'ESP32-S3 Dev Board',
      description: 'A powerful and feature-rich development board based on the ESP32-S3.',
      price: 450,
      image: 'https://picsum.photos/seed/esp32/600/400',
      categoryIds: ['2'],
      specs: { 'MCU': 'ESP32-S3', 'Flash': '16MB', 'PSRAM': '8MB' },
      useCases: ['IoT projects', 'Machine learning at the edge', 'Complex robotics'],
      featured: true,
      productType: 'ready'
  },
  {
      id: '4',
      slug: 'smart-display-hub',
      name: 'Smart Display Hub',
      description: 'A 4-inch touch display with an ESP32 for building custom smart home dashboards.',
      price: 950,
      image: 'https://picsum.photos/seed/display/600/400',
      categoryIds: ['4'],
      specs: { 'Display': '4" IPS Touchscreen', 'Resolution': '480x320' },
      useCases: ['Home Assistant dashboard', 'Weather station', 'Custom user interfaces'],
      featured: true,
      productType: 'build_to_order'
  },
  {
    id: '5',
    slug: 'simple-led-kit',
    name: 'Simple LED Kit',
    description: 'A beginner-friendly kit to get started with LEDs and basic circuits.',
    price: 150,
    image: 'https://picsum.photos/seed/ledkit/600/400',
    categoryIds: ['5'],
    specs: { 'Components': '5x LEDs, 5x Resistors, 1x Breadboard' },
    useCases: ['Learning electronics', 'Blinking an LED', 'Simple projects'],
    featured: false,
    productType: 'ready'
  }
];

const mockUsers = [
  {
    id: 'super-admin-user-id',
    name: 'Super Admin',
    email: 'super_admin@example.com',
    phoneNumber: '0123456789',
    wishlist: [],
    role: 'super_admin',
  },
  {
    id: 'test-user-1',
    name: 'Test User',
    email: 'test@example.com',
    phoneNumber: '0111222333',
    wishlist: ['1', '3'],
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
    id: 'ord_12345',
    userId: 'test-user-1',
    items: [
        {
            id: '1',
            productId: '1',
            name: 'Mochi v5',
            slug: 'mochi-v5',
            image: 'https://picsum.photos/seed/mochi/600/400',
            quantity: 1,
            price: 1200,
            configuration: { 'Case': 'Black' }
        }
    ],
    totalPrice: 1200,
    status: 'Confirmed',
    shippingAddress: {
        fullName: 'Test User',
        phoneNumber: '0111222333',
        address: '123 Test Street',
        city: 'Cairo',
    },
    paymentMethod: {
        id: 'pm_1',
        name: 'MockPay',
    },
    transactionId: 'txn_mock_123',
    createdAt: {
        seconds: Math.floor(new Date().getTime() / 1000) - (86400 * 2), // 2 days ago
        nanoseconds: 0
    },
    user: {
        id: 'test-user-1',
        name: 'Test User',
        email: 'test@example.com',
        phoneNumber: '0111222333',
    }
  }
];

const mockQuotes = [
    {
        id: 'quote_abcde',
        userId: 'test-user-1',
        items: [
            {
                id: '2',
                productId: '2',
                name: 'Pico Deck',
                slug: 'pico-deck',
                image: 'https://picsum.photos/seed/picodeck/600/400',
                quantity: 1,
                price: 650,
                configuration: { 'Switches': 'Blue Switches', 'Keycaps': 'Custom' }
            }
        ],
        status: 'Pending Review',
        createdAt: {
            seconds: Math.floor(new Date().getTime() / 1000) - (86400 * 1), // 1 day ago
            nanoseconds: 0
        },
        user: {
            id: 'test-user-1',
            name: 'Test User',
            email: 'test@example.com',
            phoneNumber: '0111222333',
        }
    }
];

// Helper function to create a standardized response
function createMockResponse(data: any) {
  return NextResponse.json({
    success: true,
    data,
    error: null,
  });
}

// Main handler for all API requests
async function handler(request: Request) {
  const { pathname, searchParams } = new URL(request.url);
  console.log(`[MOCK API] Received request for: ${request.method} ${pathname}`);
  
  if (request.method === 'POST' && pathname.startsWith('/api/auth/')) {
    // For any auth POST, just return the mock admin user to simulate a successful login/signup
    return createMockResponse(mockAuthenticatedUser);
  }

  if (pathname.startsWith('/api/auth/me')) {
      return createMockResponse(mockAuthenticatedUser);
  }

  if (pathname.startsWith('/api/users')) {
    const userId = pathname.split('/')[3];
    if (userId) {
        return createMockResponse(mockUsers.find(u => u.id === userId));
    }
    return createMockResponse(mockUsers);
  }

  if (pathname.startsWith('/api/orders')) {
    const userId = pathname.split('/user/')[1];
    if (userId) {
        return createMockResponse(mockOrders.filter(o => o.userId === userId));
    }
    return createMockResponse(mockOrders);
  }

  if (pathname.startsWith('/api/quotes')) {
    return createMockResponse(mockQuotes);
  }

  // Route specific mock data
  if (pathname.startsWith('/api/categories')) {
    return createMockResponse(mockCategories);
  }
  if (pathname.startsWith('/api/products/featured')) {
    return createMockResponse(mockProducts.filter(p => p.featured));
  }
   if (pathname.startsWith('/api/products/')) {
    const slug = pathname.split('/')[3];
    const product = mockProducts.find(p => p.slug === slug);
    return createMockResponse(product || null);
  }
  if (pathname.startsWith('/api/products')) {
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

  // Fallback for any other unhandled API route to prevent crashes
  return createMockResponse([]);
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };

    