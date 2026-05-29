import { createFileRoute, Link, notFound, useLocation } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { getProjectBySlug, parseApproval } from "@/lib/projects";
import {
  MapPin,
  Ruler,
  Shield,
  Download,
  CheckCircle2,
  Calendar,
  Clock,
  AlertCircle,
  Plane,
  GraduationCap,
  HeartPulse,
  ShoppingBag,
  Route as RouteIcon,
  Train,
  Building2,
  ExternalLink,
} from "lucide-react";
import type { ComponentType } from "react";
import type { NearbyCategory } from "@/data/projects";
import { useState, useEffect } from "react";
import { SiteVisitModal } from "@/components/site/SiteVisitModal";

export const Route = createFileRoute("/projects/$slug")({
  staleTime: 0,
  loader: async ({ params }) => {
    const project = await getProjectBySlug(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.project.name} — Plots in ${loaderData?.project.city} | MK Builders & Developers`,
      },
      {
        name: "description",
        content: `${loaderData?.project.name} — ${loaderData?.project.description}${loaderData?.project.startingPrice ? ` Starting ${loaderData?.project.startingPrice}` : ""}.`,
      },
      { property: "og:title", content: `${loaderData?.project.name} — MK Builders & Developers` },
      { property: "og:description", content: loaderData?.project.description ?? "" },
      { property: "og:image", content: loaderData?.project.image ?? "" },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/projects/${loaderData?.project.slug}` },
    ],
    links: [{ rel: "canonical", href: `/projects/${loaderData?.project.slug}` }],
  }),
  component: ProjectDetail,
});

interface InteractivePlot {
  id: string;
  status: "Available" | "Booked" | "Sold";
  size: string;
  price: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

// Generate static plot data for the interactive layout map
const mockPlots = (priceLakh: number, sizes: string[]): InteractivePlot[] => {
  const statuses: ("Available" | "Booked" | "Sold")[] = ["Available", "Booked", "Sold"];
  const list: InteractivePlot[] = [];
  let plotNum = 101;

  // Render a 3x6 grid of plots
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 6; col++) {
      const sizeIndex = (row + col) % sizes.length;
      const plotSize = sizes[sizeIndex];
      const status =
        priceLakh === 0
          ? "Sold"
          : col === 0 || col === 3
            ? "Sold"
            : col === 1 || col === 4
              ? "Booked"
              : "Available";

      list.push({
        id: `#${plotNum++}`,
        status,
        size: plotSize,
        price: priceLakh === 0 ? "Sold Out" : `₹${priceLakh + sizeIndex * 3} Lakh`,
        // Coordinates for layout drawing
        x: col * 110 + 20,
        y: row * 90 + 20 + (row > 0 ? 30 : 0), // Leave gap for a road in the middle
        w: 90,
        h: 70,
      });
    }
  }
  return list;
};


const nearbyCategoryMeta: Record<NearbyCategory, { label: string; icon: ComponentType<{ className?: string }>; color: string; bg: string }> = {
  airport:  { label: "Airport",      icon: Plane,          color: "text-sky-500",    bg: "bg-sky-500/10" },
  school:   { label: "School",       icon: GraduationCap,  color: "text-blue-500",   bg: "bg-blue-500/10" },
  hospital: { label: "Hospital",     icon: HeartPulse,     color: "text-red-500",    bg: "bg-red-500/10" },
  market:   { label: "Market",       icon: ShoppingBag,    color: "text-amber-500",  bg: "bg-amber-500/10" },
  highway:  { label: "Highway",      icon: RouteIcon,      color: "text-orange-500", bg: "bg-orange-500/10" },
  railway:  { label: "Railway",      icon: Train,          color: "text-purple-500", bg: "bg-purple-500/10" },
  it_park:  { label: "IT / Tech Park", icon: Building2,    color: "text-emerald-500",bg: "bg-emerald-500/10" },
  other:    { label: "Nearby Place", icon: MapPin,         color: "text-gold",       bg: "bg-gold/10" },
};

function ProjectDetail() {
  const { project: p } = Route.useLoaderData();
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const hash = window.location.hash || location.hash;
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [location.hash]);

  const sold = p.totalPlots - p.availablePlots;

  return (
    <SiteLayout>
      <section className="relative -mt-20 md:-mt-[120px] h-[70vh] min-h-[480px] overflow-hidden">
        <img
          src={p.image}
          alt={`${p.name} aerial view`}
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-between pt-28 md:pt-36 pb-14 px-5 md:px-8 text-primary-foreground">
          <Link
            to="/projects"
            className="self-start text-[11px] uppercase tracking-[0.22em] text-primary-foreground/70 hover:text-gold transition-colors font-semibold font-nav"
          >
            ← Back to all projects
          </Link>
          <div>
            <span className="text-gold text-xs font-semibold font-nav tracking-[0.25em] uppercase">
              {p.status}
            </span>
            <h1 className="mt-3 font-display text-5xl md:text-7xl">{p.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
              <p className="text-primary-foreground/80 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold" /> {p.area}, {p.city} — {p.landmark}
              </p>
              {p.mapLink && (
                <a
                  href={p.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-nav font-bold text-gold hover:text-gold/90 hover:bg-gold/20 hover:border-gold/30 transition-all shrink-0 bg-gold/10 border border-gold/20 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View on Google Maps
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-5 md:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_380px] gap-12">
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                { icon: Ruler, label: "Total Plots", value: p.totalPlots },
                { icon: CheckCircle2, label: "Available", value: p.availablePlots },
                p.startingPrice ? { icon: MapPin, label: "Starting", value: p.startingPrice } : null,
                (() => {
                  const approval = parseApproval(p.rera);
                  return {
                    icon: Shield,
                    label: `${approval.type} Status`,
                    value: p.rera ? "Approved" : "Under Process",
                  };
                })(),
              ].filter((item): item is { icon: any; label: string; value: any } => item !== null).map((s) => (
                <div
                  key={s.label}
                  className="p-5 rounded-xl bg-secondary/50 border border-border text-center"
                >
                  <s.icon className="w-5 h-5 text-gold mx-auto" />
                  <div className="mt-2 font-display text-2xl text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="font-display text-3xl">About this layout</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed text-lg">{p.description}</p>
            </div>

            {/* Walkthrough Video Section */}
            {(p.videoUrl || (p.galleryVideos && p.galleryVideos.length > 0)) && (
              <div className="mt-12 border-t border-border pt-12">
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
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold font-nav tracking-widest px-2.5 py-1 rounded-full uppercase">
                        Main Walkthrough
                      </div>
                    </div>
                  )}
                  {p.galleryVideos && p.galleryVideos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {p.galleryVideos.map((vUrl, index) => (
                        <div key={vUrl} className="relative aspect-video rounded-2xl overflow-hidden shadow-card-hover border border-border bg-black">
                          <video
                            src={vUrl}
                            controls
                            playsInline
                            className="w-full h-full object-cover"
                            poster={p.image}
                          />
                          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold font-nav tracking-widest px-2.5 py-1 rounded-full uppercase">
                            Walkthrough #{index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Layout Gallery */}
            {p.galleryImages && p.galleryImages.length > 0 && (
              <div className="mt-12 border-t border-border pt-12">
                <h2 className="font-display text-3xl mb-6">Gallery & Layout Views</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {p.galleryImages.map((imgUrl, index) => (
                    <a
                      key={imgUrl}
                      href={imgUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="relative overflow-hidden rounded-xl group aspect-[4/3] border border-border bg-secondary/30 block"
                    >
                      <img
                        src={imgUrl}
                        alt={`${p.name} gallery image ${index + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12">
              <h2 className="font-display text-3xl">Plot availability</h2>
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
                      : p.sizes.map((size: string, i: number) => ({
                          size,
                          price: (() => {
                            if (p.priceLakh !== undefined && p.priceLakh !== null && !isNaN(p.priceLakh) && p.priceLakh > 0) {
                              return `From ₹${p.priceLakh + i * 4} Lakh`;
                            }
                            const isSoldOut = p.status === "Completed" || p.startingPrice === "Sold Out";
                            return isSoldOut ? "Sold Out" : "Contact Us";
                          })()
                        }))
                    ).map((row: { size: string; price: string }) => (
                      <tr key={row.size}>
                        <td className="px-5 py-3 font-medium">{row.size}</td>
                        <td className="px-5 py-3">{row.price}</td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.status === "Completed" || p.startingPrice === "Sold Out" ? "bg-badge-done-bg text-badge-done-fg" : "bg-badge-ongoing-bg text-badge-ongoing-fg"}`}
                          >
                            {p.status === "Completed" || p.startingPrice === "Sold Out" ? "Sold Out" : "Available"}
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

            <div className="mt-12">
              <h2 className="font-display text-3xl">Amenities</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {p.amenities.map((a: string) => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-gold" /> {a}
                  </span>
                ))}
              </div>
            </div>

            {/* What's Nearby */}
            {p.nearbyPlaces && p.nearbyPlaces.length > 0 && (
              <div className="mt-12 border-t border-border pt-12">
                <h2 className="font-display text-3xl mb-6">What's Nearby</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {p.nearbyPlaces.map((place, idx) => {
                    const meta = nearbyCategoryMeta[place.category as NearbyCategory] ?? nearbyCategoryMeta.other;
                    const Icon = meta.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
                      >
                        <span className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${meta.bg}`}>
                          <Icon className={`w-5 h-5 ${meta.color}`} />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">{place.name}</p>
                          <p className="text-xs text-muted-foreground font-nav uppercase tracking-wider mt-0.5">{meta.label}</p>
                        </div>
                        <span className="shrink-0 text-xs font-semibold font-nav px-2.5 py-1 rounded-full bg-gold/10 text-gold border border-gold/20">
                          {place.distance}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Development Progress Updates — only if admin has added milestones */}
            {p.progressTimeline && p.progressTimeline.length > 0 && (
            <div className="mt-12 border-t border-border pt-12">
              <h2 className="font-display text-3xl mb-8">Layout Construction Progress</h2>
              <div className="relative border-l-2 border-border ml-4 space-y-8">
                {p.progressTimeline.map((item, idx) => (
                  <div key={idx} className="relative pl-8">
                    {/* Circle marker */}
                    <span
                      className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-background flex items-center justify-center ${item.done ? "bg-gold" : "bg-muted"}`}
                    />
                    <div>
                      <span className="text-xs font-bold font-nav text-gold uppercase tracking-wider">
                        {item.date}
                      </span>
                      <h4 className="font-display text-xl text-foreground font-semibold mt-0.5 flex items-center gap-2">
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
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Documents Section */}
            <div className="mt-12 p-6 rounded-xl bg-secondary/50 border border-border flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-xl">Layout Plan & Documents</h3>
                {(() => {
                  const approval = parseApproval(p.rera);
                  if (!p.rera) {
                    return <p className="text-sm text-muted-foreground mt-1">Status: Under Process</p>;
                  }
                  if (!approval.number) {
                    return <p className="text-sm text-muted-foreground mt-1">{approval.type} Approved</p>;
                  }
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

          <aside id="enquiry" className="lg:sticky lg:top-28 self-start scroll-mt-24">
            <div className="bg-card p-6 rounded-2xl shadow-card-hover border border-border">
              <h3 className="font-display text-2xl">Enquire about {p.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Get plot availability, pricing & site visit slot.
              </p>
              <div className="mt-5">
                <EnquiryForm compact projectName={p.name} />
              </div>

              {p.status !== "Completed" && (
                <button
                  onClick={() => setIsVisitModalOpen(true)}
                  className="w-full mt-4 py-3 border-2 border-gold text-gold hover:bg-gold hover:text-gold-foreground font-semibold font-nav rounded-md transition text-sm text-center"
                >
                  Book Free Site Visit
                </button>
              )}

              <Link
                to="/projects"
                className="mt-5 block text-center text-sm text-muted-foreground hover:text-gold"
              >
                ← Back to all projects
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Site visit calendar modal */}
      <SiteVisitModal
        projectName={p.name}
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
      />
    </SiteLayout>
  );
}
