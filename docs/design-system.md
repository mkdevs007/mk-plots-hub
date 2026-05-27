# MK Builders & Developers — Design System
**Version 1.0 | Premium Karnataka Real Estate**

---

## 1. Brand Identity

| Field | Value |
|-------|-------|
| Company | MK Builders & Developers |
| Tagline | True, Trusted, Transparent |
| Business | RERA-approved plotted communities across Karnataka |
| Markets | Bangalore, Mysore, Hubli, Tumkur |
| Plot types | Residential, Commercial, Agricultural, Industrial |
| Brand persona | Established, authoritative, transparent, premium |
| Tone | Formal yet warm. Trustworthy. Not corporate-cold. Not flashy. |

---

## 2. Typography System

### Font Stack

| Role | Font | Fallback | CSS Variable |
|------|------|----------|--------------|
| Display / Headings | Playfair Display | ui-serif, Georgia, serif | `--font-display` |
| Body / UI text | DM Sans | ui-sans-serif, system-ui, sans-serif | `--font-sans` |
| Navigation / Buttons / Labels | Outfit | DM Sans, ui-sans-serif, sans-serif | `--font-nav` |

### Why These Fonts

**Playfair Display** (headings)
- High-contrast editorial serif — the standard for luxury real estate worldwide
- Used by Sotheby's, premium property portals, banking institutions
- Beautiful italic cuts for pull quotes and the gold "italic" hero treatment
- Conveys authority, permanence and trust — exactly what property buyers need
- Superior screen rendering vs Cormorant Garamond at all weights

**DM Sans** (body)
- Humanist sans-serif designed specifically for screen readability
- Professional without feeling like a tech product (unlike Inter)
- Optical-size axis: stays crisp at 12px, elegant at 20px+
- Ideal for long-form descriptions, form fields, bullet points

**Outfit** (UI)
- Geometric sans based on Futura principles — formal precision
- Clean at small sizes (10px badges, 11px eyebrow text)
- Modern formal feel for navigation links and CTAs
- Distinct from the body font so UI chrome stays legible

### Google Fonts Import

```
https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Outfit:wght@300;400;500;600;700&display=swap
```

### Type Scale

| Token | Font | Size | Weight | Line Height | Usage |
|-------|------|------|--------|-------------|-------|
| `text-8xl` | Playfair Display | 96px | 700 | 1.0 | Hero headline (desktop) |
| `text-7xl` | Playfair Display | 72px | 700 | 1.05 | Hero headline (tablet) |
| `text-6xl` | Playfair Display | 60px | 700 | 1.05 | Page hero h1 |
| `text-5xl` | Playfair Display | 48px | 600–700 | 1.1 | Section h1, page titles |
| `text-4xl` | Playfair Display | 36px | 600 | 1.15 | Section h2 |
| `text-3xl` | Playfair Display | 30px | 500–600 | 1.2 | Sub-section h2, card titles |
| `text-2xl` | Playfair Display | 24px | 500 | 1.3 | h3, modal headings |
| `text-xl` | Playfair Display | 20px | 500 | 1.35 | h4, card headings |
| `text-lg` | DM Sans | 18px | 400 | 1.6 | Lead body text, intros |
| `text-base` | DM Sans | 16px | 400 | 1.6 | Standard body copy |
| `text-sm` | DM Sans | 14px | 400 | 1.5 | Secondary body, form text |
| `text-xs` | Outfit | 12px | 500–600 | 1.4 | Eyebrow labels, captions |
| `text-[10px]` | Outfit | 10px | 600–700 | 1.4 | Badges, tags, micro labels |

### Font Usage Rules

```
DISPLAY FONT (Playfair Display)
  h1, h2, h3, h4              — all structural headings
  .font-display               — utility class for any display text
  Hero pull-quotes            — italic 400 or 500
  Stat numbers (10+, 500+)    — bold display numerals
  Section eyebrow pairs       — the large heading paired with eyebrow

BODY FONT (DM Sans)
  body default                — all prose, descriptions
  form inputs / textareas     — clean readability
  table cells                 — data legibility
  muted-foreground text       — supporting copy
  navigation description text

NAV FONT (Outfit)
  Navigation links            — .font-nav class
  Buttons (all CTAs)          — gold-gradient, WhatsApp, border buttons
  Eyebrow labels              — "Now Selling", "Get a Callback", etc.
  Badge text                  — "Ongoing", "New Launch", "Few Plots Left"
  Price tags and data labels
  Form field labels
  Tracking-wide uppercase text
```

---

## 3. Colour System

All colours are defined as CSS custom properties using OKLCH for perceptual uniformity.

### Core Palette

| Token | OKLCH | Hex Approx. | Usage |
|-------|-------|-------------|-------|
| `--background` | oklch(0.12 0.04 320) | #0E0514 | Page background |
| `--foreground` | oklch(0.96 0.01 320) | #F4F0F5 | Primary text |
| `--card` | oklch(0.15 0.05 320) | #150B1E | Card backgrounds |
| `--primary` | oklch(0.18 0.07 320) | #1C0624 | Brand deep plum |
| `--primary-foreground` | oklch(0.96 0.01 320) | #F4F0F5 | Text on primary |
| `--secondary` | oklch(0.14 0.045 320) | #120819 | Secondary surfaces |
| `--muted` | oklch(0.18 0.045 320) | #180E21 | Muted backgrounds |
| `--muted-foreground` | oklch(0.75 0.03 320) | #B8A8C0 | Supporting text |
| `--border` | oklch(0.22 0.06 320 / 0.4) | #2A1233 40% | Borders |
| `--input` | oklch(0.16 0.05 320) | #150A1E | Input fields |

### Brand Accent

| Token | OKLCH | Hex Approx. | Usage |
|-------|-------|-------------|-------|
| `--gold` | oklch(0.81 0.13 85) | #DFC160 | Primary accent, CTAs, icons |
| `--gold-foreground` | oklch(0.15 0.06 320) | #160825 | Text on gold backgrounds |
| `--whatsapp` | oklch(0.72 0.18 150) | #25D366 | WhatsApp CTA only |

### Status / Badge Colours

| Badge | Background | Foreground |
|-------|-----------|------------|
| Ongoing | oklch(0.25 0.08 165 / 0.3) | oklch(0.75 0.12 165) — teal-green |
| New Launch | oklch(0.25 0.08 245 / 0.3) | oklch(0.75 0.12 245) — blue |
| Few Plots Left | oklch(0.25 0.08 80 / 0.3) | oklch(0.81 0.13 85) — gold |
| Completed / Sold | oklch(0.2 0.02 80 / 0.3) | oklch(0.65 0.02 80) — muted gold |

### Gradients

```css
/* Gold gradient — used for primary CTAs, icons, dividers */
--gradient-gold: linear-gradient(135deg, oklch(0.81 0.13 85), oklch(0.72 0.13 75));

/* Hero overlay — darkens hero image for text legibility */
--gradient-hero: linear-gradient(
  180deg,
  oklch(0.18 0.07 320 / 0.15) 0%,
  oklch(0.14 0.05 320 / 0.40) 60%,
  oklch(0.12 0.04 320 / 0.70) 100%
);
```

### Colour Usage Rules

```
Gold (#DFC160)
  Primary CTAs (gold-gradient buttons)
  Icon accents
  Active nav links
  Gold divider lines (.gold-divider)
  Eyebrow text
  Stat numbers
  Border highlights on hover

Deep Plum (#1C0624)
  Page sections with dark bg
  Popup modals (CallbackPopup, ExitIntentPopup)
  Header background
  Primary section backgrounds

White / Foreground
  All text on dark backgrounds
  Use /85 opacity for supporting text
  Use /70 opacity for secondary text
  Use /60 for tertiary / captions

NEVER use
  Pure #000000 black as a background — use deep plum instead
  Pure #FFFFFF white as a background — use card tokens
  Colour outside the defined palette
```

---

## 4. Spacing & Layout

### Container Widths

| Token | Max Width | Usage |
|-------|-----------|-------|
| `max-w-7xl` | 1280px | Default page sections |
| `max-w-5xl` | 1024px | Focused content (enquiry, video) |
| `max-w-4xl` | 896px | Text-heavy sections (about, contact hero) |
| `max-w-3xl` | 768px | Narrow prose sections |
| `max-w-md` | 448px | Popups, modals, small cards |

### Section Padding

```
Horizontal: px-5 (mobile) → px-8 (md+)
Vertical:   py-20 (mobile) → py-28 (md+)    standard sections
            py-16 (mobile) → py-20 (md+)    compact sections
            py-10                            stat bars, tight strips
```

### Grid System

| Use | Classes |
|-----|---------|
| Feature cards (2→3) | `grid gap-8 md:grid-cols-2 lg:grid-cols-3` |
| Plot type cards (2→4) | `grid gap-6 sm:grid-cols-2 lg:grid-cols-4` |
| Stats bar (3→5) | `grid grid-cols-3 md:grid-cols-5 gap-6` |
| Testimonials (1→3) | `grid gap-8 md:grid-cols-3` |
| 2-col layout (content+sidebar) | `grid lg:grid-cols-[1fr_380px] gap-12` |
| Contact (info+form) | `grid lg:grid-cols-[1fr_1.2fr] gap-10` |
| Footer | `grid gap-10 md:grid-cols-2 lg:grid-cols-4` |
| Gallery | `grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4` |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-full` | 9999px | Buttons, badges, pills, nav links |
| `rounded-2xl` | 16px | Cards, popups, large containers |
| `rounded-xl` | 12px | Feature cards, gallery items, tables |
| `rounded-lg` | 8px | Form inputs, small cards |
| `rounded-md` | 6px | Buttons (secondary), table actions |

---

## 5. Component Patterns

### Buttons

**Primary CTA (gold)**
```html
class="px-6 py-3 rounded-full gold-gradient text-gold-foreground
       font-semibold font-nav text-sm hover:opacity-95
       hover:scale-[1.02] transition shadow-md"
```

**WhatsApp CTA**
```html
class="px-6 py-3 rounded-full bg-whatsapp text-white
       font-semibold font-nav text-sm hover:opacity-90 transition"
```

**Ghost / Border CTA**
```html
class="px-6 py-3 rounded-full border border-white/40 text-white
       font-semibold font-nav text-sm hover:bg-white hover:text-primary transition"
```

**Gold outline (site visit, secondary)**
```html
class="px-5 py-3 border-2 border-gold text-gold rounded-md
       hover:bg-gold hover:text-gold-foreground font-semibold font-nav text-sm transition"
```

All buttons: minimum height 44px. Use `font-nav` (Outfit) for button text.

### Cards

**Standard feature card**
```html
class="p-8 rounded-xl bg-card border border-border shadow-card
       hover:border-gold/50 hover:-translate-y-1 transition-all duration-500"
```

**Enquiry / form card**
```html
class="bg-card p-8 rounded-2xl shadow-card-hover border border-border"
```

**Testimonial card (on dark bg)**
```html
class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8"
```

### Eyebrow Labels

Always `Outfit` font, small uppercase, gold, letter-spaced:
```html
<span class="text-gold text-xs font-semibold font-nav tracking-[0.25em] uppercase">
  Now Selling
</span>
```

Paired with gold divider lines for centre-aligned versions:
```html
<div class="flex items-center justify-center gap-3">
  <span class="gold-divider" />
  <span class="text-gold text-xs font-semibold tracking-[0.2em] uppercase">Label</span>
  <span class="gold-divider" />
</div>
```

### Section Header

```html
<SectionHeader
  eyebrow="Now Selling"
  title="Ongoing Projects"
  description="Supporting copy here."
  center={true}  <!-- default, use center={false} for left-aligned -->
/>
```

### Status Badges (project cards)

```html
<!-- Ongoing -->
class="bg-badge-ongoing-bg text-badge-ongoing-fg"

<!-- New Launch -->
class="bg-badge-new-bg text-badge-new-fg"

<!-- Few Plots Left -->
class="bg-badge-few-bg text-badge-few-fg"

<!-- Completed / Sold Out -->
class="bg-badge-done-bg text-badge-done-fg"
```

### Form Fields

```css
/* Standard input class used across all forms */
.field {
  width: 100%;
  padding: 12px 16px;
  border-radius: 6px;
  background: var(--background);
  border: 1px solid var(--border);
  font-family: var(--font-sans);  /* DM Sans */
  font-size: 14px;
  outline: none;
  transition: border-color 150ms, box-shadow 150ms;
}
.field:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px oklch(0.81 0.13 85 / 0.2);
}
```

### Popups / Modals

Both `CallbackPopup` and `ExitIntentPopup` follow:
- `fixed inset-0 z-[100] flex items-center justify-center p-4`
- Modal box: `max-h-[90svh] overflow-y-auto overflow-x-hidden`
- Backdrop: `bg-black/75 backdrop-blur-sm`
- Close button: `absolute top-4 right-4`

---

## 6. Iconography

All icons via `lucide-react`. Standard sizes:

| Context | Size |
|---------|------|
| Inline text icons | `w-4 h-4` |
| Card feature icons | `w-7 h-7` or `w-8 h-8` |
| Contact info icons | `w-5 h-5` |
| Gold accent icons (USP list) | `w-5 h-5 text-gold shrink-0` |
| Navigation icons | `w-5 h-5` |

Icon containers for card heads:
```html
<span class="inline-flex w-14 h-14 rounded-xl gold-gradient items-center
             justify-center text-gold-foreground">
  <Icon class="w-7 h-7" />
</span>
```

---

## 7. Animation

| Class | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `.animate-fade-up` | 700ms | cubic-bezier(0.22, 1, 0.36, 1) | Page sections, hero elements |
| `.animate-bounce-soft` | 2s infinite | ease-in-out | Scroll indicator chevron |
| `.animate-pulse-soft` | custom | — | Play button on video hero |
| `hover:-translate-y-1` | 500ms | — | Cards on hover |
| `hover:scale-[1.02]` | 150ms | — | Primary CTAs |
| `group-hover:scale-105` | 700ms | — | Gallery/card images |

All animations use `transform` and `opacity` only — never animate layout properties.

---

## 8. Responsive Breakpoints

| Breakpoint | Width | Notes |
|------------|-------|-------|
| default | 0px+ | Mobile-first base styles |
| `sm:` | 640px+ | Small tablets, landscape phones |
| `md:` | 768px+ | Tablets |
| `min-[960px]:` | 960px+ | Desktop nav breakpoint (Header) |
| `lg:` | 1024px+ | Desktop layout (sidebars, grids) |
| `xl:` | 1280px+ | Wide desktop |

Header behaviour:
- Below 960px: hamburger menu, mobile drawer
- 960px+: full horizontal nav

Layout stacking:
- All `lg:grid-cols-*` layouts (detail, contact) are single-column below `lg:`
- All `md:grid-cols-*` layouts stack on mobile

---

## 9. Navigation

**Desktop nav** (`min-[960px]+`)
- Font: Outfit (`font-nav`), `text-xs lg:text-sm`, `tracking-wide`
- Colour: `text-primary-foreground/85`, active: `text-gold font-semibold`
- CTA button: gold-gradient pill, right side

**Mobile nav** (below 960px)
- Hamburger opens full-height right drawer (w-72)
- Nav links: `py-2.5 px-4 rounded-full`, full width tap targets (min 44px height)
- CTA at bottom of drawer

**Header height:**
- Scrolled: `h-16` (mobile) → `h-20` (960px+)
- Top of page: `h-20` (mobile) → `h-24` (960px+)
- Background: `bg-[#1C0624]/90` → `bg-[#1C0624]/95 backdrop-blur-lg` on scroll

---

## 10. Page Template

Every public page wraps in `<SiteLayout>` which composes:
```
<Header />        fixed top, z-50
<main>            pt-20 md:pt-[120px], min-h-screen
  {children}
</main>
<Footer />
<WhatsAppButton />   fixed bottom-right, z-40
<ExitIntentPopup />  z-[100], desktop mouse-leave trigger
<CallbackPopup />    z-[100], 500ms delay on mount
```

**Hero sections** use `-mt-20 md:-mt-[120px]` to bleed under the fixed header.

---

## 11. SEO Conventions

Every route sets its own `head()` with:
- `title` — format: `[Page] | MK Builders & Developers`
- `description` — 150–160 chars, includes city names for local SEO
- `og:title`, `og:url`, `og:image` (project pages)
- `canonical` link

Root meta includes: Open Graph, Twitter card, author.

---

## 12. Files Reference

| File | Purpose |
|------|---------|
| `src/styles.css` | All CSS custom properties, font stack, utilities |
| `src/routes/__root.tsx` | Google Fonts import, global meta, app shell |
| `src/components/site/Layout.tsx` | SiteLayout wrapper used by all pages |
| `src/components/site/Header.tsx` | Fixed nav, mobile drawer |
| `src/components/site/Footer.tsx` | Footer grid |
| `src/components/site/SectionHeader.tsx` | Reusable eyebrow + title + description |
| `src/components/site/EnquiryForm.tsx` | Shared lead form (compact and full modes) |
| `src/components/site/CallbackPopup.tsx` | 500ms auto popup, every page load |
| `src/components/site/ExitIntentPopup.tsx` | Desktop exit-intent popup |
| `src/components/site/ProjectCard.tsx` | Reusable project listing card |
| `src/components/site/PlotROICalculator.tsx` | Interactive ROI calculator widget |
| `src/components/site/BrandLogo.tsx` | Logo component (scrolled/default states) |
| `src/data/projects.ts` | Project data |
| `src/data/blog.ts` | Blog post data |
| `src/lib/enquiries.ts` | Supabase enquiry submission |
| `src/lib/projects.ts` | Supabase project fetch |
