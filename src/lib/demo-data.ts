import type { Product, Category, UserWithId, PaymentMethod, OrderWithUserData, QuoteRequestWithUserData, Coupon, SocialLink, PolicySection, FaqItem, ContactInfo } from './types';

export const mockCategories: Category[] = [
    { id: 'cat-1', name: 'DIY Kits', slug: 'diy-kits' },
    { id: 'cat-2', name: 'Arduino', slug: 'arduino' },
    { id: 'cat-3', name: 'Sensors', slug: 'sensors' },
    { id: 'cat-6', name: 'ESP Devices', slug: 'esp-devices' },
];

export const mockProducts: Product[] = [
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
    inStock: true,
    stockQuantity: 50,
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
    inStock: false,
    stockQuantity: 0,
    isRestricted: true,
    customizationGroups: [
        {
            name: 'Spindle Upgrade',
            type: 'single',
            required: false,
            options: [
                { name: 'Standard 775 Spindle', priceAdjustment: 0 },
                { name: '500W Brushless Spindle', priceAdjustment: 1500 },
            ]
        },
        {
            name: 'Laser Module',
            type: 'single',
            required: false,
            options: [
                { name: 'No Laser', priceAdjustment: 0 },
                { name: '5.5W Laser Engraver', priceAdjustment: 2000 },
                { name: '15W Laser Engraver', priceAdjustment: 0, requestQuote: true },
            ]
        }
    ]
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
    inStock: true,
    stockQuantity: 120,
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
    inStock: true,
    stockQuantity: 0,
    featured: true,
    customizationGroups: [
        {
            name: 'Header Options',
            type: 'single',
            required: true,
            options: [
                { name: 'Headers Not Included', priceAdjustment: 0 },
                { name: 'Headers Included (Unsoldered)', priceAdjustment: 20 },
                { name: 'Headers Soldered', priceAdjustment: 50 },
            ]
        }
    ]
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
    inStock: true,
    stockQuantity: 30,
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
    inStock: true,
    stockQuantity: 500,
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
    inStock: false,
    stockQuantity: 0,
    customizationGroups: [
        {
            name: 'Case Color',
            type: 'single',
            required: true,
            options: [
                { name: 'Black', priceAdjustment: 0 },
                { name: 'Clear', priceAdjustment: 0 },
                { name: 'Orange', priceAdjustment: 50 },
            ]
        },
        {
            name: 'Strap Material',
            type: 'single',
            required: true,
            options: [
                { name: 'Silicone Strap', priceAdjustment: 0 },
                { name: 'Leather Strap', priceAdjustment: 150 },
            ]
        },
        {
            name: 'Add-ons',
            type: 'multi',
            required: false,
            options: [
                { name: 'Extra Battery', priceAdjustment: 100 },
                { name: 'Wireless Charging Module', priceAdjustment: 250 },
            ]
        }
    ]
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
    inStock: true,
    stockQuantity: 80,
  },
];

export const mockUsers: UserWithId[] = [
  { id: 'user-super-admin', name: 'Super Admin', email: 'super_admin@example.com', phoneNumber: '01000000001', role: 'super_admin', wishlist: [] },
  { id: 'user-admin', name: 'Admin User', email: 'admin@example.com', phoneNumber: '01000000002', role: 'admin', wishlist: [] },
  { id: 'user-regular', name: 'Ahmed Hossam', email: 'ahmed@example.com', phoneNumber: '01000000003', role: 'user', wishlist: ['prod-2', 'prod-7'] },
  { id: 'user-new', name: 'Fatima Al-Sayed', email: 'fatima@example.com', phoneNumber: '01122334455', role: 'user', wishlist: [] },
];

export const mockPaymentMethods: PaymentMethod[] = [
    { id: 'pm-1', name: 'Cash on Delivery', type: 'username', value: 'N/A', instructions: 'Pay in cash when your order is delivered.', enabled: true },
    { id: 'pm-2', name: 'Credit Card', type: 'paymentLink', value: 'https://pay.example.com', instructions: 'Pay via our secure payment link.', enabled: false },
    { id: 'pm-3', name: 'Vodafone Cash', type: 'phoneNumber', value: '01012345678', instructions: 'Send the total amount to this number and enter the transaction ID.', enabled: true },
];

const mockRawOrders: Omit<OrderWithUserData, 'user'>[] = [
  {
    id: 'ord_1', userId: 'user-regular', items: [{ id: 'prod-1-cart', productId: 'prod-1', name: 'Arduino Uno Ultimate Starter Kit', slug:'arduino-uno-ultimate-starter-kit', image: 'https://images.unsplash.com/photo-1559386484-97dfc0e150a9?q=80&w=600&auto=format&fit=crop', quantity: 1, price: 1250, configuration: {} }],
    totalPrice: 1250, status: 'Completed/Delivered', shippingAddress: { fullName: 'Ahmed Hossam', phoneNumber: '01000000003', address: '123 Abc Street', city: 'Cairo' }, paymentMethod: { id: 'pm-3', name: 'Vodafone Cash' }, transactionId: 'VF12345',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 7, nanoseconds: 0 },
  },
  {
    id: 'ord_2', userId: 'user-regular', items: [{ id: 'prod-2-cart', productId: 'prod-2', name: 'Desktop CNC 3018 Pro Kit', slug: 'desktop-cnc-3018-pro', image: 'https://images.unsplash.com/photo-1620352538982-255a2a9b3f36?q=80&w=600&auto=format&fit=crop', quantity: 1, price: 8500, configuration: {} }],
    totalPrice: 8500, status: 'In Production', shippingAddress: { fullName: 'Ahmed Hossam', phoneNumber: '01000000003', address: '123 Abc Street', city: 'Cairo' }, paymentMethod: { id: 'pm-3', name: 'Vodafone Cash' }, transactionId: 'VF67890',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 3, nanoseconds: 0 },
    requiresLegalApproval: true,
    legalAgreementApproved: false,
    legalAgreementUrl: 'https://example.com/signed-agreement.pdf',
  },
  {
    id: 'ord_3', userId: 'user-admin', items: [{ id: 'prod-4-cart', productId: 'prod-4', name: 'ESP32-S3 Development Board', slug: 'esp32-s3-dev-board', image: 'https://images.unsplash.com/photo-1629051871926-9d3023d6bdf1?q=80&w=600&auto=format&fit=crop', quantity: 5, price: 650, configuration: {} }],
    totalPrice: 3250, status: 'Pending Verification', shippingAddress: { fullName: 'Admin User', phoneNumber: '01000000002', address: '456 Admin Ave', city: 'Giza' }, paymentMethod: { id: 'pm-1', name: 'Cash on Delivery' }, transactionId: 'N/A',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400, nanoseconds: 0 },
  },
   {
    id: 'ord_4', userId: 'user-regular', items: [
        { id: 'prod-6-cart', productId: 'prod-6', name: 'Ultrasonic Distance Sensor (HC-SR04)', slug:'ultrasonic-distance-sensor-hc-sr04', image: 'https://images.unsplash.com/photo-1615906655572-4d2de3431f2b?q=80&w=600&auto=format&fit=crop', quantity: 10, price: 75, configuration: {} },
        { id: 'prod-8-cart', productId: 'prod-8', name: 'BME280 Environmental Sensor Module', slug:'bme280-environmental-sensor-module', image: 'https://images.unsplash.com/photo-1580371694726-a07cb18815f3?q=80&w=600&auto=format&fit=crop', quantity: 2, price: 350, configuration: {} },
    ],
    totalPrice: 1450, status: 'Completed/Delivered', shippingAddress: { fullName: 'Ahmed Hossam', phoneNumber: '01000000003', address: '123 Abc Street', city: 'Cairo' }, paymentMethod: { id: 'pm-3', name: 'Vodafone Cash' }, transactionId: 'VF99887',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 10, nanoseconds: 0 },
  },
];

export const mockOrders: OrderWithUserData[] = mockRawOrders.map(order => {
    const user = mockUsers.find(u => u.id === order.userId);
    if (!user) throw new Error(`Mock data inconsistency: user ${order.userId} not found for order ${order.id}`);
    return {
      ...order,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      }
    };
});

export const mockCoupons: Coupon[] = [
    { id: 'coup-1', code: 'MAKERSPACE', type: 'percentage', value: 10, maxDiscountAmount: 50, maxUses: 100, usedCount: 23, expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0] },
    { id: 'coup-2', code: 'WELCOME100', type: 'fixed', value: 100, maxUses: 500, usedCount: 150 },
    { id: 'coup-3', code: 'EXPIRED', type: 'fixed', value: 50, maxUses: 100, usedCount: 10, expiryDate: '2022-01-01' },
    { id: 'coup-4', code: 'BIGSAVE', type: 'fixed', value: 200, maxDiscountPercentage: 25, maxUses: 20, usedCount: 5 },
];

export const mockSocialLinks: SocialLink[] = [
    { id: 'soc-fb', platform: 'Facebook', url: 'https://facebook.com/microchub', enabled: true },
    { id: 'soc-gh', platform: 'GitHub', url: 'https://github.com/microchub', enabled: true },
    { id: 'soc-in', platform: 'Instagram', url: 'https://instagram.com/microchub', enabled: true },
];

const mockRawQuotes: Omit<QuoteRequestWithUserData, 'user'>[] = [
  {
    id: 'quote_1', userId: 'user-regular', items: [{ id: 'prod-2-cart', productId: 'prod-2', name: 'Desktop CNC 3018 Pro Kit', slug: 'desktop-cnc-3018-pro', image: 'https://images.unsplash.com/photo-1620352538982-255a2a9b3f36?q=80&w=600&auto=format&fit=crop', quantity: 1, price: 8500, configuration: { "Material": "Black Acrylic instead of Clear" } }],
    status: 'offered', userNotes: 'Is it possible to get this kit with black acrylic parts instead of the standard clear ones?', quotedPrice: 9000, adminNotes: 'Yes, we can cut it from black acrylic. The material cost is slightly higher.', createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 5, nanoseconds: 0 },
  },
  {
    id: 'quote_2', userId: 'user-admin', items: [{ id: 'prod-7-cart', productId: 'prod-7', name: 'DIY Smart Watch Kit', slug: 'diy-smart-watch-kit', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600&auto=format&fit=crop', quantity: 10, price: 1800, configuration: { "Case Color": "Red" } }],
    status: 'pending', userNotes: 'Need a bulk order of 10 red smart watch kits for a workshop.', createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 2, nanoseconds: 0 },
  },
  {
    id: 'quote_3', userId: 'user-regular', items: [{ id: 'prod-7-cart-2', productId: 'prod-7', name: 'DIY Smart Watch Kit', slug: 'diy-smart-watch-kit', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600&auto=format&fit=crop', quantity: 1, price: 1800, configuration: { "MCU": "ESP32-S3" } }],
    status: 'rejected', userNotes: 'Can you swap the ESP32 for an ESP32-S3? Need it for the AI features.', quotedPrice: 2200, adminNotes: 'We can do this, but it requires a custom PCB layout. The new price reflects this change.', createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 12, nanoseconds: 0 },
  },
  {
    id: 'quote_4', userId: 'user-regular', items: [{ id: 'prod-1-cart-quote', productId: 'prod-1', name: 'Arduino Uno Ultimate Starter Kit', slug: 'arduino-uno-ultimate-starter-kit', image: 'https://images.unsplash.com/photo-1559386484-97dfc0e150a9?q=80&w=600&auto=format&fit=crop', quantity: 1, price: 1250, configuration: { "Board": "Arduino Nano instead of Uno" } }],
    status: 'accepted', userNotes: 'Can I get a Nano instead of an Uno in this kit?', quotedPrice: 1250, adminNotes: 'Sure, we can swap that for you at no extra cost.', createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 15, nanoseconds: 0 },
  },
];

export const mockQuotes: QuoteRequestWithUserData[] = mockRawQuotes.map(quote => {
    const user = mockUsers.find(u => u.id === quote.userId);
    if (!user) throw new Error(`Mock data inconsistency: user not found for quote`);
    return {
      ...quote,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      }
    };
});

export const mockPolicies: PolicySection[] = [
    {
        id: 'policy-1',
        title: 'Shipping Policy',
        content: 'We ship to all governorates in Egypt. Shipping inside Cairo & Giza takes 2-3 business days. Shipping to other governorates takes 3-5 business days. Shipping fees are calculated at checkout.',
        isVisible: true,
    },
    {
        id: 'policy-2',
        title: 'Return Policy',
        content: 'You can return any product within 14 days of purchase, provided it is in its original condition and packaging. Custom-made items and build-to-order kits are non-refundable once production has started.',
        isVisible: true,
    },
    {
        id: 'policy-3',
        title: 'Restricted Items Agreement',
        content: 'For certain items, such as CNC machines or high-powered lasers, you will be required to download, sign, and upload a legal agreement during checkout. This is to ensure that these items are used responsibly and safely. We reserve the right to cancel any order that does not comply with this policy.',
        isVisible: false,
    }
];


export const mockFaqs: FaqItem[] = [
    {
        id: 'faq-1',
        question: 'What payment methods do you accept?',
        answer: 'We currently accept Cash on Delivery and payments via Vodafone Cash. For custom orders, we may arrange for a bank transfer.',
        isPublished: true,
    },
    {
        id: 'faq-2',
        question: 'What is the estimated production time for build-to-order items?',
        answer: 'Production time for build-to-order items is typically between 7 to 14 business days, depending on the complexity of the item and current order volume. You can see the status of your order on the "My Orders" page.',
        isPublished: true,
    },
    {
        id: 'faq-3',
        question: 'Do you ship outside of Cairo?',
        answer: 'Yes, we ship to all governorates in Egypt. Shipping costs and times will vary depending on your location.',
        isPublished: false,
    }
];

export const mockContactInfo: ContactInfo = {
    location: '123 Maker Street, Downtown, Cairo',
    email: 'hello@microchub.com',
    phone: '+20 123 456 7890',
    workingHours: '9am - 5pm',
    workingDays: 'Sunday - Thursday',
    googleMapsLink: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.882823384268!2d31.23340007555198!3d30.04015097492751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840c663335807%3A0x255b0cf83afb4a65!2sTahrir%20Square!5e0!3m2!1sen!2seg!4v1717075253896!5m2!1sen!2seg',
    storeStatus: 'open',
    storeMode: 'online',
    pickupInstructions: 'Pickup is available from our partner location in Nasr City. We will contact you with the full address and arrange a time after you place your order.',
    shippingCompany: 'Aramex (Demo)',
};
