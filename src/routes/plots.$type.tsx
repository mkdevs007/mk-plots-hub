import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ProjectCard } from "@/components/site/ProjectCard";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { projects, cities } from "@/data/projects";
import { useMemo, useState } from "react";

const META: Record<string, { title: string; tagline: string; description: string }> = {
  residential: { title: "Residential Plots in Karnataka", tagline: "Build the home you've always imagined", description: "Premium residential plots in gated layouts — wide roads, parks, 24/7 security and clear titles." },
  commercial: { title: "Commercial Plots in Karnataka", tagline: "Plots that work as hard as you do", description: "Commercial layouts on high-footfall corridors — perfect for showrooms, offices and mixed-use." },
  agricultural: { title: "Agricultural Plots in Karnataka", tagline: "Land that grows with you", description: "Fertile agri plots with road, water and power. Great for weekend farms and long-horizon investment." },
  industrial: { title: "Industrial Plots in Karnataka", tagline: "Ready-to-build industrial parcels", description: "Industrial plots with high-load power, wide truck access and logistics-corridor proximity." },
};

export const Route = createFileRoute("/plots/$type")({
  loader: ({ params }) => {
    if (!META[params.type]) throw notFound();
    return { type: params.type };
  },
  head: ({ params }) => {
    const m = META[params.type];
    return {
      meta: [
        { title: `${m?.title ?? "Plots"} | MK Developers` },
        { name: "description", content: m?.description ?? "" },
        { property: "og:title", content: m?.title ?? "Plots" },
        { property: "og:url", content: `/plots/${params.type}` },
      ],
      links: [{ rel: "canonical", href: `/plots/${params.type}` }],
    };
  },
  component: PlotTypePage,
});

const statuses = ["All", "Ongoing", "New Launch", "Few Plots Left", "Completed"] as const;
const budgets = ["All", "Under 15 Lakh", "15 - 25 Lakh", "Above 25 Lakh"] as const;
const sizes = ["All", "30x40", "30x50", "40x60", "Others/Acre"] as const;

function PlotTypePage() {
  const { type } = Route.useLoaderData();
  const m = META[type]!;

  const [city, setCity] = useState("All");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [budget, setBudget] = useState<(typeof budgets)[number]>("All");
  const [size, setSize] = useState<(typeof sizes)[number]>("All");

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (p.type !== type) return false;

      // City filter
      if (city !== "All" && p.city !== city) return false;

      // Status filter
      if (status !== "All" && p.status !== status) return false;

      // Budget filter
      if (budget !== "All") {
        if (p.priceLakh === 0) return false; // Sold out
        if (budget === "Under 15 Lakh" && p.priceLakh >= 15) return false;
        if (budget === "15 - 25 Lakh" && (p.priceLakh < 15 || p.priceLakh > 25)) return false;
        if (budget === "Above 25 Lakh" && p.priceLakh <= 25) return false;
      }

      // Size filter
      if (size !== "All") {
        if (size === "Others/Acre") {
          const hasStandardSize = p.sizes.some(s => s.includes("30x") || s.includes("40x60"));
          if (hasStandardSize) return false;
        } else {
          if (!p.sizes.includes(size)) return false;
        }
      }

      return true;
    });
  }, [type, city, status, budget, size]);

  const sel = "px-4 py-2.5 rounded-md bg-background border border-border text-sm focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none";

  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-gold text-xs font-semibold tracking-[0.25em] uppercase">{m.title}</span>
          <h1 className="mt-4 font-display text-5xl md:text-7xl text-balance">{m.tagline}</h1>
          <p className="mt-6 text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">{m.description}</p>
        </div>
      </section>

      <section className="py-20 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Filters card */}
          <div className="bg-card border border-border rounded-xl p-5 md:p-6 shadow-card flex flex-wrap gap-4 items-end mb-10">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">City</label>
              <select value={city} onChange={(e) => setCity(e.target.value)} className={sel + " w-full font-medium"}>
                <option>All</option>
                {cities.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={sel + " w-full font-medium"}>
                {statuses.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Budget</label>
              <select value={budget} onChange={(e) => setBudget(e.target.value as typeof budget)} className={sel + " w-full font-medium"}>
                {budgets.map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Plot Size</label>
              <select value={size} onChange={(e) => setSize(e.target.value as typeof size)} className={sel + " w-full font-medium"}>
                {sizes.map((sz) => <option key={sz}>{sz}</option>)}
              </select>
            </div>
            <div className="text-sm text-muted-foreground ml-auto font-medium py-2.5">
              Showing <span className="font-bold text-foreground">{filtered.length}</span> results
            </div>
          </div>

          <SectionHeader eyebrow="Available now" title={`${m.title.split(" in ")[0]} for sale`} />
          {filtered.length ? (
            <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => <ProjectCard key={p.slug} p={p} />)}
            </div>
          ) : (
            <p className="text-center text-muted-foreground mt-20 py-16 bg-secondary/30 rounded-xl">
              No layouts match your exact filters. Adjust them or contact us below to hear about unlisted inventory.
            </p>
          )}
        </div>
      </section>

      <section className="py-20 px-5 md:px-8 bg-secondary/50">
        <div className="max-w-3xl mx-auto bg-card p-8 md:p-10 rounded-2xl shadow-card border border-border">
          <h3 className="font-display text-3xl text-center">Enquire about {m.title.split(" in ")[0]}</h3>
          <p className="text-sm text-muted-foreground text-center mt-2 mb-6">Receive detailed layouts, pricing guides, and site visit schedules.</p>
          <div className="mt-6"><EnquiryForm /></div>
        </div>
      </section>
    </SiteLayout>
  );
}
