# MICROCHUB STRICT DESIGN BLUEPRINT

## A) DESIGN TOKENS
### Colors (HEX)
- `primary`: #7A33CC
- `background`: #18151B
- `surface`: #1f1d24
- `accent`: #8CA8FF
- `text-high`: #f8fafc
- `text-low`: #94a3b8
- `border`: #27272a
- `status-success`: #22c55e
- `status-warning`: #eab308
- `status-error`: #ef4444

### Typography
- `font-headline`: 'Space Grotesk', sans-serif
- `font-body`: 'Inter', sans-serif
- `font-code`: 'Source Code Pro', monospace
- `h1-desktop`: 72px / 1.1 LH / -0.05 tracking
- `h1-mobile`: 36px / 1.2 LH
- `body-standard`: 16px / 1.5 LH
- `label-small`: 14px / 1.2 LH / uppercase-tracking
- `mono-id`: 12px / 1.0 LH

### Spacing Scale (4px Base)
- `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`

### Geometry
- `radius-card`: 8px
- `radius-control`: 6px
- `border-width`: 1px

---

## B) LAYOUT BLUEPRINTS
### Global Header
- `Height`: 64px
- `Alignment`: Left (Logo), Center-Right (Nav), Right (Icons)
- `Behavior`: Sticky, z-index 50, backdrop-filter: blur(8px)

### Main Container
- `Max-Width`: 1400px
- `Gutter`: 16px (mobile), 32px (desktop)

### Admin Sidebar
- `Width`: 280px (fixed)
- `Mobile`: overlay Sheet (left)
- `Internal-Spacing`: 16px gap between items

---

## C) COMPONENT DEFINITIONS
### Product Card
- `Hierarchy`: Container > ImageBox > BadgeStack > ContentBox > FooterActions
- `Spacing`: 16px internal padding
- `Transition`: 300ms ease (shadow, transform)
- `Variants`: 
  - `Default`: border-color #27272a
  - `Hover`: border-color #7A33CC, shadow #7A33CC (20% opacity)

### Admin Data Table
- `Structure`: div(overflow-x-auto) > table > (thead > tr > th) + (tbody > tr > td)
- `Padding`: 16px cell padding
- `Font`: Mono for IDs and Prices

---

## D) RESPONSIVE RULES
### Breakpoints
- `Mobile`: < 768px
- `Tablet`: 768px - 1023px
- `Desktop`: >= 1024px

### Grid Mapping
- `Products`: 1-col (mobile), 2-col (tablet), 4-col (desktop)
- `Categories`: 2-col (mobile), 4-col (desktop)
- `Checkout`: 1-col (stacked mobile), 2-col (70/30 desktop)

---

## E) INTERACTION MAPPING
- `Trigger: Hover(Card)` -> `Result: TranslateY(-4px), ScaleImage(1.05)`
- `Trigger: Click(Hamburger)` -> `Result: OpenDrawer(280px)`
- `Trigger: Scroll` -> `Result: HeaderBlurOpacity(95%)`

---

## F) STATE CONDITIONS
### Store Status Logic
- `RULE`: IF `store.isOpen == false`
  - `Banner`: Display #ef4444 fixed top
  - `Buttons`: Set `pointer-events: none`, `opacity: 0.5`, Label "Store Closed"

### Stock Status Logic
- `RULE`: IF `isInStock == true` AND `quantity == 0`
  - `StatusBadge`: #ef4444 (Out of Stock)
  - `CartButton`: Disabled
- `RULE`: IF `isInStock == false`
  - `StatusBadge`: #eab308 (Made on Order)
  - `CartButton`: Enabled

### Discount Logic
- `RULE`: IF `discountPrice` EXISTS
  - `MainPrice`: Large Bold #f8fafc
  - `OldPrice`: Strikethrough #94a3b8 (adjacent)
