import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { Award, ShieldCheck, MapPin, CheckCircle, Heart, Building2, Trees } from "lucide-react";
import entranceGateImg from "@/assets/entrance-gate.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      {
        title: "About MK Builders & Developers — True, Trusted, Transparent | Plotted Communities",
      },
      {
        name: "description",
        content:
          "MK Builders & Developers is a family-led firm with a quiet preference for doing fewer things, properly. Under sixteen years, we have delivered 15 layouts and 4,200+ plots across Karnataka.",
      },
      { property: "og:title", content: "About — MK Builders & Developers" },
      { property: "og:url", content: "/about" },
      { property: "og:image", content: entranceGateImg },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      {/* Premium Hero Section */}
      <section className="relative -mt-20 md:-mt-[120px] pt-36 pb-20 md:pt-52 md:pb-28 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(184,134,11,0.15),rgba(0,0,0,0))]" />
        <div className="relative z-10 max-w-4xl mx-auto px-5 md:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-6">
            About MK
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.1] text-balance">
            Land, considered.
            <br />
            <span className="text-gold italic font-light">Communities, finished.</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-primary-foreground/80 leading-relaxed font-sans max-w-2xl mx-auto font-light">
            MK Builders & Developers is a family-led firm with a quiet preference for doing fewer
            things, properly.
          </p>
        </div>
      </section>

      {/* Entrance Gate Image Section */}
      <section className="relative -mt-10 px-5 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-border bg-card p-2 md:p-3 shadow-card transition-all duration-500 hover:shadow-card-hover group">
            <div className="relative rounded-xl md:rounded-2xl overflow-hidden aspect-[21/9] bg-secondary">
              <img
                src={entranceGateImg}
                alt="MK community entrance gate"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 text-white z-10 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                <span className="text-xs md:text-sm tracking-wider uppercase font-semibold text-white/90 drop-shadow-md">
                  MK community entrance gate
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Narrative */}
      <section className="py-20 px-5 md:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 justify-center mb-4">
            <span className="gold-divider" />
            <span className="text-gold text-xs font-semibold tracking-[0.2em] uppercase">
              OUR STORY
            </span>
            <span className="gold-divider" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-center text-foreground leading-tight text-balance">
            From a single layout in 2010 to six premium layouts today.
          </h2>

          <div className="mt-12 space-y-8 text-muted-foreground leading-relaxed text-base md:text-lg max-w-3xl mx-auto font-light">
            <p>
              What began as a small family venture in 2010 has, over sixteen years, become one of
              Karnataka's most respected plotted community developers — without ever choosing to
              grow loud.
            </p>
            <p>
              We've kept our practice deliberate: a small number of locations at a time, each one
              fully infrastructured before plots are released. Roads laid. Drainage closed. Boundary
              walls up. Trees planted. Only then do we open the gate.
            </p>
            <p>
              The result is a community that's ready the day you register — and a buying experience
              that, in our buyers' words, feels less like real estate and more like a careful
              introduction.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-16 px-5 md:px-8 bg-secondary/50 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {[
              { count: "15", label: "COMPLETED LAYOUTS", icon: Building2 },
              { count: "4,200+", label: "PLOTS SOLD", icon: CheckCircle },
              { count: "6", label: "LOCATIONS", icon: MapPin },
              { count: "16", label: "YEARS OF TRUST", icon: Heart },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="inline-flex items-center justify-center p-3 rounded-xl bg-card border border-border text-gold mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground font-bold tracking-tight">
                  {stat.count}
                </div>
                <div className="text-[10px] md:text-xs text-muted-foreground tracking-[0.2em] font-semibold uppercase mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder's Note Section */}
      <section className="py-20 px-5 md:px-8 bg-background relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="bg-card border border-border rounded-2xl md:rounded-3xl p-8 md:p-12 shadow-card relative">
            <span className="absolute -top-6 left-8 font-display text-8xl text-gold/20 select-none">
              “
            </span>

            <p className="font-display text-xl md:text-2xl lg:text-3xl text-foreground/90 italic leading-relaxed text-center relative z-10 font-light">
              "Land is patient. We try to be too. A community doesn't begin with a sales office; it
              begins with the trees we plant and the roads we asphalt. If we do our job properly,
              our presence is felt, not heard."
            </p>

            <div className="mt-8 flex flex-col items-center">
              <div className="w-12 h-[1px] bg-gold/50 mb-4" />
              <div className="text-foreground font-display text-lg md:text-xl font-medium tracking-wide">
                M. Krishna
              </div>
              <div className="text-xs text-muted-foreground tracking-widest uppercase mt-1">
                Founder, MK Builders & Developers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials & Approvals Section */}
      <section className="py-20 px-5 md:px-8 bg-secondary/30 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-gold text-xs font-semibold tracking-[0.25em] uppercase">
              Trust & Veracity
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-4xl text-foreground">
              Statutory Credentials
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "RERA Registered",
                desc: "All MK projects carry valid RERA registration numbers, displayed on every brochure and contract.",
              },
              {
                icon: Award,
                title: "DTCP Approved",
                desc: "Every layout is statutorily approved with clear titles, zoning certificates, and plan approvals.",
              },
              {
                icon: Trees,
                title: "4,200+ Families",
                desc: "Over sixteen years, we have handed over more than 4,200 plots to happy families and investors.",
              },
            ].map((cred, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-card transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center mb-4 group-hover:bg-gold group-hover:text-white transition-all duration-300">
                  <cred.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl text-foreground font-semibold mb-2">
                  {cred.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                  {cred.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
