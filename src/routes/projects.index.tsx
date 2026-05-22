import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { ProjectCard } from "@/components/site/ProjectCard";
import { projects, cities } from "@/data/projects";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Plot Projects in Karnataka | MK Builders & Developers" },
      {
        name: "description",
        content:
          "Explore all MK Builders & Developers plot projects across Bangalore, Mysore, Hubli & Tumkur. Filter by city, plot type, status and budget.",
      },
      { property: "og:title", content: "All Plot Projects — MK Builders & Developers" },
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
          (status === "All" || p.status === status),
      ),
    [city, type, status],
  );

  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground py-16 md:py-24 px-5 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-gold text-xs font-semibold tracking-[0.25em] uppercase">
            Our Projects
          </span>
          <h1 className="mt-4 font-display text-5xl md:text-6xl">Find your perfect plot</h1>
          <p className="mt-4 text-primary-foreground/70 max-w-2xl mx-auto">
            Filter by city, plot type and status. Every listing is RERA approved with clear title.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-5 md:p-6 shadow-card flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[160px]">
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                City
              </label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="h-11 bg-background border-border text-foreground hover:bg-secondary/40 font-medium w-full">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Cities</SelectItem>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Plot Type
              </label>
              <Select value={type} onValueChange={(val) => setType(val as typeof type)}>
                <SelectTrigger className="h-11 bg-background border-border text-foreground hover:bg-secondary/40 font-medium w-full">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t === "All" ? "All Types" : t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Status
              </label>
              <Select value={status} onValueChange={(val) => setStatus(val as typeof status)}>
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
            <div className="text-sm text-muted-foreground ml-auto font-medium py-2.5">
              Showing <span className="font-bold text-foreground">{filtered.length}</span> of{" "}
              {projects.length} projects
            </div>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProjectCard key={p.slug} p={p} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center py-20 text-muted-foreground">
              No projects match your filters yet — try widening them.
            </p>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
