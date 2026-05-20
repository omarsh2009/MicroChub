# MicroChub: Project Documentation & Design System

## 1. Website Description
MicroChub is a futuristic "Cyber-Maker" electronics hub designed for engineers, students, and hobbyists in Egypt. It serves a dual purpose: a high-performance retail store for components/kits and a professional portal for custom hardware engineering services (PCB design, firmware development, and bespoke fabrication).

---

## 2. Page Directory & Functionality

### Public Pages
- **Home (`/`)**: 
  - *Content*: Hero section with radial grid glow, dynamic category grid, featured product showcase, and service highlights.
  - *Function*: Captures interest and directs users to the store or service requests.
- **Products Catalog (`/products`)**:
  - *Content*: Full inventory with category filtering and real-time search.
  - *Function*: Central shopping hub.
- **Product Details (`/products/[slug]`)**:
  - *Content*: Technical specs table, use-case list, and a customization engine.
  - *Function*: Allows users to configure products (Radio/Checkbox options) and handles "Add to Cart" vs. "Request Quote" logic.
- **Custom Services (`/custom-services`)**:
  - *Content*: Detailed project submission form with file upload capability.
  - *Function*: Lead generation for non-standard engineering projects.
- **Cart (`/cart`)**:
  - *Content*: Itemized list of products, configurations, and quantity controls.
  - *Function*: Final review before commitment.
- **Checkout (`/checkout`)**:
  - *Content*: Dynamic delivery selection (Shipping/Pickup), restricted item legal upload, and payment reference input.
  - *Function*: Securely captures fulfillment and payment data.
- **User Dashboard (`/orders`, `/quotes`, `/wishlist`)**:
  - *Content*: Personalized history of past transactions and saved items.
  - *Function*: Post-purchase engagement and project tracking.

### Admin Dashboard (`/admin/*`)
- **Product Management**: CRUD operations for the catalog, including discount toggles and "Restricted" status.
- **Order/Quote Management**: Workflow tools to move orders from "Pending" to "Completed" and respond to user quotes with specific pricing.
- **Store Settings**: Control over "Store Mode" (Online vs. Physical), shipping prices, and contact details.
- **Legal Management**: Interface to manage site policies and upload the required PDF template for restricted items.

---

## 3. Design System (The Cyber-Maker Aesthetic)

### Color Palette
- **Deep Space Base**: `#18151B` (Background)
- **Surface Elevation**: `#1F1D24` (Cards and Panels)
- **Vibrant Primary**: `#7A33CC` (Buttons, Logo, Primary Brand Identity)
- **Electric Accent**: `#8CA8FF` (Interactive glows, Active states)
- **Functional Status**: Green (`#22C55E`) for stock; Red (`#EF4444`) for store closures/restricted warnings.

### Typography
- **Headlines**: `'Space Grotesk'` — A technical, wide-set sans-serif that feels like a futuristic laboratory interface.
- **Body Text**: `'Inter'` — Chosen for high legibility in long descriptions and specs.
- **Technical/Mono**: `'Source Code Pro'` — Used for serial numbers, prices, and technical attributes to reinforce the "coder/hacker" utility.

### Key UI Elements
- **Shadow Glows**: Interactive cards use a subtle purple shadow-glow (`shadow-primary/20`) on hover to simulate a powered-on circuit board.
- **Angular Geometry**: Consistent 8px border-radius across all components, avoiding "soft" organic shapes in favor of precise engineering lines.
- **State-Driven Indicators**: Elements automatically dim (opacity 50%) and disable interactions if the global `storeStatus` is set to "closed."

---

## 4. Key Business Logic
- **Single Category System**: Each product is mapped to one primary category for clean navigation and management.
- **Legal Workflow**: Products marked as "Restricted" trigger a mandatory document download/upload cycle at checkout.
- **Dynamic Fulfillment**: Shipping costs are only applied if "Shipping" is selected, and physical location data is only shown if the store is in "Physical Mode."
- **Persistence**: All user and admin data (products, orders, quotes) is stored in the browser's `localStorage`, allowing for a fully functional, high-fidelity frontend prototype.
