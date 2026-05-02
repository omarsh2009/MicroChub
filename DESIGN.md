---
version: "1.1"
brand:
  name: MicroChub
  description: A futuristic, maker-focused electronics hub with a "Cyber-Maker" aesthetic.
tokens:
  color:
    background:
      primary: "#18151B" # Deep, desaturated purple-black base
      surface: "#1f1d24" # Slightly lighter surface for cards and panels
      muted: "#27272a"   # Dark grey for dividers and secondary backgrounds
    brand:
      primary: "#7A33CC" # Vibrant tech-purple for branding and main actions
      accent: "#8CA8FF"  # Electric lavender-blue for highlights and glow effects
    text:
      high: "#f8fafc"    # Near-white for primary readability
      low: "#94a3b8"     # Muted blue-grey for subtext and hints
      inverse: "#18151B" # Dark text for use on light accents
    status:
      success: "#22c55e" # Vibrant green for in-stock and confirmed states
      error: "#ef4444"   # High-visibility red for alerts and closed status
      warning: "#eab308" # Amber for "Made on Order" or pending items
    border:
      default: "#27272a" # Subtle zinc border for structural separation
  typography:
    family:
      headline: "Space Grotesk, sans-serif" # Technical, wide-set geometric font
      body: "Inter, sans-serif"             # Clean, neutral, high-legibility font
      code: "Source Code Pro, monospace"    # Monospaced font for technical specs and IDs
    scale:
      h1: 4.5rem # 72px (Desktop)
      h2: 3rem   # 48px
      body: 1rem # 16px
      small: 0.875rem # 14px
      mono: 0.75rem   # 12px
    weight:
      bold: 700
      medium: 500
      regular: 400
  spacing:
    unit: 4px
    scale:
      xs: 4px
      sm: 8px
      md: 16px
      lg: 24px
      xl: 32px
      hero: 96px
  shape:
    radius:
      card: 8px
      control: 6px # Buttons and inputs
      badge: 9999px
  elevation:
    shadow:
      card: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
      glow: "0 10px 15px -3px rgba(122, 51, 204, 0.3)" # Primary purple glow for hovers
  motion:
    duration:
      fast: 200ms
      standard: 300ms
    easing:
      standard: "ease-out"
---

# Design Principles: The "Cyber-Maker" Aesthetic

MicroChub's design bridges the gap between a high-end electronics laboratory and a futuristic digital interface. It is designed to feel professional, precise, and inspiring for makers and engineers.

## Visual Identity & Look-and-Feel
The UI is strictly dark-mode by default. It uses a **Deep Purple Palette** that avoids pure black to maintain a sense of depth and atmospheric "tech." The primary purple (`#7A33CC`) is used as a beacon—guiding the user's eye to primary actions and branding.

- **The Glow**: Interactive elements like `ProductCard` don't just shift color on hover; they emit a subtle purple glow (`shadow.glow`), mimicking the light of a powered-on circuit board.
- **Precision Typography**: The use of `Space Grotesk` for headlines gives the site a technical, scientific feel, while `Source Code Pro` for IDs and technical specs reinforces the "Hacker/Maker" utility.
- **Angular Structure**: Layouts use clean grids and consistent 8px radii. There are no "organic" or soft rounded bubbles; every shape is intentional and geometric.

## Hierarchy & Layout
- **Global Constraints**: The app uses a strict maximum width of `1400px` for the main content to ensure readability on ultra-wide monitors.
- **Status Visibility**: Critical information, like the **Store Status**, uses the high-visibility error red (`#ef4444`) with a 🚩 emoji. This is a non-negotiable interrupt that overrides standard layout patterns to ensure user awareness.
- **Admin Clarity**: The admin panel uses a "Content-First" layout. Sidebars are fixed and dark to minimize distraction from the management tasks in the main viewport.

## State-Driven Design
The design adapts dynamically to functional logic:
1. **The "Closed" State**: When the store is closed, the UI enters a "Safe Mode." Buttons lose their vibrancy (opacity 0.5), pointer events are disabled, and labels are updated to inform the user, preventing frustration.
2. **Stock Indicators**: Stock status is color-coded strictly:
   - **Green**: "In Stock" (Utility)
   - **Amber**: "Made on Order" (Craftsmanship/Patience)
   - **Red**: "Out of Stock" (Scarcity)

## Components Design Intent
- **ProductCards**: Designed to showcase the "Machine" aesthetic. Large 16:9 imagery is paired with technical badges.
- **Tables**: Tables are treated as data grids. They prioritize density and technical legibility over white space, using monospaced fonts for prices and transaction IDs.
- **Modals**: Dialogs are centered and use a semi-transparent black overlay to focus the user purely on the task at hand (like configuring a quote).