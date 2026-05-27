# CLAUDE.md — MK Builders & Developers
## Single Source of Truth for Claude Code

> Read this entire file before writing a single line of code.
> This overrides all default behaviour and assumptions.

---

## 1. PROJECT OVERVIEW

**MK Builders & Developers** is a premium Karnataka-based real estate company.
They develop and sell RERA-approved plotted communities across Bangalore, Mysore, Hubli, and Tumkur.

| Field | Value |
|-------|-------|
| Brand name | MK Builders & Developers |
| Tagline | True, Trusted, Transparent |
| Business type | Plotted community developer |
| Plot types | Residential, Commercial, Agricultural, Industrial |
| Markets | Bangalore, Mysore, Hubli, Tumkur (Karnataka) |
| Certifications | RERA approved — PRM/KA/RERA/... series |
| Brand persona | Established, authoritative, formal, trustworthy, premium |
| Tone of copy | Formal yet warm. Never corporate-cold. Never flashy or casual. |
| Target audience | Property investors, families looking to build homes, NRIs, agri-land buyers |

---

## 2. TECH STACK

| Layer | Technology |
|-------|-----------|
| Framework | TanStack Start (React, SSR/SSG) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix primitives) |
| Routing | TanStack Router (file-based) |
| Server state | TanStack Query v5 |
| Database | Supabase (PostgreSQL) with localStorage fallback |
| Auth (admin) | Supabase Auth |
| Icons | lucide-react |
| Notifications | sonner (toast) |
| Build | Vite + Vinxi |
| Deployment | Vercel |

**Environment variables required:**
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```
When these are not set, the app falls back to `localStorage` mock data automatically.
`isSupabaseConfigured` (from `src/lib/supabase.ts`) controls this throughout.

---

## 3. FILE STRUCTURE

```
src/
├── styles.css                    CSS custom properties, Tailwind theme, utilities
├── router.tsx                    TanStack Router setup
├── start.ts                      App entry point
├── server.ts                     Server entry
│
├── routes/
│   ├── __root.tsx                Root shell — Google Fonts, global meta, QueryClient
│   ├── index.tsx                 Homepage (/)
│   ├── about.tsx                 About page (/about)
│   ├── services.tsx              Services page (/services)
│   ├── contact.tsx               Contact page (/contact)
│   ├── gallery.tsx               Gallery page (/gallery) — 50 photos + 3 videos, lightbox
│   ├── projects.index.tsx        All projects listing (/projects)
│   ├── projects.$slug.tsx        Project detail page (/projects/:slug)
│   ├── plots.$type.tsx           Plots by type (/plots/:type) — all/residential/commercial/agricultural/industrial
│   ├── plots-in.$city.tsx        Plots by city (/plots-in/:city) — SEO landing pages
│   ├── blog.index.tsx            Blog listing (/blog)
│   ├── blog.$slug.tsx            Blog post (/blog/:slug)
│   ├── thank-you.tsx             Post-enquiry confirmation page (/thank-you)
│   ├── sitemap[.]xml.ts          Sitemap generator
│   ├── admin.tsx                 Admin layout shell + auth guard
│   ├── admin.index.tsx           Admin overview / KPI dashboard (/admin)
│   ├── admin.enquiries.tsx       Enquiries management (/admin/enquiries)
│   ├── admin.projects.tsx        Project management (/admin/projects)
│   ├── admin.blogs.tsx           Blog CMS (/admin/blogs)
│   └── admin.login.tsx           Admin login (/admin/login)
│
├── components/
│   ├── site/
│   │   ├── Layout.tsx            SiteLayout wrapper — Header + main + Footer + popups
│   │   ├── Header.tsx            Fixed nav — breakpoint min-[960px] for desktop
│   │   ├── Footer.tsx            4-column footer grid
│   │   ├── BrandLogo.tsx         Logo image with glassmorphic container, scrolled state
│   │   ├── SectionHeader.tsx     Reusable eyebrow + title + description block
│   │   ├── ProjectCard.tsx       Reusable project listing card (used in 3 places)
│   │   ├── EnquiryForm.tsx       Lead capture form — compact (popup) and full modes
│   │   ├── CallbackPopup.tsx     Auto popup — shows 500ms after every page load
│   │   ├── ExitIntentPopup.tsx   Desktop exit-intent popup (mouseleave detection)
│   │   ├── SiteVisitModal.tsx    Book site visit — sends prefilled WhatsApp message
│   │   ├── PlotROICalculator.tsx Interactive wealth estimator — budget, city, years sliders
│   │   └── WhatsAppButton.tsx    Fixed bottom-right WhatsApp floating button
│   └── ui/                       shadcn/ui components — DO NOT EDIT
│
├── data/
│   ├── projects.ts               Static project data array (5 projects) + Project type
│   └── blog.ts                   Static blog post data array
│
├── lib/
│   ├── supabase.ts               Supabase client + isSupabaseConfigured flag
│   ├── enquiries.ts              CRUD for enquiries — Supabase or localStorage fallback
│   ├── projects.ts               Fetch projects — Supabase or static data fallback
│   └── blogs.ts                  Blog CRUD — Supabase or static data fallback
│
└── assets/
    ├── logo.png                  Brand logo (used in BrandLogo.tsx)
    ├── hero-aerial.jpg           Hero section poster image
    ├── project-1.jpg             MK Green Valley image
    ├── project-2.jpg             MK Royal Heights image
    ├── project-3.jpg             MK Agri Estates image
    ├── entrance-gate.png         About page featured image
    └── testimonial-1/2/3.jpg    Testimonial profile photos
```

---

## 4. CURRENT PROJECT DATA

5 projects in `src/data/projects.ts`:

| Slug | Name | City | Type | Status | Price |
|------|------|------|------|--------|-------|
| mk-green-valley | MK Green Valley | Bangalore (Devanahalli) | Residential | Ongoing | ₹18 Lakh |
| mk-royal-heights | MK Royal Heights | Mysore (Hunsur Road) | Commercial | New Launch | ₹28 Lakh |
| mk-agri-estates | MK Agri Estates | Tumkur (Kunigal) | Agricultural | Few Plots Left | ₹8 Lakh |
| mk-industrial-park | MK Industrial Park | Hubli (Gokul Road) | Industrial | Ongoing | ₹35 Lakh |
| mk-orchid-meadows | MK Orchid Meadows | Bangalore (Sarjapur) | Residential | Completed | Sold Out |

When adding new projects, add them to BOTH `src/data/projects.ts` (static) AND the Supabase `projects` table (if configured).

---

## 5. DESIGN SYSTEM

### 5.1 Fonts

Three-font system. All loaded via Google Fonts in `src/routes/__root.tsx`.
CSS variables defined in `src/styles.css` under `@theme inline`.

| Role | Font | Variable | Tailwind class |
|------|------|----------|---------------|
| Display / All headings | **Playfair Display** | `--font-display` | `font-display` |
| Body / UI text / forms | **DM Sans** | `--font-sans` | `font-sans` (default body) |
| Nav / buttons / labels / eyebrows | **Outfit** | `--font-nav` | `font-nav` |

**Font usage rules — enforce always:**
- `font-display` → h1, h2, h3, h4, `.font-display`, stat numbers, hero headings
- `font-sans` (default) → body prose, descriptions, form inputs, table data, muted text
- `font-nav` → nav links, all CTA buttons, eyebrow labels, badges, price tags, uppercase tracking text

**Never use** Inter, Plus Jakarta Sans, or Cormorant Garamond — they have been replaced.

### 5.2 Colour Tokens

All defined as CSS custom properties in `src/styles.css`:

```
Background surfaces:
  --background   oklch(0.12 0.04 320)   #0E0514  page bg
  --card         oklch(0.15 0.05 320)   #150B1E  card bg
  --primary      oklch(0.18 0.07 320)   #1C0624  brand deep plum, section bg
  --secondary    oklch(0.14 0.045 320)  #120819  secondary surface
  --muted        oklch(0.18 0.045 320)  #180E21  muted bg
  --input        oklch(0.16 0.05 320)   #150A1E  form fields

Text:
  --foreground          oklch(0.96 0.01 320)  #F4F0F5  primary text
  --primary-foreground  oklch(0.96 0.01 320)  #F4F0F5  text on primary/dark
  --muted-foreground    oklch(0.75 0.03 320)  #B8A8C0  supporting text

Accent:
  --gold             oklch(0.81 0.13 85)   #DFC160  primary accent — CTAs, icons, active
  --gold-foreground  oklch(0.15 0.06 320)  #160825  text on gold backgrounds
  --whatsapp         oklch(0.72 0.18 150)  #25D366  WhatsApp CTA only

Border:
  --border  oklch(0.22 0.06 320 / 0.4)  subtle border
  --ring    oklch(0.81 0.13 85)          focus ring (gold)

Badge colours:
  --badge-ongoing-bg/fg   teal-green
  --badge-new-bg/fg       blue
  --badge-few-bg/fg       gold
  --badge-done-bg/fg      muted grey
```

**Gold gradient:** `background: var(--gradient-gold)` or class `.gold-gradient`
**Hero overlay:** class `.hero-overlay`
**Card shadows:** `.shadow-card` and `.shadow-card-hover`

### 5.3 Typography Scale

| Size class | Usage |
|-----------|-------|
| `text-8xl font-display` | Hero (desktop) |
| `text-7xl font-display` | Hero (tablet), page h1 (contact/projects) |
| `text-5xl md:text-7xl font-display` | Hero pattern — mobile → desktop |
| `text-4xl md:text-5xl font-display` | Section h2 |
| `text-3xl font-display` | Sub-section h2, form headings |
| `text-2xl font-display` | h3, modal/popup headings |
| `text-xl font-display` | h4, card headings, footer section titles |
| `text-lg` | Lead body text |
| `text-base` / `text-sm` | Standard body, descriptions |
| `text-xs font-nav tracking-[0.25em] uppercase` | Eyebrow labels (always gold) |
| `text-[10px] font-nav` | Badges, micro labels |

### 5.4 Spacing & Layout

**Page section padding pattern:**
```
Standard: py-20 md:py-28 px-5 md:px-8
Compact:  py-16 md:py-20 px-5 md:px-8
Strip:    py-10 px-5 md:px-8
```

**Max-width containers:**
```
max-w-7xl  — default for content-rich sections
max-w-5xl  — focused content (enquiry section, video, ROI calculator)
max-w-4xl  — text-centric sections (about hero, contact hero)
max-w-3xl  — narrow prose (about story)
max-w-md   — popups, modals
```

**Grid patterns:**
```
Feature cards (2→3):     grid gap-8 md:grid-cols-2 lg:grid-cols-3
Plot type cards (2→4):   grid gap-6 sm:grid-cols-2 lg:grid-cols-4
Stats bar (3→5):         grid grid-cols-3 md:grid-cols-5 gap-6
Testimonials (1→3):      grid gap-8 md:grid-cols-3
Detail sidebar:          grid lg:grid-cols-[1fr_380px] gap-12
Contact layout:          grid lg:grid-cols-[1fr_1.2fr] gap-10
Footer:                  grid gap-10 md:grid-cols-2 lg:grid-cols-4
Gallery grid:            grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
```

---

## 6. RESPONSIVENESS RULES — NON-NEGOTIABLE

These rules apply to every component and every page, always.

### 6.1 Mobile-First Always

Write base styles for mobile (375px), enhance with `md:` and `lg:` prefixes.

```
CORRECT:   className="grid grid-cols-1 md:grid-cols-3"
WRONG:     className="grid grid-cols-3 md:grid-cols-1"
```

### 6.2 Breakpoints

| Prefix | Width | Usage |
|--------|-------|-------|
| (none) | 0px+ | Mobile base |
| `sm:` | 640px+ | Landscape phones, small tablets |
| `md:` | 768px+ | Tablets |
| `min-[960px]:` | 960px+ | Header/nav desktop breakpoint |
| `lg:` | 1024px+ | Desktop layouts, sidebars |
| `xl:` | 1280px+ | Wide desktop |

### 6.3 Touch Targets

All interactive elements must be minimum **44×44px**.
- Buttons: `min-h-[44px]` always
- Nav links (mobile): `min-h-[48px]` with full-width tap area
- Form inputs: `min-h-[48px]` (also prevents iOS zoom on focus)
- Accordion triggers: `min-h-[52px]`

### 6.4 Header Behaviour

The header breaks to desktop at `min-[960px]` (not `md:`).
- Below 960px: hamburger menu → right drawer (w-72)
- 960px+: horizontal nav links + "Enquire Now" CTA
- Heights: scrolled `h-16 min-[960px]:h-20`, top `h-20 min-[960px]:h-24`
- Main content offset: `pt-20 md:pt-[120px]`
- Hero sections bleed under header: `-mt-20 md:-mt-[120px]`

### 6.5 Popups & Modals

All popups must have:
```
max-h-[90svh] overflow-y-auto overflow-x-hidden
```
Without this, the popup will overflow off-screen on small phones (360×640px).
Both `CallbackPopup` and `ExitIntentPopup` already have this fix applied.
`SiteVisitModal` uses `max-w-md` but does NOT currently have max-h — add it if content grows.

### 6.6 Text Sizes

- Never use less than `text-xs` (12px) for readable content
- Form inputs: `text-sm` minimum (prevents iOS zoom on focus at < 16px)
- Hero h1: `text-5xl md:text-7xl` — scales from 48px on mobile to 72px on desktop

### 6.7 No Horizontal Scroll

Never create horizontal overflow on any screen.
- Tables: always wrap in `overflow-x-auto` container
- The project detail page plot availability table already does this correctly
- Filter bars: use `flex flex-wrap gap-4` never fixed-width flex row

### 6.8 Images

Always set `aspect-ratio` containers for images to prevent layout shift:
- Project cards: `aspect-[4/3]`
- Gallery items: `aspect-[4/3]`
- Hero video: `aspect-video` (16/9)
- About entrance gate: `aspect-[21/9]`

### 6.9 Admin Panel Responsiveness

Admin uses a different layout from the public site:
- Desktop (md+): fixed left sidebar (w-72)
- Mobile (below md): top header bar + full-screen drawer on hamburger tap
- Admin content area: `p-4 md:p-8`

---

## 7. COMPONENT PATTERNS

### Eyebrow Label (always above section headings)
```tsx
<span className="text-gold text-xs font-semibold font-nav tracking-[0.25em] uppercase">
  Label Text
</span>
```

### Section Header
```tsx
<SectionHeader
  eyebrow="Now Selling"
  title="Ongoing Projects"
  description="Optional supporting copy."
  center={true}         // true = centred (default), false = left-aligned
/>
```

### Buttons
```tsx
// Primary CTA (gold)
"px-6 py-3 rounded-full gold-gradient text-gold-foreground font-semibold font-nav text-sm hover:opacity-95 hover:scale-[1.02] transition shadow-md"

// WhatsApp
"px-6 py-3 rounded-full bg-whatsapp text-white font-semibold font-nav text-sm hover:opacity-90 transition"

// Ghost / border
"px-6 py-3 rounded-full border border-white/40 text-white font-semibold font-nav text-sm hover:bg-white hover:text-primary transition"

// Gold outline
"px-5 py-3 border-2 border-gold text-gold rounded-md hover:bg-gold hover:text-gold-foreground font-semibold font-nav text-sm transition"
```
All buttons use `font-nav` (Outfit). All are `rounded-full` except gold-outline secondary.

### Form Field Class
```tsx
const fieldCls = "w-full px-4 py-3 rounded-md bg-background border border-border focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none transition text-sm"
```

### EnquiryForm
```tsx
<EnquiryForm />                                  // Full mode — 2-col grid on md+
<EnquiryForm compact />                          // Compact mode — single col, rows={2} textarea
<EnquiryForm compact projectName="MK Green Valley" plotId="#101" />  // Pre-fills message
```

### ProjectCard
Receives a `Project` object. Shows status badge, price pill, hover overlay with CTAs, sizes tags, availability, RERA badge.

### Status Badges
```tsx
const badgeClass = {
  "Ongoing":         "bg-badge-ongoing-bg text-badge-ongoing-fg",
  "New Launch":      "bg-badge-new-bg text-badge-new-fg",
  "Few Plots Left":  "bg-badge-few-bg text-badge-few-fg",
  "Completed":       "bg-badge-done-bg text-badge-done-fg",
}
```

### Gold Divider
```tsx
<span className="gold-divider" />   // 56px wide, 2px tall, gold gradient
```

---

## 8. DATA LAYER

### Projects
- Source: `src/data/projects.ts` (static array, always available)
- `getProjects()` in `src/lib/projects.ts` — tries Supabase first, falls back to static
- Schema: `Project` interface in `src/data/projects.ts`
- Supabase table: `projects`

### Enquiries
- `submitEnquiry()` — Supabase insert or localStorage fallback
- `getEnquiries()` — Supabase select or localStorage (with 3 mock entries default)
- `updateEnquiryStatus()` — New | Contacted | Closed
- `deleteEnquiry()` — hard delete
- Supabase table: `enquiries`

### Blog Posts
- Source: `src/data/blog.ts` (static array)
- `src/lib/blogs.ts` — CRUD similar pattern to enquiries
- Supabase table: `blogs`

### Admin Auth
- Supabase: `supabase.auth.getSession()` / `onAuthStateChange()`
- Offline mode: `localStorage.getItem("mock_admin_authenticated") === "true"`
- Login sets the session; logout calls `supabase.auth.signOut()`

---

## 9. PAGE INVENTORY & STATUS

### Public pages — ALL BUILT

| Route | File | Status |
|-------|------|--------|
| `/` | `routes/index.tsx` | Complete |
| `/about` | `routes/about.tsx` | Complete |
| `/services` | `routes/services.tsx` | Complete |
| `/contact` | `routes/contact.tsx` | Complete |
| `/gallery` | `routes/gallery.tsx` | Complete — 50 photos + 3 videos, filters, lightbox |
| `/projects` | `routes/projects.index.tsx` | Complete |
| `/projects/:slug` | `routes/projects.$slug.tsx` | Complete — layout map, gallery, timeline, enquiry |
| `/plots/:type` | `routes/plots.$type.tsx` | Complete — 5 filters, enquiry form |
| `/plots-in/:city` | `routes/plots-in.$city.tsx` | Built — SEO city landing pages |
| `/blog` | `routes/blog.index.tsx` | Built |
| `/blog/:slug` | `routes/blog.$slug.tsx` | Built |
| `/thank-you` | `routes/thank-you.tsx` | Built — post-enquiry confirmation |

### Admin panel — ALL BUILT

| Route | File | Status |
|-------|------|--------|
| `/admin/login` | `routes/admin.login.tsx` | Complete |
| `/admin` | `routes/admin.index.tsx` | Complete — KPI overview |
| `/admin/enquiries` | `routes/admin.enquiries.tsx` | Complete — table, status update, delete |
| `/admin/projects` | `routes/admin.projects.tsx` | Complete — CRUD |
| `/admin/blogs` | `routes/admin.blogs.tsx` | Complete — CMS |

### Shared components — ALL BUILT

| Component | Status | Notes |
|-----------|--------|-------|
| Header | Complete | Fixed, scrolled state, mobile drawer |
| Footer | Complete | 4-col grid |
| BrandLogo | Complete | Scrolled/default sizes |
| SectionHeader | Complete | center/left props |
| ProjectCard | Complete | Status badges, hover CTAs |
| EnquiryForm | Complete | compact/full modes |
| CallbackPopup | Complete | 500ms delay, every page load |
| ExitIntentPopup | Complete | Mouse-leave trigger (desktop) |
| SiteVisitModal | Complete | WhatsApp prefill |
| PlotROICalculator | Complete | Budget/city/years sliders, comparison bars |
| WhatsAppButton | Complete | Fixed floating |

---

## 10. KNOWN ISSUES & THINGS TO WATCH

1. **SiteVisitModal** — does not have `max-h-[90svh] overflow-y-auto` on the modal box. Fine currently (short form) but add it if content grows.

2. **Project images** — `project-2.jpg` is reused for both MK Royal Heights and MK Industrial Park. Real project images should replace these when available.

3. **Static data vs Supabase** — When Supabase is not configured (`isSupabaseConfigured = false`), the app uses static/localStorage data. This means admin project edits won't persist to the public site unless Supabase is connected.

4. **WhatsApp number** — Currently set to `+919999999999` (placeholder). Must be updated with the real MK Builders number in `WhatsAppButton.tsx`.

5. **Phone number** — `+91 99999 99999` appears in Footer and Contact page. Replace with the real number.

6. **Google Maps** — Contact page does not have an embedded map. Can be added in `contact.tsx`.

7. **Blog content** — `src/data/blog.ts` has static placeholder posts. Real content needs to be added via the admin CMS or Supabase.

8. **Sitemap** — `routes/sitemap[.]xml.ts` generates a sitemap. Verify the base URL is correct for production.

---

## 11. WHAT TO BUILD NEXT (PENDING)

The following features are not yet built:

- [ ] **Real project images** — Replace placeholder JPGs with actual MK Builders site photos
- [ ] **Real phone/WhatsApp number** — Update across Footer, Contact, WhatsAppButton
- [ ] **Map embed on Contact page** — Google Maps or Leaflet embed
- [ ] **Blog content** — Write and publish actual blog posts via admin
- [ ] **Supabase setup** — Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel environment variables
- [ ] **Supabase schema** — Create `projects`, `enquiries`, `blogs` tables in Supabase dashboard
- [ ] **Admin project CRUD** — Verify create/edit/delete project flow with real Supabase data
- [ ] **Image uploads** — Add Cloudinary or Supabase Storage upload for project gallery images in admin
- [ ] **OG image** — Create `/public/og-image.jpg` (1200×630) for social sharing
- [ ] **Favicon** — Verify `/public/favicon.png` and `/public/favicon.ico` are the real logo
- [ ] **RERA verification links** — Add actual RERA portal links to project RERA numbers
- [ ] **SSL / Custom domain** — Configure custom domain on Vercel
- [ ] **Analytics** — Add Plausible or Google Analytics
- [ ] **More projects** — Add 3–5 more real projects to the data

---

## 12. RULES FOR CLAUDE — ALWAYS FOLLOW

### Code style
- TypeScript strict — no `any` unless absolutely required
- Use `cn()` from `@/lib/utils` for conditional class names
- All data fetching through `src/lib/*.ts` — never call Supabase directly from components
- All routes use `createFileRoute` with `head()` for meta tags

### Design rules
- **Font**: Use `font-display` for all headings, `font-nav` for all buttons/nav/labels
- **Colour**: Only use defined CSS custom property tokens — no hardcoded hex except `#1C0624` (brand plum) and `#DFC160` (gold) where CSS vars aren't available
- **Gold accent**: Every page must have gold as the dominant accent — never change this
- **Dark theme**: The site is always dark. No light mode. Background is deep plum/near-black
- **Never use** white backgrounds, black text, or bright colours outside the design system

### Responsiveness rules (repeat — critical)
- Mobile-first: write base styles for 375px first
- Every interactive element minimum 44×44px touch target
- Every popup/modal must have `max-h-[90svh] overflow-y-auto`
- No horizontal scroll on any page
- Tables always wrapped in `overflow-x-auto`
- Hero sections use `-mt-20 md:-mt-[120px]` to bleed under the fixed header
- Stats grids: 5 items → `grid-cols-3 md:grid-cols-5` (not `grid-cols-2` which orphans the last item)

### Do not
- Do not edit files in `src/components/ui/` (shadcn components)
- Do not add new dependencies without asking
- Do not change the font system back to Inter/Cormorant/Plus Jakarta Sans
- Do not add hover-only interactions without active: equivalents (hover doesn't exist on mobile)
- Do not hard-code project data outside `src/data/projects.ts`
- Do not create new utility files for one-off operations

### Patterns to reuse
- `EnquiryForm` — reuse everywhere a lead form is needed
- `SectionHeader` — reuse for every section heading group
- `ProjectCard` — reuse everywhere a project listing appears
- `SiteLayout` — wrap every public page in this
- `fieldCls` constant in `EnquiryForm.tsx` — reuse the exact string for any new form fields

---

## 13. LAYOUT SHELL STRUCTURE

```
Every public page:
  <SiteLayout>
    ├── <Header />          fixed top, z-50, bg-[#1C0624]/90
    ├── <main>              pt-20 md:pt-[120px]
    │     {page content}
    ├── <Footer />
    ├── <WhatsAppButton />  fixed bottom-right, z-40
    ├── <ExitIntentPopup /> z-[100]
    └── <CallbackPopup />   z-[100], shows 500ms after mount, every page load

Admin panel:
  <AdminLayout>             auth guard, sidebar (md+) or top drawer (mobile)
    └── <Outlet />          admin page content
```

---

## 14. SEO PATTERN

Every route must export `head()`:
```tsx
head: () => ({
  meta: [
    { title: "Page Title | MK Builders & Developers" },
    { name: "description", content: "150-160 char description with city names" },
    { property: "og:title", content: "Page Title" },
    { property: "og:url", content: "/route-path" },
  ],
  links: [{ rel: "canonical", href: "/route-path" }],
}),
```

City names in descriptions help local SEO: include Bangalore, Mysore, Hubli, Tumkur, Karnataka.

---

## 15. DOCS REFERENCE

- Full design system: `docs/design-system.md`
- This file: `CLAUDE.md` (root of project)
