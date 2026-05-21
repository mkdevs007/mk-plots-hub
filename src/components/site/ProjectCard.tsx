import { Link } from "@tanstack/react-router";
import { MapPin, Ruler, Shield } from "lucide-react";
import type { Project, ProjectStatus } from "@/data/projects";

const badgeClass: Record<ProjectStatus, string> = {
  Ongoing: "bg-badge-ongoing-bg text-badge-ongoing-fg",
  "New Launch": "bg-badge-new-bg text-badge-new-fg",
  "Few Plots Left": "bg-badge-few-bg text-badge-few-fg",
  Completed: "bg-badge-done-bg text-badge-done-fg",
};

export function ProjectCard({ p }: { p: Project }) {
  return (
    <article className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500">
      <Link to="/projects/$slug" params={{ slug: p.slug }} className="block relative aspect-[4/3] overflow-hidden">
        <img
          src={p.image}
          alt={`${p.name} aerial view in ${p.city}`}
          loading="lazy"
          width={1280}
          height={896}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${badgeClass[p.status]}`}>
          {p.status}
        </span>
        <span className="absolute top-4 right-4 bg-primary/85 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
          {p.startingPrice}
        </span>
      </Link>

      <div className="p-6">
        <h3 className="font-display text-2xl text-foreground leading-tight">{p.name}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 text-gold" /> {p.area}, {p.city}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.sizes.map((s) => (
            <span key={s} className="text-xs px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground font-medium">
              {s}
            </span>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground border-t border-border pt-4">
          <div className="flex items-center gap-1.5"><Ruler className="w-3.5 h-3.5 text-gold" /> {p.availablePlots} of {p.totalPlots} plots</div>
          <div className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-gold" /> RERA Approved</div>
        </div>

        <div className="mt-5 flex gap-2">
          <Link
            to="/projects/$slug"
            params={{ slug: p.slug }}
            className="flex-1 text-center px-4 py-2.5 rounded-md border border-primary/15 text-primary text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition"
          >
            View Layout
          </Link>
          <Link
            to="/contact"
            className="flex-1 text-center px-4 py-2.5 rounded-md gold-gradient text-gold-foreground text-sm font-semibold hover:opacity-90 transition"
          >
            Enquire
          </Link>
        </div>
      </div>
    </article>
  );
}
