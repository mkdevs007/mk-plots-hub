import { createFileRoute, Link, notFound, useLocation } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { projects } from "@/data/projects";
import {
  MapPin,
  Ruler,
  Shield,
  Download,
  CheckCircle2,
  Calendar,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { SiteVisitModal } from "@/components/site/SiteVisitModal";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = projects.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.project.name} — Plots in ${loaderData?.project.city} | MK Developers`,
      },
      {
        name: "description",
        content: `${loaderData?.project.name} — ${loaderData?.project.description} Starting ${loaderData?.project.startingPrice}.`,
      },
      { property: "og:title", content: `${loaderData?.project.name} — MK Developers` },
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

// Timeline updates for projects
const progressTimeline = [
  {
    date: "Jan 2025",
    title: "Land Acquisition & Boundary",
    desc: "Acquisition finalized, boundary wall completed, and main security gates installed.",
    done: true,
  },
  {
    date: "Mar 2025",
    title: "Road & Drainage Works",
    desc: "80% of blacktop internal roads completed. Stormwater drainage grid installed.",
    done: true,
  },
  {
    date: "Jun 2025",
    title: "Electrical & Water Infrastructure",
    desc: "Underground electric cabling layed and connection to municipal water line initiated.",
    done: false,
  },
  {
    date: "Oct 2025",
    title: "Parks & Landscaping",
    desc: "Central community park, children's play area, and tree plantations scheduled.",
    done: false,
  },
  {
    date: "Jan 2026",
    title: "Final Handover & Registration",
    desc: "RERA handovers and plot registrations for first-batch buyers.",
    done: false,
  },
];

function ProjectDetail() {
  const { project: p } = Route.useLoaderData();
  const [selectedPlot, setSelectedPlot] = useState<InteractivePlot | null>(null);
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
  const plotsList = mockPlots(p.priceLakh, p.sizes);

  const statusColors = {
    Available: {
      bg: "bg-emerald-500",
      text: "text-emerald-500",
      svg: "#10b981",
      svgHover: "#059669",
    },
    Booked: { bg: "bg-amber-500", text: "text-amber-500", svg: "#f59e0b", svgHover: "#d97706" },
    Sold: { bg: "bg-rose-500", text: "text-rose-500", svg: "#f43f5e", svgHover: "#e11d48" },
  };

  return (
    <SiteLayout>
      <section className="relative -mt-16 md:-mt-[88px] h-[70vh] min-h-[480px] overflow-hidden">
        <img
          src={p.image}
          alt={`${p.name} aerial view`}
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-between pt-24 pb-14 px-5 md:px-8 text-primary-foreground">
          <Link
            to="/projects"
            className="self-start text-[11px] uppercase tracking-[0.22em] text-primary-foreground/70 hover:text-gold transition-colors font-semibold"
          >
            ← Back to all projects
          </Link>
          <div>
            <span className="text-gold text-xs font-semibold tracking-[0.25em] uppercase">
              {p.status}
            </span>
            <h1 className="mt-3 font-display text-5xl md:text-7xl">{p.name}</h1>
            <p className="mt-3 text-primary-foreground/80 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold" /> {p.area}, {p.city} — {p.landmark}
            </p>
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
                { icon: MapPin, label: "Starting", value: p.startingPrice },
                { icon: Shield, label: "RERA ID", value: p.rera ? "Approved" : "Under Process" },
              ].map((s) => (
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

            {/* Interactive Layout Availability Map */}
            <div id="layout-map" className="mt-12 border-t border-border pt-12 scroll-mt-24">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl">Interactive Availability Map</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select a color-coded plot to view details and enquire.
                  </p>
                </div>
                {/* Legend */}
                <div className="flex gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-emerald-500" /> Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-amber-500" /> Booked
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-rose-500" /> Sold Out
                  </span>
                </div>
              </div>

              {/* SVG Map Container */}
              <div className="mt-8 bg-secondary/30 rounded-2xl p-4 md:p-6 border border-border overflow-x-auto">
                <div className="min-w-[720px] relative">
                  <svg viewBox="0 0 720 280" className="w-full h-auto select-none">
                    {/* Background layout road grid */}
                    <rect x="0" y="100" width="720" height="30" fill="#e2e8f0" rx="4" />
                    <text
                      x="360"
                      y="120"
                      fill="#94a3b8"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      letterSpacing="0.2em"
                    >
                      INTERNAL ROADWAY (30 FT)
                    </text>

                    {/* Plots */}
                    {plotsList.map((plot) => (
                      <g
                        key={plot.id}
                        className="cursor-pointer group"
                        onClick={() => {
                          setSelectedPlot(plot);
                          if (plot.status !== "Sold") {
                            const el = document.getElementById("enquiry");
                            if (el) {
                              el.scrollIntoView({ behavior: "smooth" });
                            }
                          }
                        }}
                      >
                        <rect
                          x={plot.x}
                          y={plot.y}
                          width={plot.w}
                          height={plot.h}
                          fill={
                            selectedPlot?.id === plot.id ? "#b8860b" : statusColors[plot.status].svg
                          }
                          stroke="#ffffff"
                          strokeWidth="2"
                          rx="4"
                          className="transition-all duration-300 hover:opacity-90"
                        />
                        <text
                          x={plot.x + plot.w / 2}
                          y={plot.y + plot.h / 2 - 2}
                          fill="#ffffff"
                          fontSize="12"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {plot.id}
                        </text>
                        <text
                          x={plot.x + plot.w / 2}
                          y={plot.y + plot.h / 2 + 14}
                          fill="#ffffff"
                          opacity="0.8"
                          fontSize="9"
                          textAnchor="middle"
                        >
                          {plot.size}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              {/* Selected Plot Info Card */}
              {selectedPlot && (
                <div className="mt-4 p-5 rounded-xl border border-border bg-card shadow-card animate-fade-up flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-2xl font-bold text-foreground">
                        Plot {selectedPlot.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[selectedPlot.status].bg} text-white`}
                      >
                        {selectedPlot.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Dimensions:{" "}
                      <span className="font-semibold text-foreground">{selectedPlot.size}</span> |
                      Estimated Value:{" "}
                      <span className="font-semibold text-foreground">{selectedPlot.price}</span>
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setSelectedPlot(null)}
                      className="px-4 py-2 text-xs rounded border border-border hover:bg-secondary text-muted-foreground"
                    >
                      Clear Selection
                    </button>
                    {selectedPlot.status !== "Sold" && (
                      <a
                        href={`#enquiry`}
                        className="px-5 py-2 text-xs rounded gold-gradient text-gold-foreground font-semibold text-center"
                      >
                        Enquire for this plot
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

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
                    {p.sizes.map((sz: string, i: number) => (
                      <tr key={sz}>
                        <td className="px-5 py-3 font-medium">{sz}</td>
                        <td className="px-5 py-3">
                          {p.priceLakh === 0 ? "Sold Out" : `From ₹${p.priceLakh + i * 4} Lakh`}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.priceLakh === 0 ? "bg-badge-done-bg text-badge-done-fg" : "bg-badge-ongoing-bg text-badge-ongoing-fg"}`}
                          >
                            {p.priceLakh === 0 ? "Sold Out" : "Available"}
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

            {/* Development Progress Updates */}
            <div className="mt-12 border-t border-border pt-12">
              <h2 className="font-display text-3xl mb-8">Layout Construction Progress</h2>
              <div className="relative border-l-2 border-border ml-4 space-y-8">
                {progressTimeline.map((item, idx) => (
                  <div key={idx} className="relative pl-8">
                    {/* Circle marker */}
                    <span
                      className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-background flex items-center justify-center ${item.done ? "bg-gold" : "bg-muted"}`}
                    />
                    <div>
                      <span className="text-xs font-bold text-gold uppercase tracking-wider">
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

            {/* Documents Section */}
            <div className="mt-12 p-6 rounded-xl bg-secondary/50 border border-border flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-xl">Layout Plan & Documents</h3>
                <p className="text-sm text-muted-foreground mt-1">RERA: {p.rera}</p>
              </div>
              <button className="inline-flex items-center gap-2 px-5 py-3 rounded-md gold-gradient text-gold-foreground font-semibold hover:opacity-95 transition">
                <Download className="w-4 h-4" /> Download Layout PDF
              </button>
            </div>
          </div>

          <aside id="enquiry" className="lg:sticky lg:top-28 self-start scroll-mt-24">
            <div className="bg-card p-6 rounded-2xl shadow-card-hover border border-border">
              <h3 className="font-display text-2xl">Enquire about {p.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Get plot availability, pricing & site visit slot.
              </p>
              <div className="mt-5">
                <EnquiryForm compact plotId={selectedPlot?.id} projectName={p.name} />
              </div>

              {p.priceLakh > 0 && (
                <button
                  onClick={() => setIsVisitModalOpen(true)}
                  className="w-full mt-4 py-3 border-2 border-gold text-gold hover:bg-gold hover:text-gold-foreground font-semibold rounded-md transition text-sm text-center"
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
