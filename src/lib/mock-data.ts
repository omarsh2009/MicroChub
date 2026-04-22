
// A single source of truth for all mock data to ensure consistency.

export const mockCategories = [
    { id: 'cat-1', name: 'DIY Kits', slug: 'diy-kits' },
    { id: 'cat-2', name: 'Arduino', slug: 'arduino' },
    { id: 'cat-3', name: 'Sensors', slug: 'sensors' },
    { id: 'cat-6', name: 'ESP Devices', slug: 'esp-devices' },
];

export const mockProducts = [
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
    productType: 'ready',
  },
];

export const mockUsers = [
  { id: 'user-super-admin', name: 'Super Admin', email: 'super_admin@example.com', phoneNumber: '01000000001', role: 'super_admin', wishlist: [] },
  { id: 'user-admin', name: 'Admin User', email: 'admin@example.com', phoneNumber: '01000000002', role: 'admin', wishlist: [] },
  { id: 'user-regular', name: 'Ahmed Hossam', email: 'ahmed@example.com', phoneNumber: '01000000003', role: 'user', wishlist: ['prod-2', 'prod-7'] },
];

export const mockPaymentMethods = [
    { id: 'pm-1', name: 'Cash on Delivery', type: 'username', value: 'N/A', instructions: 'Pay in cash when your order is delivered.', enabled: true },
    { id: 'pm-2', name: 'Credit Card', type: 'paymentLink', value: 'https://pay.example.com', instructions: 'Pay via our secure payment link.', enabled: false },
    { id: 'pm-3', name: 'Vodafone Cash', type: 'phoneNumber', value: '01012345678', instructions: 'Send the total amount to this number and enter the transaction ID.', enabled: true },
];

export const mockOrders = [
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
