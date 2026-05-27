import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ProjectCard } from "@/components/site/ProjectCard";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { getProjects } from "@/lib/projects";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const META: Record<string, { title: string; tagline: string; description: string }> = {
  all: {
    title: "All Plots in Karnataka",
    tagline: "Premium gated plots across prime growth corridors",
    description:
      "Explore fully developed residential, commercial, agricultural, and industrial land parcels inside Karnataka. RERA approved, clear titles, premium layouts.",
  },
  residential: {
    title: "Residential Plots in Karnataka",
    tagline: "Build the home you've always imagined",
    description:
      "Premium residential plots in gated layouts — wide roads, parks, 24/7 security and clear titles.",
  },
  commercial: {
    title: "Commercial Plots in Karnataka",
    tagline: "Plots that work as hard as you do",
    description:
      "Commercial layouts on high-footfall corridors — perfect for showrooms, offices and mixed-use.",
  },
  agricultural: {
    title: "Agricultural Plots in Karnataka",
    tagline: "Land that grows with you",
    description:
      "Fertile agri plots with road, water and power. Great for weekend farms and long-horizon investment.",
  },
  industrial: {
    title: "Industrial Plots in Karnataka",
    tagline: "Ready-to-build industrial parcels",
    description:
      "Industrial plots with high-load power, wide truck access and logistics-corridor proximity.",
  },
};

export const Route = createFileRoute("/plots/$type")({
  loader: async ({ params }) => {
    if (!META[params.type]) throw notFound();
    const list = await getProjects();
    return { type: params.type, initialProjects: list };
  },
  head: ({ params }) => {
    const m = META[params.type];
    return {
      meta: [
        { title: `${m?.title ?? "Plots"} | MK Builders & Developers` },
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
const types = ["all", "residential", "commercial", "agricultural", "industrial"] as const;

const typeNames: Record<string, string> = {
  all: "All Types",
  residential: "Residential",
  commercial: "Commercial",
  agricultural: "Agricultural",
  industrial: "Industrial",
};

function PlotTypePage() {
  const { type, initialProjects } = Route.useLoaderData();
  const { data: projects = initialProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    initialData: initialProjects,
  });

  const navigate = useNavigate();
  const m = META[type]!;

  const [city, setCity] = useState("All");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [budget, setBudget] = useState<(typeof budgets)[number]>("All");
  const [size, setSize] = useState<(typeof sizes)[number]>("All");

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (type !== "all" && p.type !== type) return false;

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
          const hasStandardSize = p.sizes.some((s) => s.includes("30x") || s.includes("40x60"));
          if (hasStandardSize) return false;
        } else {
          if (!p.sizes.includes(size)) return false;
        }
      }

      return true;
    });
  }, [projects, type, city, status, budget, size]);

  const dynamicCities = Array.from(new Set(projects.map((p) => p.city)));

  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-gold text-xs font-semibold font-nav tracking-[0.25em] uppercase">
            {m.title}
          </span>
          <h1 className="mt-4 font-display text-5xl md:text-7xl text-balance">{m.tagline}</h1>
          <p className="mt-6 text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            {m.description}
          </p>
        </div>
      </section>

      <section className="py-20 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Filters card */}
          <div className="bg-card border border-border rounded-xl p-5 md:p-6 shadow-card flex flex-wrap gap-4 items-end mb-10">
            {/* Plot Type Filter */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Plot Type
              </label>
              <Select
                value={type}
                onValueChange={(val) => navigate({ to: "/plots/$type", params: { type: val } })}
              >
                <SelectTrigger className="h-11 bg-background border-border text-foreground hover:bg-secondary/40 font-medium w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((t) => (
                    <SelectItem key={t} value={t}>
                      {typeNames[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City Filter */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                City
              </label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="h-11 bg-background border-border text-foreground hover:bg-secondary/40 font-medium w-full">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Cities</SelectItem>
                   {dynamicCities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Status
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-11 bg-background border-border text-foreground hover:bg-secondary/40 font-medium w-full">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s === "All" ? "All Statuses" : s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Budget Filter */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Budget
              </label>
              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger className="h-11 bg-background border-border text-foreground hover:bg-secondary/40 font-medium w-full">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  {budgets.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b === "All" ? "All Budgets" : b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Size Filter */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Plot Size
              </label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="h-11 bg-background border-border text-foreground hover:bg-secondary/40 font-medium w-full">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((sz) => (
                    <SelectItem key={sz} value={sz}>
                      {sz === "All" ? "All Sizes" : sz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground ml-auto font-medium py-2.5">
              Showing <span className="font-bold text-foreground">{filtered.length}</span> results
            </div>
          </div>

          <SectionHeader eyebrow="Available now" title={`${m.title.split(" in ")[0]} for sale`} />
          {filtered.length ? (
            <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProjectCard key={p.slug} p={p} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground mt-20 py-16 bg-secondary/30 rounded-xl">
              No layouts match your exact filters. Adjust them or contact us below to hear about
              unlisted inventory.
            </p>
          )}
        </div>
      </section>

      <section className="py-20 px-5 md:px-8 bg-secondary/50">
        <div className="max-w-3xl mx-auto bg-card p-8 md:p-10 rounded-2xl shadow-card border border-border">
          <h3 className="font-display text-3xl text-center">
            Enquire about {m.title.split(" in ")[0]}
          </h3>
          <p className="text-sm text-muted-foreground text-center mt-2 mb-6">
            Receive detailed layouts, pricing guides, and site visit schedules.
          </p>
          <div className="mt-6">
            <EnquiryForm />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
