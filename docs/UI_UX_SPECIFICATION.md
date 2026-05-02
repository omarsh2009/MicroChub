# MicroChub UI/UX Specification

This document provides a detailed breakdown of the MicroChub design system, layouts, and interaction patterns for design-to-code replication.

---

## 1. GLOBAL DESIGN SYSTEM

### Colors (Dark Mode Focus)
- **Primary**: `#7A33CC` (Vibrant purple-blue for buttons, links, and branding)
- **Background**: `#18151B` (Very dark, desaturated base)
- **Card/Surface**: `#1f1d24` (Desaturated purple-black for cards and panels)
- **Accent**: `#8CA8FF` (Electric blue for active states and glow effects)
- **Foreground (Text)**: `#f8fafc` (Near-white)
- **Muted Foreground**: `#94a3b8` (Gray-blue for subtitles and hints)
- **Borders**: `#27272a` (ShadCN zinc-800 equivalent)
- **Success (Stock)**: `#22c55e` (Green)
- **Warning (Made on Order)**: `#eab308` (Yellow/Gold)
- **Destructive (Error/Out of Stock)**: `#ef4444` (Red)

### Typography
- **Headline Font**: `'Space Grotesk'`, sans-serif (Computerized/Scientific feel)
- **Body Font**: `'Inter'`, sans-serif (Modern/Neutral)
- **Code/Table Font**: `'Source Code Pro'`, monospace (Technical data)
- **Scale**:
  - **H1**: 4xl (mobile) to 7xl (desktop), font-bold, tracking-tighter
  - **H2**: 3xl to 5xl, font-bold
  - **Body**: 16px (1rem), regular
  - **Small/Label**: 14px (0.875rem)
  - **Monospace**: 12px (0.75rem)

### Spacing & Borders
- **Unit**: 4px (Tailwind base)
- **Radius**: `lg` (8px) for cards, `md` (6px) for buttons/inputs
- **Shadows**:
  - `shadow-sm`: Standard elevation
  - `shadow-lg`: Modals and dropdowns
  - `shadow-primary/20`: Hover glow on product cards

---

## 2. LAYOUT STRUCTURE

### Global Layout
- **Header**:
  - Height: 64px (h-16)
  - Behavior: Sticky with background-blur (`bg-background/95 backdrop-blur`)
  - Desktop: Logo (Left), Nav Links (Center-ish), Action Icons (Right: Wishlist, Cart, Profile)
  - Mobile: Burger Menu (Left), Logo (Center), Icons (Right)
- **Banner (Store Status)**:
  - Height: ~36px
  - Color: `#ef4444` (Destructive bg), White text
  - Content: "🚩 Store is temporarily closed. Ordering is currently unavailable."
- **Footer**:
  - Grid: 4 columns on desktop, 1 on mobile
  - Background: `#1f1d24` (Card color)

### Admin Layout
- **Sidebar**:
  - Desktop: Fixed width `280px`, full height
  - Mobile: Slide-out `Sheet` (~300px max), fixed width, overlays content
  - Padding: `p-4`
- **Main Area**: Responsive flex/grid container, `p-4` to `p-6`

---

## 3. PAGES SPECIFICATION

### Home Page (`/`)
- **Hero**: Full width, centered text, grid background pattern (`radial-gradient`)
- **Categories**: Grid (2 cols mobile, 4 desktop), hover-lift cards
- **Featured Gear**: Grid of `ProductCard` components
- **Custom Section**: 2-column layout (Text left, Image right), list items with Lucide icons

### Products List (`/products`)
- **Hero Banner**: Reduced height (py-24), badge indicator for category
- **Product Grid**: Responsive (1 col mobile -> 4 cols desktop)
- **Empty State**: Centered text "No Products Found"

### Product Details (`/products/[slug]`)
- **Layout**: 2-column (Image Gallery left, Info right)
- **Price Block**: 4xl bold price, optional line-through original price
- **Customization Section**: Stacked cards with RadioGroups or Checkboxes
- **Quantity Selector**: Inline `- [ 1 ] +` controls
- **Actions**: Vertical stack on mobile, horizontal on desktop

### Cart & Checkout
- **Cart**: Large centered icon when empty
- **Checkout**: 2-column layout (Forms left, Summary card sticky right)
- **Summary**: `Separator` dividers, bold total, coupon input field

### Contact Page (`/contact`)
- **Mode Toggle**: Switches between "Online Platform" and "Physical Store"
- **Grid**: Contact Form (Card) and Info Details (Text blocks + Icons)
- **Map**: Embedded Google Maps iframe with `aspect-video`

---

## 4. COMPONENT BREAKDOWN

### Product Card
- **Structure**: Image (top), Badge (top-right overlay), Content (Body), Actions (Footer)
- **Hover**: 105% image scale, shadow-glow, -4px Y-translation

### Data Table (Admin)
- **Behavior**: Horizontal scrolling wrapper (`overflow-x-auto`)
- **Cells**: Truncated long text, mono font for IDs
- **Actions**: `MoreHorizontal` icon triggers `DropdownMenu`

### Admin Forms
- **Responsive**: Stacks to 1 column on mobile, 2 columns on desktop
- **Input Groups**: `FormItem` with Label, Control, and `FormMessage` (Error)

---

## 5. STATE-DRIVEN UI LOGIC

- **`store.isOpen`**:
  - `false`: Buttons (Add to Cart, Request Quote) are disabled and text changed to "Store is temporarily closed"
  - Header: Red banner appears
- **Stock Logic**:
  - `isInStock = false`: Badge "Made on Order", Button "Add to Cart" enabled
  - `isInStock = true, stockQuantity = 0`: Badge "Out of Stock" (Red), Button disabled
- **User Role**:
  - `admin/super_admin`: "Admin Panel" link appears in user dropdown
- **Online vs Physical Store**:
  - Changes "Location" to "Pickup Instructions" and "Shipping Company" in UI

---

## 6. INTERACTIONS & EDGE STATES

- **Hover**: Buttons shift brightness; links underlined
- **Transitions**: Accordions use `animate-accordion-down/up` (0.2s)
- **Modals**: Dialogs fade in and scale from center (`zoom-in-95`)
- **Empty States**: Consistent centered cards with large Lucide icons and "Continue" buttons
- **Navigation**: Sidebar closes automatically on link click via state management
