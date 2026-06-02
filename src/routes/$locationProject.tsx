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
import { useState, useEffect } from "react";
import type { ComponentType } from "react";
import type { NearbyCategory, Project } from "@/data/projects";
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
  MessageCircle,
  Phone,
  Calendar,
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
    const typeLabel =
      p.type.charAt(0).toUpperCase() + p.type.slice(1);

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

    const jsonLd: Record<string, unknown>[] = [
      {
        "@type": "RealEstateListing",
        name: p.name,
        description: p.description,
        url: `https://themkdevelopers.com/${locationSlug}`,
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
          availability:
            p.availablePlots > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/SoldOut",
        },
      },
    ];

    if (p.faqs && p.faqs.length > 0) {
      jsonLd.push({
        "@type": "FAQPage",
        mainEntity: p.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      });
    }

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: keywords },
        {
          property: "og:title",
          content: `${p.name} — ${approval.type} Plots in ${areaMain}, ${p.city}`,
        },
        { property: "og:description", content: description },
        { property: "og:image", content: p.image },
        { property: "og:type", content: "website" },
        {
          property: "og:url",
          content: `https://themkdevelopers.com/${locationSlug}`,
        },
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
  {
    label: string;
    icon: ComponentType<{ className?: string }>;
    color: string;
    bg: string;
  }
> = {
  airport: { label: "Airport", icon: Plane, color: "text-sky-500", bg: "bg-sky-500/10" },
  school: { label: "School", icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-500/10" },
  hospital: { label: "Hospital", icon: HeartPulse, color: "text-red-500", bg: "bg-red-500/10" },
  market: { label: "Market", icon: ShoppingBag, color: "text-amber-500", bg: "bg-amber-500/10" },
  highway: { label: "Highway", icon: RouteIcon, color: "text-orange-500", bg: "bg-orange-500/10" },
  railway: { label: "Railway", icon: Train, color: "text-purple-500", bg: "bg-purple-500/10" },
  it_park: { label: "IT / Tech Park", icon: Building2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  other: { label: "Nearby Place", icon: MapPin, color: "text-gold", bg: "bg-gold/10" },
};

// ─── Investment reasons generator ────────────────────────────────────────────

function buildInvestmentReasons(p: Project) {
  const nearby = p.nearbyPlaces ?? [];
  const approval = parseApproval(p.rera);
  const reasons: { icon: ComponentType<{ className?: string }>; title: string; desc: string }[] =
    [];

  const transport = nearby.filter(
    (n) =>
      n.category === "railway" ||
      n.category === "airport" ||
      n.category === "highway",
  );
  if (transport.length > 0) {
    const main = transport[0];
    reasons.push({
      icon: RouteIcon,
      title: "Excellent Connectivity",
      desc: `${main.name} is just ${main.distance} away — ensuring seamless commute and strong future price appreciation.`,
    });
  }

  reasons.push({
    icon: Shield,
    title: `${approval.type} Approved — Zero Legal Risk`,
    desc: `Clear title, transparent documentation, and ${approval.type} approval ensure a completely hassle-free registration and ownership experience.`,
  });

  const schools = nearby.filter((n) => n.category === "school");
  const hospitals = nearby.filter((n) => n.category === "hospital");
  if (schools.length > 0 || hospitals.length > 0) {
    const parts: string[] = [];
    if (schools.length > 0) parts.push(`${schools.length} reputed school${schools.length > 1 ? "s" : ""}`);
    if (hospitals.length > 0) parts.push(`${hospitals.length} hospital${hospitals.length > 1 ? "s" : ""}`);
    reasons.push({
      icon: Home,
      title: "Thriving Social Infrastructure",
      desc: `${parts.join(" and ")} within easy reach — everything your family needs is already in place around the project.`,
    });
  }

  if (p.availablePlots > 0 && p.availablePlots < p.totalPlots * 0.5) {
    reasons.push({
      icon: TrendingUp,
      title: "High Demand — Limited Availability",
      desc: `Only ${p.availablePlots} of ${p.totalPlots} plots remain. Early movers secure the best plots at the lowest prices.`,
    });
  }

  return reasons.slice(0, 3);
}

// ─── FAQ Accordion ───────────────────────────────────────────────────────────

function FAQAccordion({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {faqs.map((faq, idx) => (
        <div key={idx} className="rounded-xl border border-border bg-card overflow-hidden">
          <button
            onClick={() => setOpen(open === idx ? null : idx)}
            className="w-full flex items-center justify-between px-5 py-4 text-left min-h-[52px] hover:bg-secondary/40 transition-colors"
            aria-expanded={open === idx}
          >
            <span className="font-semibold text-sm text-foreground pr-4">{faq.question}</span>
            <ChevronRight
              className={`w-4 h-4 shrink-0 text-gold transition-transform duration-200 ${open === idx ? "rotate-90" : ""}`}
            />
          </button>
          {open === idx && (
            <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

function ProjectLandingPage() {
  const { project: p } = Route.useLoaderData();
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const location = useLocation();

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

  const approval = parseApproval(p.rera);
  const areaMain = p.area.split(",")[0].trim();
  const locationSlug = generateLocationSlug(p);
  const sold = p.totalPlots - p.availablePlots;
  const investmentReasons = buildInvestmentReasons(p);
  const typeLabel = p.type.charAt(0).toUpperCase() + p.type.slice(1);

  // JSON-LD injected inline for guaranteed SSR delivery
  const jsonLdParts: Record<string, unknown>[] = [
    {
      "@type": "RealEstateListing",
      name: p.name,
      description: p.description,
      url: `https://themkdevelopers.com/${locationSlug}`,
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
        availability:
          p.availablePlots > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/SoldOut",
      },
    },
  ];
  if (p.faqs && p.faqs.length > 0) {
    jsonLdParts.push({
      "@type": "FAQPage",
      mainEntity: p.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
  }

  return (
    <SiteLayout>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": jsonLdParts,
          }),
        }}
      />

      {/* ── Hero ── */}
      <section className="relative -mt-20 md:-mt-[120px] h-[75vh] min-h-[500px] overflow-hidden">
        <img
          src={p.image}
          alt={`${p.name} — ${typeLabel} plots in ${p.area}, ${p.city}`}
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-between pt-28 md:pt-36 pb-14 px-5 md:px-8 text-primary-foreground">
          {/* Breadcrumb */}
          <nav
            aria-label="breadcrumb"
            className="flex items-center gap-1.5 text-[11px] font-nav font-semibold uppercase tracking-[0.2em] text-primary-foreground/60"
          >
            <Link to="/" className="hover:text-gold transition-colors flex items-center gap-1">
              <Home className="w-3 h-3" /> Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/projects/" className="hover:text-gold transition-colors">
              Projects
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              to="/plots-in/$city"
              params={{ city: p.city.toLowerCase() }}
              className="hover:text-gold transition-colors"
            >
              {p.city}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary-foreground/40 truncate max-w-[120px] md:max-w-none">
              {p.name}
            </span>
          </nav>

          {/* Title block */}
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold font-nav ${
                  p.status === "Ongoing"
                    ? "bg-badge-ongoing-bg text-badge-ongoing-fg"
                    : p.status === "New Launch"
                      ? "bg-badge-new-bg text-badge-new-fg"
                      : p.status === "Few Plots Left"
                        ? "bg-badge-few-bg text-badge-few-fg"
                        : "bg-badge-done-bg text-badge-done-fg"
                }`}
              >
                {p.status}
              </span>
              <span className="text-gold text-xs font-semibold font-nav tracking-[0.25em] uppercase">
                {approval.type} Approved
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl leading-none">{p.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
              <p className="text-primary-foreground/80 flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gold shrink-0" />
                {p.area}, {p.city}, Karnataka
                {p.landmark ? ` — ${p.landmark}` : ""}
              </p>
              {p.mapLink && (
                <a
                  href={p.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-nav font-bold text-gold hover:text-gold/90 bg-gold/10 hover:bg-gold/20 border border-gold/20 hover:border-gold/30 transition-all px-3 py-1 rounded-full backdrop-blur-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View on Google Maps
                </a>
              )}
            </div>
            {p.startingPrice && p.startingPrice !== "Sold Out" && (
              <p className="mt-4 text-2xl md:text-3xl font-display text-gold">
                Starting {p.startingPrice}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-primary border-b border-border py-5 px-5 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Ruler, label: "Total Plots", value: String(p.totalPlots) },
            {
              icon: CheckCircle2,
              label: "Available Now",
              value: p.availablePlots > 0 ? String(p.availablePlots) : "Sold Out",
            },
            {
              icon: MapPin,
              label: "Starting Price",
              value: p.startingPrice ?? "On Request",
            },
            {
              icon: Shield,
              label: `${approval.type} Status`,
              value: p.rera ? "Approved" : "Under Process",
            },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                <s.icon className="w-4 h-4 text-gold" />
              </span>
              <div>
                <div className="font-display text-xl text-primary-foreground">{s.value}</div>
                <div className="text-[10px] font-nav uppercase tracking-wider text-primary-foreground/50">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Main content + sticky sidebar ── */}
      <section className="py-16 px-5 md:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_380px] gap-12">

          {/* LEFT — Main content */}
          <div>

            {/* About */}
            <div>
              <span className="text-gold text-xs font-semibold font-nav tracking-[0.25em] uppercase">
                About The Layout
              </span>
              <h2 className="font-display text-3xl md:text-4xl mt-2">
                {typeLabel} Plots in {areaMain}, {p.city}
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed text-lg">{p.description}</p>
            </div>

            {/* Investment reasons */}
            {investmentReasons.length > 0 && (
              <div className="mt-14 border-t border-border pt-14">
                <span className="text-gold text-xs font-semibold font-nav tracking-[0.25em] uppercase">
                  Why Invest Here
                </span>
                <h2 className="font-display text-3xl mt-2">
                  Why {areaMain} is a Smart Buy
                </h2>
                <div className="mt-8 grid gap-6 md:grid-cols-3">
                  {investmentReasons.map((r, i) => (
                    <div
                      key={i}
                      className="p-6 rounded-xl bg-card border border-border flex flex-col gap-4"
                    >
                      <span className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center">
                        <r.icon className="w-5 h-5 text-gold-foreground" />
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

            {/* Videos */}
            {(p.videoUrl || (p.galleryVideos && p.galleryVideos.length > 0)) && (
              <div className="mt-14 border-t border-border pt-14">
                <h2 className="font-display text-3xl mb-6">Drone Tour & Walkthrough Videos</h2>
                <div className="space-y-6">
                  {p.videoUrl && (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-card-hover border border-border bg-black">
                      <video
                        src={p.videoUrl}
                        controls
                        playsInline
                        className="w-full h-full object-cover"
                        poster={p.image}
                      />
                    </div>
                  )}
                  {p.galleryVideos && p.galleryVideos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {p.galleryVideos.map((vUrl, idx) => (
                        <div
                          key={vUrl}
                          className="relative aspect-video rounded-2xl overflow-hidden shadow-card-hover border border-border bg-black"
                        >
                          <video
                            src={vUrl}
                            controls
                            playsInline
                            className="w-full h-full object-cover"
                            poster={p.image}
                          />
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold font-nav tracking-widest px-2.5 py-1 rounded-full uppercase">
                            Walkthrough #{idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Gallery */}
            {p.galleryImages && p.galleryImages.length > 0 && (
              <div className="mt-14 border-t border-border pt-14">
                <h2 className="font-display text-3xl mb-6">Gallery & Layout Views</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {p.galleryImages.map((imgUrl, idx) => (
                    <a
                      key={imgUrl}
                      href={imgUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="relative overflow-hidden rounded-xl group aspect-[4/3] border border-border bg-secondary/30 block"
                    >
                      <img
                        src={imgUrl}
                        alt={`${p.name} site photo ${idx + 1} — ${areaMain}, ${p.city}`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Plot availability */}
            <div id="layout-map" className="mt-14 border-t border-border pt-14 scroll-mt-28">
              <h2 className="font-display text-3xl">Plot Sizes & Availability</h2>
              <div className="mt-6 overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/70 text-left">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Size</th>
                      <th className="px-5 py-3 font-semibold">Price</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(p.sizePrices && p.sizePrices.length > 0
                      ? p.sizePrices
                      : p.sizes.map((size, i) => ({
                          size,
                          price: (() => {
                            if (p.priceLakh && p.priceLakh > 0) {
                              return `From ₹${p.priceLakh + i * 4} Lakh`;
                            }
                            return p.status === "Completed" || p.startingPrice === "Sold Out"
                              ? "Sold Out"
                              : "Contact Us";
                          })(),
                        }))
                    ).map((row) => (
                      <tr key={row.size}>
                        <td className="px-5 py-3 font-medium">{row.size}</td>
                        <td className="px-5 py-3">{row.price}</td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              p.status === "Completed" || p.startingPrice === "Sold Out"
                                ? "bg-badge-done-bg text-badge-done-fg"
                                : "bg-badge-ongoing-bg text-badge-ongoing-fg"
                            }`}
                          >
                            {p.status === "Completed" || p.startingPrice === "Sold Out"
                              ? "Sold Out"
                              : "Available"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {sold} of {p.totalPlots} plots already booked. Final pricing confirmed at site
                visit.
              </p>
            </div>

            {/* Amenities */}
            <div className="mt-14 border-t border-border pt-14">
              <h2 className="font-display text-3xl">Amenities & Infrastructure</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {p.amenities.map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-gold" /> {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Nearby places */}
            {p.nearbyPlaces && p.nearbyPlaces.length > 0 && (
              <div className="mt-14 border-t border-border pt-14">
                <span className="text-gold text-xs font-semibold font-nav tracking-[0.25em] uppercase">
                  Location Advantage
                </span>
                <h2 className="font-display text-3xl mt-2 mb-6">What's Nearby</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {p.nearbyPlaces.map((place, idx) => {
                    const meta =
                      nearbyCategoryMeta[place.category as NearbyCategory] ??
                      nearbyCategoryMeta.other;
                    const Icon = meta.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
                      >
                        <span
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${meta.bg}`}
                        >
                          <Icon className={`w-5 h-5 ${meta.color}`} />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">
                            {place.name}
                          </p>
                          <p className="text-xs text-muted-foreground font-nav uppercase tracking-wider mt-0.5">
                            {meta.label}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs font-semibold font-nav px-2.5 py-1 rounded-full bg-gold/10 text-gold border border-gold/20">
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
                    className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full border border-gold/30 text-gold font-semibold font-nav text-sm hover:bg-gold hover:text-gold-foreground transition"
                  >
                    <ExternalLink className="w-4 h-4" /> Open Full Map
                  </a>
                )}
              </div>
            )}

            {/* Construction Progress */}
            {p.progressTimeline && p.progressTimeline.length > 0 && (
              <div className="mt-14 border-t border-border pt-14">
                <h2 className="font-display text-3xl mb-8">Construction Progress</h2>
                <div className="relative border-l-2 border-border ml-4 space-y-8">
                  {p.progressTimeline.map((item, idx) => (
                    <div key={idx} className="relative pl-8">
                      <span
                        className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-background ${
                          item.done ? "bg-gold" : "bg-muted"
                        }`}
                      />
                      <span className="text-xs font-bold font-nav text-gold uppercase tracking-wider">
                        {item.date}
                      </span>
                      <h4 className="font-display text-xl mt-0.5 flex items-center gap-2">
                        {item.title}
                        {item.done && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-sans uppercase font-bold">
                            Done
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ */}
            {p.faqs && p.faqs.length > 0 && (
              <div className="mt-14 border-t border-border pt-14">
                <span className="text-gold text-xs font-semibold font-nav tracking-[0.25em] uppercase">
                  Frequently Asked Questions
                </span>
                <h2 className="font-display text-3xl mt-2 mb-8">
                  Questions about {p.name}
                </h2>
                <FAQAccordion faqs={p.faqs} />
              </div>
            )}

            {/* Documents */}
            <div className="mt-14 p-6 rounded-xl bg-secondary/50 border border-border flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-xl">Layout Plan & Documents</h3>
                {(() => {
                  if (!p.rera)
                    return (
                      <p className="text-sm text-muted-foreground mt-1">Status: Under Process</p>
                    );
                  if (!approval.number)
                    return (
                      <p className="text-sm text-muted-foreground mt-1">
                        {approval.type} Approved
                      </p>
                    );
                  return (
                    <p className="text-sm text-muted-foreground mt-1">
                      {approval.type} Approval: {approval.number}
                    </p>
                  );
                })()}
              </div>
              {p.layoutPdfUrl ? (
                <a
                  href={p.layoutPdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md gold-gradient text-gold-foreground font-semibold font-nav hover:opacity-95 transition"
                >
                  <Download className="w-4 h-4" /> Download Layout PDF
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-secondary border border-border text-muted-foreground font-semibold cursor-not-allowed opacity-60 text-sm"
                >
                  <Download className="w-4 h-4" /> PDF Coming Soon
                </button>
              )}
            </div>
          </div>

          {/* RIGHT — Sticky enquiry sidebar */}
          <aside id="enquiry" className="lg:sticky lg:top-28 self-start scroll-mt-24">
            <div className="bg-card p-6 rounded-2xl shadow-card-hover border border-border">
              <h3 className="font-display text-2xl">Enquire about {p.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Get plot availability, pricing & a free site visit slot.
              </p>
              <div className="mt-5">
                <EnquiryForm compact projectName={p.name} />
              </div>

              {p.status !== "Completed" && (
                <button
                  onClick={() => setIsVisitModalOpen(true)}
                  className="w-full mt-4 min-h-[44px] py-3 border-2 border-gold text-gold hover:bg-gold hover:text-gold-foreground font-semibold font-nav rounded-md transition text-sm text-center flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> Book Free Site Visit
                </button>
              )}

              {/* Quick contact buttons */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <a
                  href="tel:+919999999999"
                  className="flex items-center justify-center gap-2 min-h-[44px] rounded-md bg-secondary border border-border text-foreground hover:border-gold/40 transition text-sm font-semibold font-nav"
                >
                  <Phone className="w-4 h-4 text-gold" /> Call Now
                </a>
                <a
                  href={`https://wa.me/919999999999?text=Hi, I'm interested in ${p.name} (${p.area}, ${p.city}). Please share pricing and availability.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 min-h-[44px] rounded-md bg-whatsapp/10 border border-whatsapp/30 text-whatsapp hover:bg-whatsapp hover:text-white transition text-sm font-semibold font-nav"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>

              <Link
                to="/projects/"
                className="mt-5 block text-center text-sm text-muted-foreground hover:text-gold transition-colors"
              >
                ← View all projects
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* ── WhatsApp CTA strip ── */}
      {p.status !== "Completed" && (
        <section className="py-14 px-5 md:px-8 bg-primary border-t border-border">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-gold text-xs font-semibold font-nav tracking-[0.25em] uppercase">
              Talk to Our Team
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-primary-foreground mt-3">
              Interested in {p.name}?
            </h2>
            <p className="mt-3 text-primary-foreground/70 max-w-xl mx-auto">
              Our site team is available 9 AM – 7 PM, Monday to Saturday. Message us on WhatsApp
              for instant pricing and plot availability.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/919999999999?text=Hi, I'm interested in ${p.name} (${p.area}, ${p.city}). Please share details.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-whatsapp text-white font-semibold font-nav text-base hover:opacity-90 transition min-h-[52px]"
              >
                <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
              </a>
              <button
                onClick={() => setIsVisitModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full gold-gradient text-gold-foreground font-semibold font-nav text-base hover:opacity-95 transition min-h-[52px]"
              >
                <Calendar className="w-5 h-5" /> Book Free Site Visit
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── Mobile sticky bottom bar ── */}
      {p.status !== "Completed" && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card border-t border-border px-4 py-3 flex gap-3 safe-bottom">
          <a
            href="tel:+919999999999"
            className="flex-1 flex items-center justify-center gap-2 min-h-[44px] rounded-full border border-gold/40 text-gold font-semibold font-nav text-sm"
          >
            <Phone className="w-4 h-4" /> Call
          </a>
          <a
            href={`https://wa.me/919999999999?text=Hi, I'm interested in ${p.name} at ${p.area}, ${p.city}. Please share pricing.`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 min-h-[44px] rounded-full bg-whatsapp text-white font-semibold font-nav text-sm"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
          <a
            href="#enquiry"
            className="flex-1 flex items-center justify-center gap-2 min-h-[44px] rounded-full gold-gradient text-gold-foreground font-semibold font-nav text-sm"
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
