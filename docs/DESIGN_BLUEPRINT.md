# MICROCHUB FINAL EXECUTION BLUEPRINT

## A) DESIGN TOKENS (STRICT)
- `PRIMARY`: #7A33CC
- `BACKGROUND`: #18151B
- `SURFACE`: #1f1d24
- `ACCENT`: #8CA8FF
- `TEXT_HIGH`: #f8fafc
- `TEXT_LOW`: #94a3b8
- `BORDER`: #27272a
- `STATUS_SUCCESS`: #22c55e
- `STATUS_ERROR`: #ef4444
- `RADIUS_CARD`: 8px
- `RADIUS_CONTROL`: 6px
- `SPACING_BASE`: 4px
- `FONT_HEADLINE`: 'Space Grotesk'
- `FONT_BODY`: 'Inter'
- `FONT_CODE`: 'Source Code Pro'

## B) GLOBAL LAYOUT HIERARCHY
Root
 └── GlobalBanner (Height: 36px | Visible IF store.isOpen = false)
 └── Header (Height: 64px | Sticky | Z-index: 50)
      ├── Logo (Width: 24px | Height: 24px)
      ├── Nav (Gap: 24px | Hidden on Mobile)
      └── ActionIcons (Gap: 8px)
 └── Main (Flex: 1 | Max-Width: 1400px | Padding-X: 16px (Mobile) / 32px (Desktop))
 └── Footer (Padding-Y: 32px | Border-Top: 1px)

## C) PAGE TREES & DIMENSIONS

### 1. Home Page
Home
 └── HeroSection (Padding-Y: 96px)
      └── TextStack (Gap: 16px | Center Aligned)
           ├── H1 (Size: 72px Desktop / 36px Mobile)
           ├── Subtext (Size: 20px | Width: 700px)
           └── ButtonGroup (Flex | Gap: 16px)
 └── CategoriesGrid (Grid: 4-Col Desktop / 2-Col Mobile | Gap: 24px)
 └── FeaturedGear (Grid: 4-Col Desktop / 1-Col Mobile | Gap: 24px)

### 2. Product Detail Page
ProductPage
 └── SplitLayout (Grid: 2-Col Desktop / 1-Col Mobile | Gap: 48px)
      ├── ImageGallery (Width: 100% | Aspect: 1:1)
      └── InfoPanel (Flex-Col | Gap: 24px)
           ├── HeaderGroup
           │    ├── BadgeStack (Flex | Gap: 8px)
           │    └── Title (Size: 48px | Weight: 700)
           ├── PriceDisplay (Flex | Align: Baseline | Gap: 16px)
           ├── CustomizationStack (Flex-Col | Gap: 16px)
           │    └── CustomCard (Padding: 16px | Radius: 8px | Border: 1px)
           ├── QuantitySelector (Width: 140px | Flex | Align: Center)
           └── ActionButtons (Flex-Col Mobile / Flex-Row Desktop | Gap: 16px)

### 3. Admin Layout
AdminLayout
 └── Sidebar (Width: 280px | Fixed | Hidden on Mobile)
      ├── Header (Height: 64px | Border-Bottom)
      └── NavStack (Padding: 16px | Gap: 8px)
 └── ContentArea (Flex: 1 | Overflow-X: Hidden)
      ├── Header (Height: 64px | Padding-X: 24px)
      └── MainContent (Padding: 24px | Gap: 24px)

## D) COMPONENT SPECIFICATIONS

### ProductCard
- `Container`: Width: 100% | Padding: 0px | Border: 1px | Radius: 8px
- `ImageBox`: Aspect: 16:9 | Overflow: Hidden
- `ContentBox`: Padding: 16px | Gap: 8px
- `PriceArea`: Padding: 16px | Border-Top: 1px
- `Hover`: TranslateY: -4px | Shadow: 0 10px 15px -3px rgba(122, 51, 204, 0.2)

### AdminDataTable
- `Wrapper`: Width: 100% | Overflow-X: Auto
- `Table`: Width: 100% | Border-Collapse: Collapse
- `Cell`: Padding: 16px | Border-Bottom: 1px
- `Typography`: Mono for IDs and Prices (Size: 12px)

## E) INTERACTION & STATE LOGIC (STRICT)

### 1. Store Closed State
- `CONDITION`: `store.isOpen === false`
- `RESULT`:
  - GlobalBanner: Display Block (Color: #ef4444)
  - Buttons (AddToCart, Checkout, Quote):
    - Pointer-Events: None
    - Opacity: 0.5
    - Label: "Store is temporarily closed"

### 2. Stock Override State
- `CONDITION`: `product.inStock === true` AND `product.stockQuantity === 0`
- `RESULT`:
  - Badge: "Out of Stock" (Color: #ef4444)
  - Button: Disabled
- `CONDITION`: `product.inStock === false`
- `RESULT`:
  - Badge: "Made on Order" (Color: #eab308)
  - Button: Enabled

### 3. Responsive Constraints
- `TABLES`: Must NOT expand parent. Use `display: block; overflow-x: auto;`
- `FORMS`: All Inputs `width: 100%`. Group into 2-cols on Desktop, 1-col on Mobile.
- `SIDEBAR`: Mobile use `Sheet` component (Overlay). Desktop fixed at 280px.

## F) TRANSITION HOOKS
- `ACCORDION`: Expand 200ms ease-out
- `HOVER_CARD`: Scale 1.05 (Image) + Shadow 300ms
- `DRAWER`: Slide-in-from-left 300ms
- `TOAST`: Fade/Slide-in-from-bottom 200ms
