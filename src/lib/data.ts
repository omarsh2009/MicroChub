import { type Category, type Product, type UserWithId, type OrderWithUserData, type QuoteRequestWithUserData, type PaymentMethod } from "./types";

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const placeholderImages: ImagePlaceholder[] = [
    {
      "id": "mochi-v4-main",
      "description": "A top-down view of the Mochi v4 device on a dark background.",
      "imageUrl": "https://picsum.photos/seed/mochi4main/600/400",
      "imageHint": "circuit board gadget"
    },
    {
      "id": "mochi-v4-side",
      "description": "A side-angle view of the Mochi v4 showing its ports.",
      "imageUrl": "https://picsum.photos/seed/mochi4side/600/400",
      "imageHint": "electronic device"
    },
    {
      "id": "jammer-pro-main",
      "description": "The ESP Jammer Pro with its antenna, looking sleek.",
      "imageUrl": "https://picsum.photos/seed/jammerpro/600/400",
      "imageHint": "hacker gadget"
    },
    {
      "id": "cnc-kit-main",
      "description": "The fully assembled Mini CNC Kit on a workbench.",
      "imageUrl": "https://picsum.photos/seed/cnckit/600/400",
      "imageHint": "cnc machine"
    },
    {
      "id": "spotify-display-main",
      "description": "The Spotify Display showing album art on a desk.",
      "imageUrl": "https://picsum.photos/seed/spotifydisplay/600/400",
      "imageHint": "desk gadget"
    },
    {
      "id": "mochi-case-main",
      "description": "A clear acrylic case for the Mochi device.",
      "imageUrl": "https://picsum.photos/seed/mochicase/600/400",
      "imageHint": "clear case"
    },
    {
      "id": "stream-deck-main",
      "description": "A DIY stream deck with glowing keys.",
      "imageUrl": "https://picsum.photos/seed/streamdeck/600/400",
      "imageHint": "keyboard custom"
    }
  ];


export const placeholderImagesById = placeholderImages.reduce(
  (acc, img) => {
    acc[img.id] = img;
    return acc;
  },
  {} as Record<string, ImagePlaceholder>
);

export const categories: Category[] = [
  {
    id: "mochi",
    name: "Mochi & Co.",
    description: "Customizable mochis, desktop accessories, and cases.",
  },
  {
    id: "esp",
    name: "ESP Devices",
    description: "Hacking and testing tools based on ESP microcontrollers.",
  },
  {
    id: "arduino",
    name: "Arduino Projects",
    description: "DIY machines and kits powered by Arduino.",
  },
  {
    id: "displays",
    name: "Smart Displays",
    description: "Connected displays for work and play.",
  },
];

export const products: Product[] = [
  {
    id: "prod-001",
    slug: "mochi-v4",
    name: "Mochi v4",
    description:
      "A versatile, customizable hardware companion for developers and makers. Features advanced connectivity and a modular design.",
    price: 1200,
    category: "Mochi & Co.",
    images: ["mochi-v4-main", "mochi-v4-side"],
    specs: {
      MCU: "ESP32-S3",
      Connectivity: "Wi-Fi, Bluetooth 5.0",
      Power: "USB-C, LiPo Battery Support",
      Dimensions: "60mm x 40mm",
    },
    useCases: [
      "Portable development platform",
      "Custom sensor hub",
      "Desktop automation tool",
    ],
    featured: true,
    customizationGroups: [
      {
        name: "Case Color",
        type: "single",
        required: true,
        options: [
          { name: "Stealth Black", priceAdjustment: 0 },
          { name: "Arctic White", priceAdjustment: 0 },
          { name: "Cyber Purple", priceAdjustment: 50 },
        ],
      },
      {
        name: "Included Add-ons",
        type: "multi",
        required: false,
        options: [
          { name: "LiPo Battery", priceAdjustment: 250 },
          { name: "Extra USB-C Cable", priceAdjustment: 100 },
          { name: "Sticker Pack", priceAdjustment: 40 },
        ],
      },
    ],
  },
  {
    id: "prod-002",
    slug: "esp-jammer-pro",
    name: "ESP Jammer Pro",
    description:
      "An advanced toolkit for Wi-Fi network testing and security research. Comes pre-flashed with Bruce OS for maximum functionality.",
    price: 950,
    category: "ESP Devices",
    images: ["jammer-pro-main"],
    specs: {
      MCU: "ESP32",
      Antenna: "External 5dBi",
      Features: "Deauth, Beacon, Probe attacks",
      Software: "Bruce OS / Marauder",
    },
    useCases: ["Wi-Fi penetration testing", "Network analysis", "Educational tool"],
    featured: true,
    isRestricted: true,
  },
  {
    id: "prod-003",
    slug: "mini-cnc-kit",
    name: "Mini CNC Kit",
    description:
      "A complete DIY kit to build your own desktop CNC machine. Perfect for milling soft materials like wood, plastic, and PCBs.",
    price: 3500,
    category: "Arduino Projects",
    images: ["cnc-kit-main"],
    specs: {
      Controller: "Arduino UNO with GRBL Shield",
      WorkingArea: "180x100x45mm",
      Spindle: "775 Motor",
      Frame: "Aluminum and Bakelite",
    },
    useCases: ["Engraving", "PCB milling", "Small parts fabrication"],
    featured: true,
  },
  {
    id: "prod-004",
    slug: "spotify-display",
    name: "Spotify Display",
    description:
      "A sleek, smart display that shows what's currently playing on your Spotify. A perfect desk companion for music lovers.",
    price: 750,
    category: "Smart Displays",
    images: ["spotify-display-main"],
    specs: {
      MCU: "ESP8266",
      Display: "1.54 inch IPS Color Display",
      Connectivity: "Wi-Fi",
      Power: "USB-C",
    },
    useCases: ["Desktop music visualizer", "Smart home dashboard piece", "Gift for music fans"],
    featured: true,
  },
  {
    id: "prod-005",
    slug: "mochi-case-clear",
    name: "Mochi Clear Case",
    description:
      "A crystal clear, protective case for your Mochi device. Show off the hardware while keeping it safe.",
    price: 150,
    category: "Mochi & Co.",
    images: ["mochi-case-main"],
    specs: {
      Material: "Acrylic",
      Compatibility: "Mochi v3, Mochi v4",
      Type: "Snap-fit",
    },
    useCases: ["Protection", "Aesthetics"],
  },
  {
    id: "prod-006",
    slug: "arduino-stream-deck",
    name: "Arduino Stream Deck Kit",
    description:
      "Build your own customizable stream deck. Assign macros, hotkeys, and custom actions to 12 mechanical keys.",
    price: 800,
    category: "Arduino Projects",
    images: ["stream-deck-main"],
    specs: {
      Controller: "Arduino Pro Micro",
      Keys: "12x Gateron Mechanical Switches",
      Display: "Optional per-key LEDs",
      Connectivity: "USB-C",
    },
    useCases: ["Streaming", "Video editing shortcuts", "Productivity tool"],
    customizationGroups: [
       {
        name: "Assembly Type",
        type: "single",
        required: true,
        options: [
          { name: "DIY Kit", priceAdjustment: 0 },
          { name: "Fully Assembled", priceAdjustment: 200 },
        ],
      },
      {
        name: "Switch Type",
        type: "single",
        required: true,
        options: [
          { name: "Gateron Red (Linear)", priceAdjustment: 0 },
          { name: "Gateron Blue (Clicky)", priceAdjustment: 50 },
          { name: "Gateron Brown (Tactile)", priceAdjustment: 50 },
        ],
      },
      {
        name: "Keycap Style",
        type: "single",
        required: true,
        options: [
          { name: "Blank White", priceAdjustment: 0 },
          { name: "Blank Black", priceAdjustment: 0 },
          { name: "Custom Printed", priceAdjustment: 250, requestQuote: true },
        ],
      },
    ],
  },
];

export const featuredProducts = products.filter((p) => p.featured);


export const mockUsers: UserWithId[] = [
    { id: 'mock-user-123', name: 'Test User', email: 'test@example.com', phoneNumber: '01234567890', role: 'super_admin', wishlist: [] },
    { id: 'user-002', name: 'Alice', email: 'alice@example.com', phoneNumber: '0111222333', role: 'admin', wishlist: [] },
    { id: 'user-003', name: 'Bob', email: 'bob@example.com', phoneNumber: '0444555666', role: 'user', wishlist: [] },
];

export const mockPaymentMethods: PaymentMethod[] = [
    { id: 'pm-001', name: 'Instapay', type: 'username', value: '@microchub', instructions: "Please send the total amount to this Instapay username and enter the transaction ID.", enabled: true },
    { id: 'pm-002', name: 'Vodafone Cash', type: 'phoneNumber', value: '01012345678', instructions: "Please send the total amount to this Vodafone Cash number and enter the transaction ID.", enabled: true },
    { id: 'pm-003', name: 'Credit Card (Stripe)', type: 'paymentLink', value: 'https://buy.stripe.com/test_1234', instructions: "Click the link to complete payment via credit card.", enabled: false },
];

export const mockOrders: OrderWithUserData[] = [
    {
        id: 'order-001',
        userId: 'user-002',
        items: [
            { id: 'cart-001', productId: 'prod-001', name: 'Mochi v4', slug: 'mochi-v4', image: placeholderImagesById['mochi-v4-main'].imageUrl, quantity: 1, price: 1250, configuration: { 'Case Color': 'Cyber Purple' } }
        ],
        totalPrice: 1250,
        status: 'In Production',
        shippingAddress: { fullName: 'Alice', phoneNumber: '0111222333', address: '123 Main St', city: 'Cairo' },
        paymentMethod: { id: 'pm-001', name: 'Instapay' },
        transactionId: 'TXN123456',
        createdAt: { seconds: new Date('2024-05-20T10:00:00Z').getTime() / 1000, nanoseconds: 0 },
        user: { id: 'user-002', name: 'Alice', email: 'alice@example.com', phoneNumber: '0111222333' }
    },
    {
        id: 'order-002',
        userId: 'user-003',
        items: [
            { id: 'cart-002', productId: 'prod-002', name: 'ESP Jammer Pro', slug: 'esp-jammer-pro', image: placeholderImagesById['jammer-pro-main'].imageUrl, quantity: 1, price: 950, configuration: {} }
        ],
        totalPrice: 950,
        status: 'Pending Verification',
        shippingAddress: { fullName: 'Bob', phoneNumber: '0444555666', address: '456 Side St', city: 'Alexandria' },
        paymentMethod: { id: 'pm-002', name: 'Vodafone Cash' },
        transactionId: 'TXN654321',
        requiresLegalApproval: true,
        legalAgreementApproved: false,
        legalAgreementUrl: '#',
        createdAt: { seconds: new Date('2024-05-22T14:30:00Z').getTime() / 1000, nanoseconds: 0 },
        user: { id: 'user-003', name: 'Bob', email: 'bob@example.com', phoneNumber: '0444555666' }
    }
];

export const mockQuoteRequests: QuoteRequestWithUserData[] = [
    {
        id: 'quote-001',
        userId: 'user-003',
        items: [
            { id: 'cart-quote-001', productId: 'prod-006', name: 'Arduino Stream Deck Kit', slug: 'arduino-stream-deck', image: placeholderImagesById['stream-deck-main'].imageUrl, quantity: 2, price: 800, configuration: { 'Keycap Style': 'Custom Printed' } }
        ],
        userNotes: 'I want a custom logo on each keycap. The logo is attached.',
        fileUrl: '#',
        status: 'Pending Review',
        createdAt: { seconds: new Date('2024-05-21T11:00:00Z').getTime() / 1000, nanoseconds: 0 },
        user: { id: 'user-003', name: 'Bob', email: 'bob@example.com', phoneNumber: '0444555666' }
    },
     {
        id: 'quote-002',
        userId: 'user-002',
        items: [
            { id: 'cart-quote-002', productId: 'prod-001', name: 'Mochi v4', slug: 'mochi-v4', image: placeholderImagesById['mochi-v4-main'].imageUrl, quantity: 1, price: 1200, configuration: {} }
        ],
        userNotes: 'I need a special firmware with a custom boot screen.',
        status: 'Quoted',
        quotedPrice: 2000,
        adminNotes: 'Price includes 4 hours of firmware development.',
        createdAt: { seconds: new Date('2024-05-20T09:00:00Z').getTime() / 1000, nanoseconds: 0 },
        quotedAt: { seconds: new Date('2024-05-20T17:00:00Z').getTime() / 1000, nanoseconds: 0 },
        user: { id: 'user-002', name: 'Alice', email: 'alice@example.com', phoneNumber: '0111222333' }
    }
]
