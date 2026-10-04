---
name: Culinary Intelligence System
colors:
  surface: '#effdf0'
  surface-dim: '#cfded1'
  surface-bright: '#effdf0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e9f7ea'
  surface-container: '#e3f2e5'
  surface-container-high: '#deecdf'
  surface-container-highest: '#d8e6d9'
  on-surface: '#121e16'
  on-surface-variant: '#414943'
  inverse-surface: '#27332b'
  inverse-on-surface: '#e6f4e7'
  outline: '#717972'
  outline-variant: '#c0c9c1'
  surface-tint: '#36684d'
  primary: '#00341e'
  on-primary: '#ffffff'
  primary-container: '#174b32'
  on-primary-container: '#86ba9a'
  inverse-primary: '#9dd3b1'
  secondary: '#006d40'
  on-secondary: '#ffffff'
  secondary-container: '#96f3b9'
  on-secondary-container: '#007243'
  tertiary: '#1c3200'
  on-tertiary: '#ffffff'
  tertiary-container: '#2c4a00'
  on-tertiary-container: '#7bc100'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b8efcc'
  primary-fixed-dim: '#9dd3b1'
  on-primary-fixed: '#002112'
  on-primary-fixed-variant: '#1d5036'
  secondary-fixed: '#98f6bc'
  secondary-fixed-dim: '#7dd9a1'
  on-secondary-fixed: '#002110'
  on-secondary-fixed-variant: '#00522f'
  tertiary-fixed: '#acf847'
  tertiary-fixed-dim: '#91db2a'
  on-tertiary-fixed: '#102000'
  on-tertiary-fixed-variant: '#304f00'
  background: '#effdf0'
  on-background: '#121e16'
  surface-variant: '#d8e6d9'
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.04em
  display-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.035em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.025em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 22px
    letterSpacing: -0.015em
  stat-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.03em
  stat-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.02em
  body-base:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 21px
    letterSpacing: '0'
  body-bold:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 21px
    letterSpacing: '0'
  body-small:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 17px
    letterSpacing: '0'
  label-caps:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.11em
  micro-caps:
    fontFamily: Inter
    fontSize: 9px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.0625rem
  gutter-mobile: 0.75rem
  margin: 2.375rem
  margin-tablet: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system expresses the discipline, speed, and elegance of Michelin-caliber kitchen management fused with the technical precision of modern engineering tools like Linear and Stripe. It serves executive chefs, food and beverage directors, and hospitality operators who demand immediate clarity during intense dinner rushes and analytical depth during inventory prep cycles.

The atmosphere is defined by an **Organically Grounded High-Density** aesthetic:
- **Calm Authority:** Eliminates operational frenzy through a natural foundation of warm ivory paper surfaces and deep evergreen ink, avoiding cold laboratory white and noisy gradients.
- **Utilitarian Rigor:** High-density metric cards, tabular data alignments, precise badge micro-caps, and telemetry sparklines that treat culinary yield, prep times, and waste metrics with actuarial precision.
- **Tactile Botanical Contrast:** Deep forest pines anchor structural navigation and primary actions, while energetic emerald and lime signals convey real-time system health, automated line balance, and fresh prep batches.

## Colors

The palette balances warm organic foundations with decisive operational green tones:

- **Canvas & Surface Architecture:**
  - Base canvas is set to warm ivory-gray (`#F6F7F2`), functioning as a non-glare, paper-like baseline.
  - Primary surfaces, telemetry cards, and flyout sheets use crisp pure white (`#FFFFFF`).
  - Subtle interactive surfaces use botanical wash tints (`#EDF5ED` and `#F0F7EF`) for hovered rows, selection chips, and decision banners.
  - Inverted or hero telemetry zones employ deep canopy pine (`#173A27`).

- **Brand & Semantic Hierarchy:**
  - **Primary (`#174B32`):** Deep Forest Green for primary actions, current menu active states, and core branding. Hover transitions shift to `#103D29`.
  - **Secondary (`#1C8050`):** Live Emerald for system heartbeat, real-time AI recommendations, active prep lines, and positive margins.
  - **Tertiary (`#84CC16`):** Vibrant Lime accent used sparingly for micro-pulsing telemetry indicators, real-time sync markers, and optimal yield indicators.
  - **Neutral (`#17231B`):** Deep pine ink for primary typography. Secondary copy uses sage charcoal (`#2D3E35`), while meta labels and inactive icons leverage slate green (`#6F7D73`).

- **Functional Warning & Hazard States:**
  - **Attention / Forecast Surge:** Honey amber (`#E98B3B`), supported by container fill (`#FFF0DC`) and border (`#F5D6A8`).
  - **Critical / Waste Hazard:** Soft crimson (`#EF665A`), supported by container fill (`#FFEBEA`) and dark text (`#B85047`).
  - **Workflow & Scheduling:** Muted botanical violet (`#6B58A5`) on lavender tint (`#EEEBFA`).

## Typography

The typography system uses **Inter** across all layers, calibrated to provide extreme readability at compact operational scales and assertive typographic presence on large dashboards:

- **Optical Tracking Dynamics:** Negative letter-spacing tightens display headers and numerical KPI cards (`-0.015em` to `-0.04em`) to maintain cohesion. Conversely, section eyebrows, badge titles, and tabular column headers rely on aggressive positive tracking (`0.08em` to `0.11em`) in uppercase.
- **Tabular Numerals (`font-variant-numeric: tabular-nums`):** Mandatory for all data tables, live timers, stock levels, recipe costs, and percentage deltas to prevent column jittering when data refreshes live.
- **Hierarchy Pairing:** Metric panels pair an uppercase `label-caps` kicker at the top with a heavy `stat-xl` or `stat-lg` figure in the center, finalized by a `body-small` comparison indicator at the bottom.

## Layout & Spacing

The layout model is governed by a strict 4px/8px incremental grid designed for dense information displays without visual congestion:

- **Grid Architecture:**
  - **Operational Telemetry Grid:** A flexible 5-column metric banner (`repeat(5, 1fr)`) with `1.0625rem` (17px) gutters that condenses into 3 columns on tablet and 2 columns on mobile.
  - **Asymmetric Split Workspaces:** Operational modules leverage dual-column proportional layouts (primary stage `minmax(0, 1.7fr)` paired with an action/alert rail `minmax(300px, 0.8fr)`).
- **Adaptive Canvas Margins:**
  - **Desktop (>1050px):** `margin: 2.375rem` (38px) outer padding, max container constraint of `1420px`. Sidebar remains fixed at `252px`.
  - **Tablet (761px - 1050px):** `margin: 1.5rem` (24px) outer padding, stacked dual panels, compacted sidebar (`220px`).
  - **Mobile (<=760px):** `margin: 1rem` (16px) outer padding, single-column vertical flow, horizontal swipe data tables, bottom sheets, and sticky action triggers.
- **Component Padding Scale:**
  - Micro tags and badges: `space-xs` (4px) to `space-sm` (8px).
  - Inputs and buttons: `space-sm` (8px) vertical by `space-lg` (16px) horizontal.
  - Metric and analysis panels: `space-lg` (16px) to `space-xl` (24px).

## Elevation & Depth

Visual depth is conveyed through **crisp low-contrast outlines combined with whisper-soft ambient illumination**, deliberately shunning muddy drop-shadows:

- **Hairline Framing:** Surface separation is fundamentally achieved via `1px solid #E2E8DF` borders. Cards do not rely on heavy drop-shadows to separate from the `#F6F7F2` canvas.
- **Ambient Shadow Craft:** 
  - Resting panels utilize a feather-light tinted ambient shadow: `0 4px 18px rgba(27, 47, 30, 0.035)`.
  - Elevated interaction nodes and active cards lift by `-1px` to `-2px` with an expanded shadow: `0 8px 24px rgba(23, 75, 50, 0.08)` and border transition to `#D4E2D2`.
- **Z-Index Layering:**
  - Level 0: Canvas foundation (`#F6F7F2`).
  - Level 1: Metric surfaces and data tables (`#FFFFFF`).
  - Level 2: Workspace header bar with frosted translucent finish (`rgba(255, 255, 255, 0.86)` with `backdrop-filter: blur(14px)`).
  - Level 3: Right-anchored inspection flyouts (`410px` drawer with `-12px 0 40px rgba(23, 32, 26, 0.12)` shadow).

## Shapes

The design system embraces a **Refined Rounded** curvature language (`roundedness: 2`) that brings soft organic poise to high-precision software:

- **Corner Radius Scale:**
  - **4px (`rounded-xs`):** Micro check controls, progress bar tracks, and inner badge accents.
  - **8px to 10px (`rounded-sm` / base):** Standard form inputs, segmented selectors, action buttons, table cell avatar thumbnails.
  - **14px to 18px (`rounded-lg` / `rounded-xl`):** Primary workspace cards, AI decision containers, telemetry panels, and flyout drawer headers.
  - **Full / Capsule (`rounded-full`):** Live telemetry pills, status tags, toggle rails, and user profile counters.
- **Structural Integrity:** Elements nested within cards use proportionally smaller radiuses (e.g., an 18px parent container hosts 10px internal child action blocks and 4px nested tracks) to maintain harmonious concentric perimeters.

## Components

### Buttons
- **Primary:** Deep forest green fill (`#174B32`), crisp white label (`#FFFFFF`), `10px` radius, `11px` uppercase or semi-bold text, padding `8px 16px`. Elevation `0 4px 10px rgba(23, 75, 50, 0.12)`. Hover shifts to `#103D29` with `-1px` transform.
- **Secondary / Outline:** Pure white fill, `1px solid #E2E8DF`, label `#2D3E35`. On hover, border shifts to `#B6CBB8`, background to `#F7FAF5`, text to `#174B32`.
- **Ghost / Text:** Transparent background, `11px` bold text in Emerald (`#1C8050`). Hover reveals subtle `#EDF5ED` tint.
- **Icon Actions:** Fixed `34x34px` square, `10px` radius, `1px solid #E2E8DF` border on white fill.

### Cards & Telemetry Panels
- **KPI Metric Card:** White surface, `18px` radius, `1px solid #E2E8DF` border, `16px 18px` padding. Upper row features `label-caps` with an aligned pulsating dot. Center holds a `stat-xl` value (`#17231B`). Lower row features a pill badge with performance delta.
- **AI Recommendation Decision Strip:** Linear gradient backdrop (`linear-gradient(115deg, #F0F7EF 0%, #FFFFFF 72%)`), `18px` radius, `1px solid #DCE9DD` border. Encapsulates predictive insights with an inline primary trigger button.
- **Alert & Surge Card:** Light honey tint (`#FFFDF9`) framed in `1px solid #F2DFC8`. Houses imminent prep bottlenecks and stockout warnings.

### Status Chips & Pills
- **Geometry:** Capsule pill (`rounded-full`), padding `4px 10px`, typography `micro-caps` (`9px`, `letterSpacing: 0.08em`, `fontWeight: 700`).
- **Optimal / Live:** Emerald text (`#1C8050`) on `#E9F6EA` background. Includes a 6px pulsing emerald indicator.
- **Attention / Surge:** Amber text (`#B66B1A`) on `#FFF0DC` background.
- **Hazard / Depleted:** Crimson text (`#B85047`) on `#FFEBEA` background.

### Inputs & Filters
- **Text & Numeric Inputs:** Pure white fill, `10px` radius, `1px solid #E2E8DF`, `10px 14px` padding, font size `13px`. Focus transitions border to `#1C8050` with an outer ring glow: `0 0 0 3px rgba(28, 128, 80, 0.10)`.
- **Dropdown Filters:** White background, `8px` radius, `1px solid #E2E8DF`, `8px 28px 8px 12px` padding, custom down chevron, `11px` typography.

### Checkboxes & Radios
- **Checkbox:** `16x16px`, `4px` radius, `1px solid #D5D2C9`. Checked state triggers solid `#174B32` fill with white check glyph. Focus ring matches input token.
- **Radio Button:** `16x16px` circular shell, `1px solid #D5D2C9`. Checked state reveals a centered `8px` solid `#174B32` dot.

### Operational Tables
- **Header:** Sticky positioning, uppercase micro-headers (`9px`, `0.08em` tracking, color `#6F7D73`), `10px 16px` padding, bottom border `1px solid #E2E8DF`.
- **Row Styling:** Zero zebra striping. Height `48px`. Dividers use hairline borders (`#E4EAE3`). Row hover triggers subtle botanical wash (`#F7FAF5`). Numbers and metrics use tabular numerals.

### Kitchen Progress & Yield Gauges
- **Track:** Height `6px`, radius `999px`, background `#EDF0EB`.
- **Indicator Fill:** Solid `#1C8050` (or `#84CC16` for maximum efficiency) with a `0.3s cubic-bezier(0.4, 0, 0.2, 1)` transition.