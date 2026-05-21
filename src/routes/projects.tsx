import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { ProjectCard } from "@/components/site/ProjectCard";
import { projects, cities } from "@/data/projects";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Plot Projects in Karnataka | MK Developers" },
      { name: "description", content: "Explore all MK Developers plot projects across Bangalore, Mysore, Hubli & Tumkur. Filter by city, plot type, status and budget." },
      { property: "og:title", content: "All Plot Projects — MK Developers" },
      { property: "og:url", content: "/projects" },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
  component: ProjectsPage,
});

const types = ["All", "Residential", "Commercial", "Agricultural", "Industrial"] as const;
const statuses = ["All", "Ongoing", "New Launch", "Few Plots Left", "Completed"] as const;

function ProjectsPage() {
  const [city, setCity] = useState("All");
  const [type, setType] = useState<(typeof types)[number]>("All");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (city === "All" || p.city === city) &&
          (type === "All" || p.type === type.toLowerCase()) &&
          (status === "All" || p.status === status)
      ),
    [city, type, status]
  );

  const sel = "px-4 py-2.5 rounded-md bg-background border border-border text-sm focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none";

  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground py-16 md:py-24 px-5 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-gold text-xs font-semibold tracking-[0.25em] uppercase">Our Projects</span>
          <h1 className="mt-4 font-display text-5xl md:text-6xl">Find your perfect plot</h1>
          <p className="mt-4 text-primary-foreground/70 max-w-2xl mx-auto">Filter by city, plot type and status. Every listing is RERA approved with clear title.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-5 md:p-6 shadow-card flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[160px]">
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">City</label>
              <select value={city} onChange={(e) => setCity(e.target.value)} className={sel + " w-full"}>
                <option>All</option>
                {cities.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Plot Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className={sel + " w-full"}>
                {types.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={sel + " w-full"}>
                {statuses.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="text-sm text-muted-foreground ml-auto">
              Showing <span className="font-bold text-foreground">{filtered.length}</span> of {projects.length} projects
            </div>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => <ProjectCard key={p.slug} p={p} />)}
          </div>
          {filtered.length === 0 && (
            <p className="text-center py-20 text-muted-foreground">No projects match your filters yet — try widening them.</p>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
