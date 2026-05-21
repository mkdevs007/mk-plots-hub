import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { SectionHeader } from "@/components/site/SectionHeader";
import { MapPin, Home, Store, Trees, Factory, Route as RoadIcon, IndianRupee } from "lucide-react";
import { PlotROICalculator } from "@/components/site/PlotROICalculator";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Our Services — Layout Development & Plot Sales | MK Developers" },
      { name: "description", content: "Layout development, plot sales, site development and investment advisory — end-to-end real estate services across Karnataka." },
      { property: "og:title", content: "Services — MK Developers" },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});

const services = [
  { icon: MapPin, title: "Layout Development", desc: "Planning, approvals and delivery of premium plotted developments." },
  { icon: Home, title: "Residential Plots", desc: "Plots for homes and gated housing communities." },
  { icon: Store, title: "Commercial Plots", desc: "High-visibility plots for shops, offices and showrooms." },
  { icon: Trees, title: "Agricultural Plots", desc: "Farm land and weekend-farm investments." },
  { icon: Factory, title: "Industrial Plots", desc: "Warehouses and industrial-zone parcels." },
  { icon: RoadIcon, title: "Site Development", desc: "Roads, drainage, electricity and landscaping done right." },
  { icon: IndianRupee, title: "Investment Advisory", desc: "Guidance on the best plots for ROI and growth." },
];

function Services() {
  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground py-20 md:py-28 px-5 md:px-8 text-center">
        <span className="text-gold text-xs font-semibold tracking-[0.25em] uppercase">What we do</span>
        <h1 className="mt-4 font-display text-5xl md:text-7xl">Built for every plot need</h1>
        <p className="mt-5 max-w-2xl mx-auto text-primary-foreground/75">From land acquisition to layout approvals and registration — we handle every step.</p>
      </section>

      <section className="py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Our Services" title="End-to-end plot expertise" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.title} className="p-8 rounded-xl bg-card border border-border hover:border-gold/50 hover:-translate-y-1 transition-all duration-500 shadow-card">
                <span className="inline-flex w-12 h-12 rounded-lg gold-gradient items-center justify-center text-gold-foreground">
                  <s.icon className="w-6 h-6" />
                </span>
                <h3 className="mt-5 font-display text-xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-5 md:px-8 bg-secondary/50 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <PlotROICalculator />
        </div>
      </section>
    </SiteLayout>
  );
}
