
import { NextResponse } from 'next/server';

/**
 * This is a temporary mock API catch-all route.
 * Its purpose is to prevent the application from crashing due to a "JSON Parse Error"
 * which occurs when the frontend expects a JSON response from an API endpoint but
 * receives an HTML page instead (because the backend API is not yet implemented).
 *
 * This handler intercepts all requests to `/api/*`, logs them, and returns
 * a valid, mock JSON response. For key endpoints needed for the app to be
 * minimally functional (like categories and featured products), it returns sample data.
 * For all other endpoints, it returns an empty array to prevent UI errors.
 *
 * This file should be removed and replaced with actual API route handlers
 * once the backend is implemented.
 */

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
