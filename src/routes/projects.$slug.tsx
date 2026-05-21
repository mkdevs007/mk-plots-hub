import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { projects } from "@/data/projects";
import { MapPin, Ruler, Shield, Download, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = projects.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.project.name} — Plots in ${loaderData?.project.city} | MK Developers` },
      { name: "description", content: `${loaderData?.project.name} — ${loaderData?.project.description} Starting ${loaderData?.project.startingPrice}.` },
      { property: "og:title", content: `${loaderData?.project.name} — MK Developers` },
      { property: "og:description", content: loaderData?.project.description ?? "" },
      { property: "og:image", content: loaderData?.project.image ?? "" },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/projects/${loaderData?.project.slug}` },
    ],
    links: [{ rel: "canonical", href: `/projects/${loaderData?.project.slug}` }],
  }),
  component: ProjectDetail,
});

function ProjectDetail() {
  const { project: p } = Route.useLoaderData();
  const sold = p.totalPlots - p.availablePlots;
  return (
    <SiteLayout>
      <section className="relative -mt-16 md:-mt-[88px] h-[70vh] min-h-[480px] overflow-hidden">
        <img src={p.image} alt={`${p.name} aerial view`} width={1920} height={1080} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-end pb-14 px-5 md:px-8 text-primary-foreground">
          <span className="text-gold text-xs font-semibold tracking-[0.25em] uppercase">{p.status}</span>
          <h1 className="mt-3 font-display text-5xl md:text-7xl">{p.name}</h1>
          <p className="mt-3 text-primary-foreground/80 flex items-center gap-2"><MapPin className="w-4 h-4 text-gold" /> {p.area}, {p.city} — {p.landmark}</p>
        </div>
      </section>

      <section className="py-16 px-5 md:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_380px] gap-12">
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                { icon: Ruler, label: "Total Plots", value: p.totalPlots },
                { icon: CheckCircle2, label: "Available", value: p.availablePlots },
                { icon: MapPin, label: "Starting", value: p.startingPrice },
                { icon: Shield, label: "RERA", value: "Approved" },
              ].map((s) => (
                <div key={s.label} className="p-5 rounded-xl bg-secondary/50 border border-border text-center">
                  <s.icon className="w-5 h-5 text-gold mx-auto" />
                  <div className="mt-2 font-display text-2xl text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="font-display text-3xl">About this layout</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed text-lg">{p.description}</p>
            </div>

            <div className="mt-12">
              <h2 className="font-display text-3xl">Plot availability</h2>
              <div className="mt-6 overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/70 text-left">
                    <tr><th className="px-5 py-3 font-semibold">Size</th><th className="px-5 py-3 font-semibold">Price</th><th className="px-5 py-3 font-semibold">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {p.sizes.map((sz: string, i: number) => (
                      <tr key={sz}>
                        <td className="px-5 py-3 font-medium">{sz}</td>
                        <td className="px-5 py-3">From ₹{p.priceLakh + i * 4} Lakh</td>
                        <td className="px-5 py-3"><span className="inline-block px-2.5 py-0.5 rounded-full bg-badge-ongoing-bg text-badge-ongoing-fg text-xs font-semibold">Available</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{sold} of {p.totalPlots} plots already booked. Final pricing confirmed at site visit.</p>
            </div>

            <div className="mt-12">
              <h2 className="font-display text-3xl">Amenities</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {p.amenities.map((a: string) => (
                  <span key={a} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm">
                    <CheckCircle2 className="w-4 h-4 text-gold" /> {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-12 p-6 rounded-xl bg-secondary/50 border border-border flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-xl">Layout Plan & Documents</h3>
                <p className="text-sm text-muted-foreground mt-1">RERA: {p.rera}</p>
              </div>
              <button className="inline-flex items-center gap-2 px-5 py-3 rounded-md gold-gradient text-gold-foreground font-semibold">
                <Download className="w-4 h-4" /> Download Layout PDF
              </button>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 self-start">
            <div className="bg-card p-6 rounded-2xl shadow-card-hover border border-border">
              <h3 className="font-display text-2xl">Enquire about {p.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">Get plot availability, pricing & site visit slot.</p>
              <div className="mt-5">
                <EnquiryForm compact />
              </div>
              <Link to="/projects" className="mt-5 block text-center text-sm text-muted-foreground hover:text-gold">← Back to all projects</Link>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
