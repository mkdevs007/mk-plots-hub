import {
  createFileRoute,
  Link,
  notFound,
  useLocation,
} from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { SiteVisitModal } from "@/components/site/SiteVisitModal";
import {
  getProjectByLocationSlug,
  generateLocationSlug,
  generateProjectKeywords,
  parseApproval,
} from "@/lib/projects";
import { useState, useEffect, useRef } from "react";
import type { ComponentType } from "react";
import type { NearbyCategory, Project } from "@/data/projects";
import { captureUtm, fbqTrack, gtagEvent, getStoredUtm, formatUtmNote } from "@/lib/utm";
import {
  MapPin,
  Ruler,
  Shield,
  CheckCircle2,
  Download,
  ExternalLink,
  Plane,
  GraduationCap,
  HeartPulse,
  ShoppingBag,
  Route as RouteIcon,
  Train,
  Building2,
  TrendingUp,
  Home,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  Phone,
  Calendar,
  Star,
  ArrowRight,
  Layers,
  Clock,
} from "lucide-react";

// ─── Route ──────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/$locationProject")({
  staleTime: 0,
  loader: async ({ params }) => {
    const project = await getProjectByLocationSlug(params.locationProject);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    if (!p) return { meta: [] };

    const locationSlug = generateLocationSlug(p);
    const approval = parseApproval(p.rera);
    const areaMain = p.area.split(",")[0].trim();
    const typeLabel = p.type.charAt(0).toUpperCase() + p.type.slice(1);

    const title = `${approval.type} Approved ${typeLabel} Plots in ${areaMain}, ${p.city} | ${p.name} | MK Builders & Developers`;

    const nearbyStr = (p.nearbyPlaces ?? [])
      .slice(0, 3)
      .map((n) => n.name)
      .join(", ");
    const rawDesc = [
      p.description,
      `Plot sizes: ${p.sizes.join(", ")}.`,
      `${p.availablePlots} plots available.`,
      `${approval.type} Approved.`,
      p.startingPrice ? `Starting from ${p.startingPrice}.` : "",
      nearbyStr ? `Near ${nearbyStr}.` : "",
      "Book a free site visit today.",
    ]
      .filter(Boolean)
      .join(" ");

    const description = rawDesc.slice(0, 160);
    const keywords = generateProjectKeywords(p);

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: keywords },
        { property: "og:title", content: `${p.name} — ${approval.type} Plots in ${areaMain}, ${p.city}` },
        { property: "og:description", content: description },
        { property: "og:image", content: p.image },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `https://themkdevelopers.com/${locationSlug}` },
        { property: "og:locale", content: "en_IN" },
        { property: "og:site_name", content: "MK Builders & Developers" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${p.name} | MK Builders & Developers` },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: p.image },
        { name: "robots", content: "index, follow" },
        { name: "geo.region", content: "IN-KA" },
        { name: "geo.placename", content: `${p.area}, ${p.city}, Karnataka` },
      ],
      links: [
        { rel: "canonical", href: `https://themkdevelopers.com/${locationSlug}` },
      ],
    };
  },
  component: ProjectLandingPage,
});

// ─── Nearby category meta ────────────────────────────────────────────────────

const nearbyCategoryMeta: Record<
  NearbyCategory,
  { label: string; icon: ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  airport:  { label: "Airport",        icon: Plane,       color: "text-sky-600",    bg: "bg-sky-50 border-sky-200" },
  school:   { label: "School",         icon: GraduationCap, color: "text-blue-600",  bg: "bg-blue-50 border-blue-200" },
  hospital: { label: "Hospital",       icon: HeartPulse,  color: "text-red-600",    bg: "bg-red-50 border-red-200" },
  market:   { label: "Market",         icon: ShoppingBag, color: "text-amber-600",  bg: "bg-amber-50 border-amber-200" },
  highway:  { label: "Highway",        icon: RouteIcon,   color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
  railway:  { label: "Railway",        icon: Train,       color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
  it_park:  { label: "IT / Tech Park", icon: Building2,   color: "text-emerald-600",bg: "bg-emerald-50 border-emerald-200" },
  other:    { label: "Nearby Place",   icon: MapPin,      color: "text-[#512561]",  bg: "bg-[#F5F0F8] border-[#E8DCF0]" },
};

// ─── Investment reasons generator ────────────────────────────────────────────

function buildInvestmentReasons(p: Project) {
  const nearby = p.nearbyPlaces ?? [];
  const approval = parseApproval(p.rera);
  const reasons: { icon: ComponentType<{ className?: string }>; title: string; desc: string }[] = [];

  const transport = nearby.filter(n => n.category === "railway" || n.category === "airport" || n.category === "highway");
  if (transport.length > 0) {
    const main = transport[0];
    reasons.push({
      icon: RouteIcon,
      title: "Prime Connectivity",
      desc: `${main.name} is just ${main.distance} away — ensuring seamless daily commute and strong future price appreciation.`,
    });
  }

  reasons.push({
    icon: Shield,
    title: `${approval.type} Approved — Zero Legal Risk`,
    desc: `Clear title, transparent documentation, and ${approval.type} approval ensure a completely hassle-free registration and ownership experience.`,
  });

  const schools = nearby.filter(n => n.category === "school");
  const hospitals = nearby.filter(n => n.category === "hospital");
  if (schools.length > 0 || hospitals.length > 0) {
    const parts: string[] = [];
    if (schools.length > 0) parts.push(`${schools.length} reputed school${schools.length > 1 ? "s" : ""}`);
    if (hospitals.length > 0) parts.push(`${hospitals.length} hospital${hospitals.length > 1 ? "s" : ""}`);
    reasons.push({
      icon: Home,
      title: "Thriving Social Infrastructure",
      desc: `${parts.join(" and ")} within easy reach — everything your family needs is already established around the project.`,
    });
  }

  if (p.availablePlots > 0 && p.availablePlots < p.totalPlots * 0.5) {
    reasons.push({
      icon: TrendingUp,
      title: "High Demand — Limited Availability",
      desc: `Only ${p.availablePlots} of ${p.totalPlots} plots remain. Early movers secure the best plots at the best prices.`,
    });
  }

  return reasons.slice(0, 3);
}

// ─── Auto-FAQ generator ──────────────────────────────────────────────────────

function autoGenerateFaqs(p: Project): { question: string; answer: string }[] {
  const approval = parseApproval(p.rera);
  const areaMain = p.area.split(",")[0].trim();
  const typeLabel = p.type.charAt(0).toUpperCase() + p.type.slice(1);
  const nearbyNames = (p.nearbyPlaces ?? []).slice(0, 3).map(n => n.name);
  const faqs: { question: string; answer: string }[] = [];

  const priceAnswer = p.startingPrice && p.startingPrice !== "Sold Out"
    ? `Plots at ${p.name} start from ${p.startingPrice}. Available sizes: ${p.sizes.join(", ")}. Contact our team for the latest pricing and exact plot availability.`
    : `${p.name} is currently sold out. Please contact our team for upcoming projects in ${areaMain}, ${p.city}.`;
  faqs.push({ question: `What is the price of plots in ${areaMain}, ${p.city}?`, answer: priceAnswer });

  faqs.push({
    question: `Is ${p.name} ${approval.type} approved?`,
    answer: approval.number
      ? `Yes, ${p.name} is ${approval.type} approved (Approval No. ${approval.number}). All plots come with a clear title and complete documentation support for hassle-free registration.`
      : `${p.name} is ${approval.type} approved. All plots come with a clear title and complete documentation support for hassle-free registration.`,
  });

  if (p.amenities.length > 0) {
    faqs.push({
      question: `What amenities are available at ${p.name}?`,
      answer: `${p.name} offers: ${p.amenities.join(", ")}. All infrastructure is fully developed and ready for immediate construction.`,
    });
  }

  if (nearbyNames.length > 0) {
    faqs.push({
      question: `What is near ${p.name} in ${areaMain}?`,
      answer: `${p.name} is well-connected with key landmarks including ${nearbyNames.join(", ")}${p.landmark ? ` and is near ${p.landmark}` : ""}. The location provides strong connectivity and all daily essentials.`,
    });
  }

  faqs.push({
    question: `How do I book a site visit for ${p.name}?`,
    answer: `Fill the enquiry form on this page, call our team, or WhatsApp us directly. Our team will confirm a free site visit slot within 24 hours. Visits are available Monday to Saturday, 9 AM – 6 PM.`,
  });

  faqs.push({
    question: `Are the plots at ${p.name} suitable for construction?`,
    answer: `${p.name} is a ${typeLabel.toLowerCase()} layout in ${areaMain}, ${p.city}. The plots are ideal for constructing your home or investment property. The ${approval.type} approved layout ensures zero legal risk and smooth bank loan approvals.`,
  });

  return faqs;
}

// ─── FAQ Accordion ───────────────────────────────────────────────────────────

function FAQAccordion({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {faqs.map((faq, idx) => (
        <div
          key={idx}
          className={`rounded-xl border bg-white overflow-hidden transition-shadow duration-200 ${open === idx ? "shadow-card border-[#512561]/30" : "border-border shadow-sm"}`}
        >
          <button
            onClick={() => setOpen(open === idx ? null : idx)}
            className="w-full flex items-center justify-between px-5 py-4 text-left min-h-[52px] hover:bg-[#F5F0F8] transition-colors"
            aria-expanded={open === idx}
          >
            <span className="font-semibold text-sm text-foreground pr-4 font-sans">{faq.question}</span>
            <ChevronDown
              className={`w-4 h-4 shrink-0 text-[#512561] transition-transform duration-300 ${open === idx ? "rotate-180" : ""}`}
            />
          </button>
          {open === idx && (
            <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4 bg-[#F5F0F8]/40">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Scroll reveal hook ──────────────────────────────────────────────────────

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal,.reveal-left,.reveal-scale");
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ─── Eyebrow label ───────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="gold-divider" />
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#512561] font-nav">
        {children}
      </span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

function ProjectLandingPage() {
  const { project: p } = Route.useLoaderData();
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [nearbyFilter, setNearbyFilter] = useState<NearbyCategory | "all">("all");
  const location = useLocation();
  useScrollReveal();

  // Smooth scroll to anchor on load
  useEffect(() => {
    const hash = window.location.hash || location.hash;
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        const t = setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
        return () => clearTimeout(t);
      }
    }
  }, [location.hash]);

  // Analytics — fire on every project page view
  useEffect(() => {
    // Project pages are high-intent — always show the callback popup regardless
    // of whether it was dismissed on a previous page in this session
    sessionStorage.removeItem("mk_callback_popup_dismissed");
    captureUtm();
    fbqTrack("ViewContent", {
      content_name: p.name,
      content_ids: [p.slug],
      content_type: "product",
      content_category: p.type,
      value: p.priceLakh ?? 0,
      currency: "INR",
    });
    gtagEvent("view_item", {
      currency: "INR",
      value: p.priceLakh ?? 0,
      items: [{
        item_id: p.slug,
        item_name: p.name,
        item_category: p.type,
        item_variant: p.area,
        price: p.priceLakh ?? 0,
      }],
    });
  }, [p.slug]);

  const approval = parseApproval(p.rera);
  const areaMain = p.area.split(",")[0].trim();
  const locationSlug = generateLocationSlug(p);
  const sold = p.totalPlots - p.availablePlots;
  const investmentReasons = buildInvestmentReasons(p);
  const typeLabel = p.type.charAt(0).toUpperCase() + p.type.slice(1);
  const displayFaqs = (p.faqs && p.faqs.length > 0) ? p.faqs : autoGenerateFaqs(p);
  const utmNote = formatUtmNote(getStoredUtm());

  // Nearby places filter
  const nearbyCategories = [...new Set((p.nearbyPlaces ?? []).map(n => n.category))];
  const filteredNearby = nearbyFilter === "all"
    ? (p.nearbyPlaces ?? [])
    : (p.nearbyPlaces ?? []).filter(n => n.category === nearbyFilter);

  const BASE = "https://themkdevelopers.com";

  // JSON-LD structured data — inline for SSR guarantee
  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateListing",
        name: p.name,
        description: p.description,
        url: `${BASE}/${locationSlug}`,
        image: p.image,
        address: {
          "@type": "PostalAddress",
          streetAddress: p.area,
          addressLocality: p.city,
          addressRegion: "Karnataka",
          addressCountry: "IN",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          ...(p.priceLakh ? { price: p.priceLakh * 100000 } : {}),
          availability: p.availablePlots > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/SoldOut",
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": `${BASE}/#organization`,
        name: "MK Builders & Developers",
        url: BASE,
        telephone: "+919900000000",
        address: { "@type": "PostalAddress", addressLocality: p.city, addressRegion: "Karnataka", addressCountry: "IN" },
        areaServed: { "@type": "City", name: p.city },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home",     item: `${BASE}/` },
          { "@type": "ListItem", position: 2, name: "Projects", item: `${BASE}/projects` },
          { "@type": "ListItem", position: 3, name: p.city,     item: `${BASE}/plots-in/${p.city.toLowerCase()}` },
          { "@type": "ListItem", position: 4, name: p.name,     item: `${BASE}/${locationSlug}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: displayFaqs.map(faq => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  const statusBadgeClass =
    p.status === "Ongoing" ? "bg-badge-ongoing-bg text-badge-ongoing-fg" :
    p.status === "New Launch" ? "bg-badge-new-bg text-badge-new-fg" :
    p.status === "Few Plots Left" ? "bg-badge-few-bg text-badge-few-fg" :
    "bg-badge-done-bg text-badge-done-fg";

  return (
    <SiteLayout>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />

      {/* ════════════════════════════════════════════════════════════
          HERO — Full viewport
      ════════════════════════════════════════════════════════════ */}
      <section className="relative h-[90vh] min-h-[600px] max-h-[860px] overflow-hidden">
        {/* Hero image */}
        <img
          src={p.image}
          alt={`${p.name} — ${typeLabel} plots in ${p.area}, ${p.city}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 hero-overlay" />

        {/* Subtle diagonal texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-between pt-24 md:pt-28 pb-24 md:pb-20 px-5 md:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="breadcrumb"
            className="flex items-center gap-1.5 text-[11px] font-nav font-semibold uppercase tracking-[0.18em] text-white/55"
          >
            <Link to="/" className="hover:text-gold transition-colors flex items-center gap-1">
              <Home className="w-3 h-3" /> Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/projects/" className="hover:text-gold transition-colors">Projects</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/plots-in/$city" params={{ city: p.city.toLowerCase() }} className="hover:text-gold transition-colors">
              {p.city}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/35 truncate max-w-[120px] md:max-w-none">{p.name}</span>
          </nav>

          {/* Main hero content */}
          <div className="max-w-4xl">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-3 mb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <span className={`px-3 py-1 rounded-full text-xs font-bold font-nav ${statusBadgeClass}`}>
                {p.status}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold font-nav bg-gold/20 text-gold border border-gold/30 backdrop-blur-sm">
                ✦ {approval.type} Approved
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold font-nav bg-white/10 text-white/80 border border-white/15 backdrop-blur-sm">
                {typeLabel} Plots
              </span>
            </div>

            {/* Project name */}
            <h1
              className="font-display text-5xl sm:text-6xl md:text-7xl text-white leading-none tracking-tight animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              {p.name}
            </h1>

            {/* Location */}
            <p
              className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-white/75 text-sm font-nav animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gold shrink-0" />
                {p.area}, {p.city}, Karnataka
                {p.landmark ? ` — ${p.landmark}` : ""}
              </span>
              {p.mapLink && (
                <a
                  href={p.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-gold hover:text-gold/80 bg-gold/10 border border-gold/25 px-3 py-1 rounded-full transition-colors"
                >
                  <ExternalLink className="w-3 h-3" /> View on Map
                </a>
              )}
            </p>

            {/* Price */}
            {p.startingPrice && p.startingPrice !== "Sold Out" && (
              <p
                className="mt-2 font-display text-2xl md:text-3xl text-gold animate-fade-up"
                style={{ animationDelay: "0.35s" }}
              >
                Starting {p.startingPrice}
              </p>
            )}

            {/* Hero CTAs */}
            <div
              className="mt-5 flex flex-wrap sm:flex-row gap-3 animate-fade-up"
              style={{ animationDelay: "0.45s" }}
            >
              {p.status !== "Completed" && (
                <button
                  onClick={() => setIsVisitModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full gold-gradient text-gold-foreground font-bold font-nav text-sm hover:opacity-95 hover:scale-[1.02] transition-all shadow-lg min-h-[44px]"
                >
                  <Calendar className="w-4 h-4" /> Book Free Site Visit
                </button>
              )}
              <a
                href={`https://wa.me/917090090057?text=${encodeURIComponent(`Hi, I'm interested in ${p.name} (${p.area}, ${p.city}). Please share pricing and availability.${utmNote}`)}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => { fbqTrack("Lead", { content_name: p.name }); gtagEvent("generate_lead", { project: p.name, method: "whatsapp_hero" }); }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-whatsapp text-white font-bold font-nav text-sm hover:opacity-90 transition-all shadow-lg min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
              </a>
              <a
                href="#enquiry"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border-2 border-white/50 text-white font-bold font-nav text-sm hover:bg-white/10 transition-all min-h-[44px]"
              >
                Enquire Now
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="self-center text-white/40 animate-bounce-soft hidden md:flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-nav uppercase tracking-widest">Scroll</span>
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          STATS STRIP — floating card between hero and content
      ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 -mt-10 px-5 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto bg-primary rounded-2xl py-6 px-6 md:px-10 shadow-[0_8px_40px_rgba(81,37,97,0.35)] border border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Layers,       label: "Total Plots",            value: String(p.totalPlots) },
              { icon: CheckCircle2, label: "Available Now",          value: p.availablePlots > 0 ? String(p.availablePlots) : "Sold Out" },
              { icon: MapPin,       label: "Starting Price",         value: p.startingPrice ?? "On Request" },
              { icon: Shield,       label: `${approval.type} Status`, value: "Approved" },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <s.icon className="w-5 h-5 text-gold" />
                </span>
                <div>
                  <div className="font-display text-xl text-white leading-none">{s.value}</div>
                  <div className="text-[10px] font-nav uppercase tracking-wider text-white/50 mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          MAIN CONTENT — two-column on desktop
      ════════════════════════════════════════════════════════════ */}
      <section className="pt-16 pb-28 md:py-24 px-5 md:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_380px] gap-12 xl:gap-16">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-20">

            {/* ABOUT ────────────────────────────────────────────── */}
            <div className="reveal">
              <Eyebrow>About the Layout</Eyebrow>
              <h2 className="font-display text-4xl md:text-5xl text-foreground mt-1">
                {typeLabel} Plots in {areaMain}, {p.city}
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed text-lg max-w-2xl">
                {p.description}
              </p>

              {/* Quick highlights */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "Total Plots", value: String(p.totalPlots) },
                  { label: "Available", value: String(p.availablePlots) },
                  { label: "Plot Sizes", value: p.sizes[0] + (p.sizes.length > 1 ? " +" : "") },
                  { label: "Type", value: typeLabel },
                  { label: "Approval", value: approval.type },
                  { label: "City", value: p.city },
                ].map((h, i) => (
                  <div
                    key={h.label}
                    className={`reveal-scale stagger-${Math.min(i + 1, 4)} bg-white rounded-xl p-4 border border-border shadow-sm text-center`}
                  >
                    <div className="font-display text-2xl text-[#512561]">{h.value}</div>
                    <div className="text-xs font-nav uppercase tracking-wider text-muted-foreground mt-1">{h.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* WHY INVEST ──────────────────────────────────────── */}
            {investmentReasons.length > 0 && (
              <div>
                <div className="reveal">
                  <Eyebrow>Why Invest Here</Eyebrow>
                  <h2 className="font-display text-4xl md:text-5xl text-foreground mt-1">
                    Why {areaMain} is a Smart Buy
                  </h2>
                </div>
                <div className="mt-8 grid gap-6 md:grid-cols-3">
                  {investmentReasons.map((r, i) => (
                    <div
                      key={i}
                      className={`reveal stagger-${i + 1} group bg-white rounded-2xl p-6 border border-border shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4`}
                    >
                      <span className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center group-hover:scale-110 transition-transform">
                        <r.icon className="w-6 h-6 text-gold-foreground" />
                      </span>
                      <div>
                        <h3 className="font-display text-xl text-foreground">{r.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIDEOS ──────────────────────────────────────────── */}
            {(p.videoUrl || (p.galleryVideos && p.galleryVideos.length > 0)) && (
              <div className="reveal">
                <Eyebrow>Site Walkthrough</Eyebrow>
                <h2 className="font-display text-4xl text-foreground mt-1 mb-6">Drone Tour & Videos</h2>
                <div className="space-y-6">
                  {p.videoUrl && (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-card-hover border border-border bg-[#EDE7F5]">
                      <video src={p.videoUrl} controls playsInline className="w-full h-full object-cover" poster={p.image} />
                    </div>
                  )}
                  {p.galleryVideos && p.galleryVideos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {p.galleryVideos.map((vUrl, idx) => (
                        <div key={vUrl} className="relative aspect-video rounded-2xl overflow-hidden shadow-card border border-border bg-[#EDE7F5]">
                          <video src={vUrl} controls playsInline className="w-full h-full object-cover" poster={p.image} />
                          <div className="absolute top-3 left-3 bg-[#512561]/80 backdrop-blur-sm text-white text-[10px] font-bold font-nav tracking-widest px-2.5 py-1 rounded-full uppercase">
                            Walkthrough #{idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* GALLERY ─────────────────────────────────────────── */}
            {p.galleryImages && p.galleryImages.length > 0 && (
              <div>
                <div className="reveal">
                  <Eyebrow>Site Gallery</Eyebrow>
                  <h2 className="font-display text-4xl text-foreground mt-1 mb-6">Gallery & Layout Views</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {p.galleryImages.map((imgUrl, idx) => (
                    <a
                      key={imgUrl}
                      href={imgUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`reveal-scale stagger-${Math.min((idx % 4) + 1, 4)} relative overflow-hidden rounded-2xl group aspect-[4/3] border border-border shadow-sm block bg-[#EDE7F5]`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${p.name} — site photo ${idx + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-[#512561]/0 group-hover:bg-[#512561]/20 transition-colors duration-300" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* PLOT SIZES & PRICING ────────────────────────────── */}
            <div id="layout-map" className="reveal scroll-mt-28">
              <Eyebrow>Pricing & Availability</Eyebrow>
              <h2 className="font-display text-4xl text-foreground mt-1 mb-6">Plot Sizes & Pricing</h2>
              <div className="overflow-x-auto rounded-2xl border border-border shadow-card">
                <table className="w-full text-sm bg-white">
                  <thead className="bg-[#F5F0F8] text-left border-b border-border">
                    <tr>
                      <th className="px-5 py-4 font-semibold font-nav text-[#512561]">Plot Size</th>
                      <th className="px-5 py-4 font-semibold font-nav text-[#512561]">Price</th>
                      <th className="px-5 py-4 font-semibold font-nav text-[#512561]">Availability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(p.sizePrices && p.sizePrices.length > 0
                      ? p.sizePrices
                      : p.sizes.map((size, i) => ({
                          size,
                          price: (() => {
                            if (p.priceLakh && p.priceLakh > 0) return `From ₹${p.priceLakh + i * 4} Lakh`;
                            return p.status === "Completed" || p.startingPrice === "Sold Out" ? "Sold Out" : "Contact Us";
                          })(),
                        }))
                    ).map((row, idx) => (
                      <tr key={row.size} className={`hover:bg-[#F5F0F8]/50 transition-colors`}>
                        <td className="px-5 py-4 font-semibold text-foreground">{row.size}</td>
                        <td className="px-5 py-4 font-medium text-[#512561]">{row.price}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold font-nav ${
                            p.status === "Completed" || p.startingPrice === "Sold Out"
                              ? "bg-badge-done-bg text-badge-done-fg"
                              : "bg-badge-ongoing-bg text-badge-ongoing-fg"
                          }`}>
                            {p.status === "Completed" || p.startingPrice === "Sold Out" ? "Sold Out" : "Available"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-muted-foreground font-nav">
                {sold > 0 ? `${sold} of ${p.totalPlots} plots already booked.` : ""} Pricing confirmed at site visit.
              </p>
            </div>

            {/* AMENITIES ───────────────────────────────────────── */}
            <div className="reveal">
              <Eyebrow>Infrastructure & Amenities</Eyebrow>
              <h2 className="font-display text-4xl text-foreground mt-1 mb-6">What's Included</h2>
              <div className="flex flex-wrap gap-3">
                {p.amenities.map((a, i) => (
                  <span
                    key={a}
                    className={`reveal stagger-${Math.min((i % 4) + 1, 4)} inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-border shadow-sm text-sm font-medium text-foreground hover:border-[#512561]/30 hover:shadow-md transition-all`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#512561] shrink-0" /> {a}
                  </span>
                ))}
              </div>
            </div>

            {/* WHAT'S NEARBY ───────────────────────────────────── */}
            {p.nearbyPlaces && p.nearbyPlaces.length > 0 && (
              <div>
                <div className="reveal">
                  <Eyebrow>Location Advantage</Eyebrow>
                  <h2 className="font-display text-4xl text-foreground mt-1 mb-6">What's Nearby</h2>
                  {/* Category filter tabs */}
                  {nearbyCategories.length > 1 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      <button
                        onClick={() => setNearbyFilter("all")}
                        className={`px-4 py-2 rounded-full text-xs font-bold font-nav transition-all ${nearbyFilter === "all" ? "bg-primary text-white shadow-md" : "bg-white border border-border text-muted-foreground hover:border-[#512561]/30"}`}
                      >
                        All
                      </button>
                      {nearbyCategories.map(cat => {
                        const meta = nearbyCategoryMeta[cat as NearbyCategory] ?? nearbyCategoryMeta.other;
                        return (
                          <button
                            key={cat}
                            onClick={() => setNearbyFilter(cat as NearbyCategory)}
                            className={`px-4 py-2 rounded-full text-xs font-bold font-nav transition-all ${nearbyFilter === cat ? "bg-primary text-white shadow-md" : "bg-white border border-border text-muted-foreground hover:border-[#512561]/30"}`}
                          >
                            {meta.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredNearby.map((place, idx) => {
                    const meta = nearbyCategoryMeta[place.category as NearbyCategory] ?? nearbyCategoryMeta.other;
                    const Icon = meta.icon;
                    return (
                      <div
                        key={idx}
                        className={`reveal stagger-${Math.min((idx % 4) + 1, 4)} flex items-center gap-4 p-4 rounded-xl bg-white border shadow-sm hover:shadow-card transition-all duration-200 ${meta.bg}`}
                      >
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white shadow-sm`}>
                          <Icon className={`w-5 h-5 ${meta.color}`} />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">{place.name}</p>
                          <p className="text-xs text-muted-foreground font-nav uppercase tracking-wider mt-0.5">{meta.label}</p>
                        </div>
                        <span className="shrink-0 text-xs font-bold font-nav px-2.5 py-1 rounded-full bg-[#512561] text-white">
                          {place.distance}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {p.mapLink && (
                  <a
                    href={p.mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full border-2 border-[#512561] text-[#512561] font-bold font-nav text-sm hover:bg-[#512561] hover:text-white transition-all"
                  >
                    <ExternalLink className="w-4 h-4" /> Open on Google Maps
                  </a>
                )}
              </div>
            )}

            {/* CONSTRUCTION TIMELINE ───────────────────────────── */}
            {p.progressTimeline && p.progressTimeline.length > 0 && (
              <div className="reveal">
                <Eyebrow>Construction Progress</Eyebrow>
                <h2 className="font-display text-4xl text-foreground mt-1 mb-8">Project Timeline</h2>
                <div className="relative border-l-2 border-[#512561]/20 ml-5 space-y-8">
                  {p.progressTimeline.map((item, idx) => (
                    <div key={idx} className={`reveal-left stagger-${Math.min(idx + 1, 4)} relative pl-8`}>
                      <span className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${item.done ? "bg-[#512561]" : "bg-[#EDE7F5] border-[#512561]/30"}`} />
                      <span className="text-xs font-bold font-nav text-[#512561] uppercase tracking-wider">{item.date}</span>
                      <h4 className="font-display text-xl text-foreground mt-0.5 flex items-center gap-2">
                        {item.title}
                        {item.done && (
                          <span className="text-[10px] bg-badge-ongoing-bg text-badge-ongoing-fg px-2 py-0.5 rounded font-nav font-bold uppercase">Done</span>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ ─────────────────────────────────────────────── */}
            <div className="reveal">
              <Eyebrow>Frequently Asked Questions</Eyebrow>
              <h2 className="font-display text-4xl text-foreground mt-1 mb-8">
                Questions about {p.name}
              </h2>
              <FAQAccordion faqs={displayFaqs} />
            </div>

            {/* DOCUMENTS ───────────────────────────────────────── */}
            <div className="reveal">
              <div className="bg-[#F5F0F8] rounded-2xl p-6 border border-[#512561]/15 flex flex-wrap items-center justify-between gap-5">
                <div>
                  <h3 className="font-display text-2xl text-foreground">Layout Plan & Documents</h3>
                  {approval.number ? (
                    <p className="text-sm text-muted-foreground mt-1 font-nav">
                      {approval.type} Approval No: <span className="font-semibold text-[#512561]">{approval.number}</span>
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1 font-nav">{approval.type} Approved</p>
                  )}
                </div>
                {p.layoutPdfUrl ? (
                  <a
                    href={p.layoutPdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full gold-gradient text-gold-foreground font-bold font-nav text-sm hover:opacity-95 transition-all shadow-md"
                  >
                    <Download className="w-4 h-4" /> Download Layout PDF
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-border text-muted-foreground font-nav text-sm">
                    <Download className="w-4 h-4" /> PDF Coming Soon
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN — Sticky enquiry sidebar ── */}
          <aside id="enquiry" className="lg:sticky lg:top-28 self-start scroll-mt-24 space-y-4">
            {/* Enquiry card */}
            <div className="bg-white rounded-2xl shadow-card-hover border border-border overflow-hidden">
              {/* Card header — plum strip */}
              <div className="bg-primary px-6 py-5">
                <h3 className="font-display text-2xl text-white">Enquire about {p.name}</h3>
                <p className="text-sm text-white/70 mt-1 font-nav">
                  Get availability, pricing & a free site visit slot.
                </p>
              </div>
              <div className="p-6">
                <EnquiryForm compact projectName={p.name} />
              </div>
            </div>

            {/* Site visit button */}
            {p.status !== "Completed" && (
              <button
                onClick={() => setIsVisitModalOpen(true)}
                className="w-full min-h-[52px] py-3 border-2 border-[#512561] text-[#512561] hover:bg-[#512561] hover:text-white font-bold font-nav rounded-xl transition-all text-sm flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" /> Book Free Site Visit
              </button>
            )}

            {/* Quick contact */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href="tel:+917090090057"
                className="flex items-center justify-center gap-2 min-h-[48px] rounded-xl bg-white border border-border text-foreground hover:border-[#512561]/40 hover:shadow-card transition-all text-sm font-bold font-nav shadow-sm"
              >
                <Phone className="w-4 h-4 text-[#512561]" /> Call Now
              </a>
              <a
                href={`https://wa.me/917090090057?text=${encodeURIComponent(`Hi, I'm interested in ${p.name} (${p.area}, ${p.city}). Please share pricing and availability.${utmNote}`)}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => { fbqTrack("Lead", { content_name: p.name }); gtagEvent("generate_lead", { project: p.name, method: "whatsapp" }); }}
                className="flex items-center justify-center gap-2 min-h-[48px] rounded-xl bg-whatsapp/10 border border-whatsapp/30 text-whatsapp hover:bg-whatsapp hover:text-white transition-all text-sm font-bold font-nav"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>

            {/* Availability bar */}
            {p.totalPlots > 0 && (
              <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
                <div className="flex justify-between text-xs font-nav font-semibold mb-2">
                  <span className="text-[#512561]">{p.availablePlots} plots available</span>
                  <span className="text-muted-foreground">{p.totalPlots} total</span>
                </div>
                <div className="h-2 rounded-full bg-[#EDE7F5] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#512561] transition-all duration-700"
                    style={{ width: `${Math.max(4, ((p.totalPlots - p.availablePlots) / p.totalPlots) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-nav">
                  {Math.round(((p.totalPlots - p.availablePlots) / p.totalPlots) * 100)}% booked
                </p>
              </div>
            )}

            <Link
              to="/projects/"
              className="block text-center text-sm text-muted-foreground hover:text-[#512561] transition-colors font-nav py-1"
            >
              ← View all projects
            </Link>
          </aside>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CTA STRIP — plum gradient
      ════════════════════════════════════════════════════════════ */}
      {p.status !== "Completed" && (
        <section className="py-20 md:py-28 px-5 md:px-8 plum-gradient relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="gold-divider" />
              <span className="text-xs font-bold font-nav uppercase tracking-[0.25em] text-gold">Talk to Our Team</span>
              <span className="gold-divider" />
            </div>
            <h2 className="font-display text-5xl md:text-6xl text-white">
              Interested in {p.name}?
            </h2>
            <p className="mt-4 text-white/70 max-w-xl mx-auto font-nav leading-relaxed">
              Our site team is available 9 AM – 7 PM, Monday to Saturday.
              Message us on WhatsApp for instant pricing and plot availability.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/917090090057?text=${encodeURIComponent(`Hi, I'm interested in ${p.name} (${p.area}, ${p.city}). Please share details.${utmNote}`)}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => { fbqTrack("Lead", { content_name: p.name }); gtagEvent("generate_lead", { project: p.name, method: "whatsapp_cta" }); }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-whatsapp text-white font-bold font-nav text-base hover:opacity-90 transition min-h-[52px] shadow-lg"
              >
                <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
              </a>
              <button
                onClick={() => setIsVisitModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full gold-gradient text-gold-foreground font-bold font-nav text-base hover:opacity-95 hover:scale-[1.02] transition min-h-[52px] shadow-lg"
              >
                <Calendar className="w-5 h-5" /> Book Free Site Visit
              </button>
              <a
                href="tel:+917090090057"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white/40 text-white font-bold font-nav text-base hover:bg-white/10 transition min-h-[52px]"
              >
                <Phone className="w-5 h-5" /> Call Us
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          MOBILE STICKY BOTTOM BAR
      ════════════════════════════════════════════════════════════ */}
      {p.status !== "Completed" && (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-border px-4 py-3 flex gap-3 safe-bottom shadow-[0_-4px_20px_rgba(81,37,97,0.12)]">
          <a
            href="tel:+917090090057"
            className="flex-1 flex items-center justify-center gap-2 min-h-[44px] rounded-full border-2 border-[#512561] text-[#512561] font-bold font-nav text-sm"
          >
            <Phone className="w-4 h-4" /> Call
          </a>
          <a
            href={`https://wa.me/917090090057?text=${encodeURIComponent(`Hi, I'm interested in ${p.name} at ${p.area}, ${p.city}. Please share pricing.${utmNote}`)}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => { fbqTrack("Lead", { content_name: p.name }); gtagEvent("generate_lead", { project: p.name, method: "whatsapp_mobile" }); }}
            className="flex-1 flex items-center justify-center gap-2 min-h-[44px] rounded-full bg-whatsapp text-white font-bold font-nav text-sm"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
          <a
            href="#enquiry"
            className="flex-1 flex items-center justify-center gap-2 min-h-[44px] rounded-full gold-gradient text-gold-foreground font-bold font-nav text-sm"
          >
            Enquire
          </a>
        </div>
      )}

      {/* Site visit modal */}
      <SiteVisitModal
        projectName={p.name}
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
      />
    </SiteLayout>
  );
}
