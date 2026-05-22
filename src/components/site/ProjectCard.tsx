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
    <article className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 flex flex-col justify-between h-full">
      <div>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={p.image}
            alt={`${p.name} aerial view in ${p.city}`}
            loading="lazy"
            width={1280}
            height={896}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Hover overlay with CTAs (separate anchors inside div) */}
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-4 z-10">
            <Link
              to="/projects/$slug"
              params={{ slug: p.slug }}
              hash="layout-map"
              className="px-5 py-2.5 rounded-full gold-gradient text-gold-foreground font-semibold text-xs tracking-wider uppercase shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 cursor-pointer"
            >
              View Layout Map
            </Link>
            <Link
              to="/projects/$slug"
              params={{ slug: p.slug }}
              hash="enquiry"
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider uppercase border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 cursor-pointer"
            >
              Enquire Now
            </Link>
          </div>
          <span
            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${badgeClass[p.status]}`}
          >
            {p.status}
          </span>
          <span className="absolute top-4 right-4 bg-primary/85 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
            {p.startingPrice}
          </span>
        </div>

        <div className="p-6">
          <Link
            to="/projects/$slug"
            params={{ slug: p.slug }}
            className="hover:text-gold transition-colors"
          >
            <h3 className="font-display text-2xl text-foreground leading-tight">{p.name}</h3>
          </Link>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-gold" /> {p.area}, {p.city}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {p.sizes.map((s) => (
              <span
                key={s}
                className="text-xs px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground font-medium"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground border-t border-border pt-4">
            <div className="flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-gold" /> {p.availablePlots} of {p.totalPlots} plots
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-gold" /> RERA Approved
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 mt-auto">
        <div className="flex gap-2">
          <Link
            to="/projects/$slug"
            params={{ slug: p.slug }}
            hash="layout-map"
            className="flex-1 text-center px-4 py-2.5 rounded-full border border-gold/30 text-gold text-sm font-semibold hover:bg-gold hover:text-gold-foreground transition cursor-pointer"
          >
            View Layout
          </Link>
          <Link
            to="/projects/$slug"
            params={{ slug: p.slug }}
            hash="enquiry"
            className="flex-1 text-center px-4 py-2.5 rounded-full gold-gradient text-gold-foreground text-sm font-semibold hover:opacity-90 transition cursor-pointer"
          >
            Enquire
          </Link>
        </div>
      </div>
    </article>
  );
}
