import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Award, MapPin, ShieldCheck } from "lucide-react";
import { cities } from "@/data/projects";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About MK Developers — Karnataka's Trusted Layout Developer" },
      { name: "description", content: "10+ years, 500+ plots sold, 10+ layouts delivered. Learn the MK Developers story, team and RERA credentials." },
      { property: "og:title", content: "About — MK Developers" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground py-20 md:py-28 px-5 md:px-8 text-center">
        <span className="text-gold text-xs font-semibold tracking-[0.25em] uppercase">Our Story</span>
        <h1 className="mt-4 font-display text-5xl md:text-7xl">Building Karnataka, one plot at a time</h1>
      </section>

      <section className="py-20 px-5 md:px-8">
        <div className="max-w-4xl mx-auto">
          <SectionHeader eyebrow="Since 2014" title="A decade of trust" description="MK Developers was founded with one mission — make plot ownership transparent, legal and effortless for every Indian family." />
          <p className="mt-8 text-muted-foreground leading-relaxed text-lg text-center max-w-3xl mx-auto">
            From our first 20-acre layout in Devanahalli to multi-city presence across Bangalore, Mysore, Hubli and Tumkur — we've stayed obsessed with two things: clear titles and prime locations. Over 500 families have chosen us. Every single project is RERA approved.
          </p>
        </div>
      </section>

      <section className="py-16 px-5 md:px-8 bg-secondary/50">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-6">
          {[
            { icon: Award, title: "10+ Years", desc: "Of delivering plots" },
            { icon: ShieldCheck, title: "RERA Registered", desc: "Every layout, every plot" },
            { icon: MapPin, title: "4+ Cities", desc: "Across Karnataka" },
          ].map((c) => (
            <div key={c.title} className="bg-card p-8 rounded-xl border border-border text-center shadow-card">
              <c.icon className="w-10 h-10 text-gold mx-auto" />
              <h3 className="mt-4 font-display text-2xl">{c.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-5 md:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <SectionHeader eyebrow="Our Presence" title="Where you'll find us" />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {cities.map((c) => (
              <span key={c} className="px-5 py-2.5 bg-card border border-border rounded-full text-sm font-medium">
                <MapPin className="inline w-4 h-4 mr-1.5 text-gold" /> {c}
              </span>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
