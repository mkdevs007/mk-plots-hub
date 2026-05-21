import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ProjectCard } from "@/components/site/ProjectCard";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { projects } from "@/data/projects";

const META: Record<string, { title: string; tagline: string; description: string }> = {
  residential: { title: "Residential Plots in Karnataka", tagline: "Build the home you've always imagined", description: "Premium residential plots in gated layouts — wide roads, parks, 24/7 security and clear titles." },
  commercial: { title: "Commercial Plots in Karnataka", tagline: "Plots that work as hard as you do", description: "Commercial layouts on high-footfall corridors — perfect for showrooms, offices and mixed-use." },
  agricultural: { title: "Agricultural Plots in Karnataka", tagline: "Land that grows with you", description: "Fertile agri plots with road, water and power. Great for weekend farms and long-horizon investment." },
  industrial: { title: "Industrial Plots in Karnataka", tagline: "Ready-to-build industrial parcels", description: "Industrial plots with high-load power, wide truck access and logistics-corridor proximity." },
};

export const Route = createFileRoute("/plots/$type")({
  loader: ({ params }) => {
    if (!META[params.type]) throw notFound();
    return { type: params.type };
  },
  head: ({ params }) => {
    const m = META[params.type];
    return {
      meta: [
        { title: `${m?.title ?? "Plots"} | MK Developers` },
        { name: "description", content: m?.description ?? "" },
        { property: "og:title", content: m?.title ?? "Plots" },
        { property: "og:url", content: `/plots/${params.type}` },
      ],
      links: [{ rel: "canonical", href: `/plots/${params.type}` }],
    };
  },
  component: PlotTypePage,
});

function PlotTypePage() {
  const { type } = Route.useLoaderData();
  const m = META[type]!;
  const list = projects.filter((p) => p.type === type);

  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-gold text-xs font-semibold tracking-[0.25em] uppercase">{m.title}</span>
          <h1 className="mt-4 font-display text-5xl md:text-7xl text-balance">{m.tagline}</h1>
          <p className="mt-6 text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">{m.description}</p>
        </div>
      </section>

      <section className="py-20 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Available now" title={`${m.title.split(" in ")[0]} for sale`} />
          {list.length ? (
            <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => <ProjectCard key={p.slug} p={p} />)}
            </div>
          ) : (
            <p className="text-center text-muted-foreground mt-12">New projects coming soon. Share your details and we'll notify you first.</p>
          )}
        </div>
      </section>

      <section className="py-20 px-5 md:px-8 bg-secondary/50">
        <div className="max-w-3xl mx-auto bg-card p-8 md:p-10 rounded-2xl shadow-card border border-border">
          <h3 className="font-display text-3xl text-center">Enquire about {m.title.split(" in ")[0]}</h3>
          <div className="mt-6"><EnquiryForm /></div>
        </div>
      </section>
    </SiteLayout>
  );
}
