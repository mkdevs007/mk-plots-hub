import { Link } from "@tanstack/react-router";
import { MapPin, Ruler, Shield, ChevronRight } from "lucide-react";
import type { Project, ProjectStatus } from "@/data/projects";
import { parseApproval, generateLocationSlug } from "@/lib/projects";

const statusBadgeClass: Record<ProjectStatus, string> = {
  Ongoing: "bg-emerald-500/80 text-white border border-emerald-400/30 backdrop-blur-md",
  "New Launch": "bg-blue-600/80 text-white border border-blue-500/30 backdrop-blur-md",
  "Few Plots Left": "bg-amber-500/80 text-white border border-amber-400/30 backdrop-blur-md",
  Completed: "bg-zinc-600/80 text-white border border-zinc-500/30 backdrop-blur-md",
};

export function ProjectCard({ p }: { p: Project }) {
  const approval = parseApproval(p.rera);
  const sold = p.totalPlots - p.availablePlots;
  const soldPercent = Math.max(5, Math.round((sold / p.totalPlots) * 100));

  return (
    <article className="group bg-card rounded-2xl overflow-hidden border border-border/80 hover:border-gold/40 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between h-full relative">
      <div>
        {/* Card Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Link
            to="/$locationProject"
            params={{ locationProject: generateLocationSlug(p) }}
            className="block w-full h-full"
          >
            <img
              src={p.image}
              alt={`${p.name} aerial view in ${p.city}`}
              loading="lazy"
              width={1280}
              height={896}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Cinematic dark gradient shader on image base */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </Link>

          {/* Hover overlay with CTAs */}
          <div className="absolute inset-0 bg-[#512561]/45 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-4 z-10 pointer-events-none group-hover:pointer-events-auto">
            <Link
              to="/$locationProject"
              params={{ locationProject: generateLocationSlug(p) }}
              className="w-3/4 text-center px-5 py-2.5 rounded-full gold-gradient text-gold-foreground font-semibold font-nav text-xs tracking-wider uppercase shadow-md transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
            >
              Explore Project
            </Link>
            <Link
              to="/$locationProject"
              params={{ locationProject: generateLocationSlug(p) }}
              hash="enquiry"
              className="w-3/4 text-center px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold font-nav text-xs tracking-wider uppercase border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 cursor-pointer hover:scale-[1.02]"
            >
              Enquire Now
            </Link>
          </div>


          {p.startingPrice && (
            <span className="absolute top-4 right-4 bg-black/60 text-gold text-xs font-semibold font-nav px-3 py-1 rounded-full border border-gold/30 backdrop-blur-md z-20">
              {p.startingPrice}
            </span>
          )}
        </div>

        {/* Card Content Section */}
        <div className="p-6">
          <Link
            to="/$locationProject"
            params={{ locationProject: generateLocationSlug(p) }}
            className="hover:text-gold transition-colors block"
          >
            <h3 className="font-display text-2xl text-foreground leading-tight group-hover:text-primary transition-colors">
              {p.name}
            </h3>
          </Link>
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-gold shrink-0" /> {p.area}, {p.city}
          </p>

          {/* Size Badges */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {p.sizes.map((s) => (
              <span
                key={s}
                className="text-[11px] px-2.5 py-1 rounded-md bg-[#512561]/5 border border-[#512561]/10 text-primary font-semibold font-nav"
              >
                {s}
              </span>
            ))}
          </div>

          {/* Premium Progress Bar indicating booking velocity */}
          <div className="mt-5 pt-4 border-t border-border/60">
            <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground mb-1.5 font-nav">
              <span className="flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-gold shrink-0" />
                {p.availablePlots > 0 ? (
                  <span>
                    <strong className="text-primary font-bold">{p.availablePlots}</strong> plots left
                  </span>
                ) : (
                  <span className="text-destructive font-bold">Sold Out</span>
                )}
              </span>
              <span className="text-xs font-semibold text-primary">{soldPercent}% Sold</span>
            </div>
            
            {/* Progress track */}
            <div className="h-1.5 w-full rounded-full bg-[#EDE7F5] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold to-[#c9a84c] transition-all duration-500"
                style={{ width: `${soldPercent}%` }}
              />
            </div>

            <div className="mt-2.5 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-gold shrink-0" />
                <span className="font-semibold">{approval.type} Approved</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#512561] font-nav">
                {p.type === "agricultural" ? "Farm Land" : p.type}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Button CTAs */}
      <div className="px-6 pb-6 mt-auto">
        <div className="flex gap-3">
          <Link
            to="/$locationProject"
            params={{ locationProject: generateLocationSlug(p) }}
            className="flex-1 inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-full border border-gold text-gold text-xs tracking-wider uppercase font-semibold font-nav hover:bg-gold hover:text-gold-foreground hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            Explore Site <ChevronRight className="w-3.5 h-3.5 inline-block" />
          </Link>
          <Link
            to="/$locationProject"
            params={{ locationProject: generateLocationSlug(p) }}
            hash="enquiry"
            className="flex-1 inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-full gold-gradient text-gold-foreground text-xs tracking-wider uppercase font-bold font-nav hover:opacity-95 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer"
          >
            Enquire
          </Link>
        </div>
      </div>
    </article>
  );
}
