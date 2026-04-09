import { type Category, type Product } from "./types";
import { PlaceHolderImages } from "./placeholder-images";
import { type ImagePlaceholder } from "./placeholder-images";

export const placeholderImagesById = PlaceHolderImages.reduce(
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
          { name: "Custom Printed", priceAdjustment: 250 },
        ],
      },
    ],
  },
];

export const featuredProducts = products.filter((p) => p.featured);
