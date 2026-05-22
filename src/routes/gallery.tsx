import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { SectionHeader } from "@/components/site/SectionHeader";
import { projects } from "@/data/projects";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Project Gallery — Drone Photos & Site Progress | MK Builders & Developers" },
      {
        name: "description",
        content:
          "Aerial drone photos, site progress and walkthroughs from MK Builders & Developers layouts across Karnataka.",
      },
      { property: "og:title", content: "Gallery — MK Builders & Developers" },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: Gallery,
});

function Gallery() {
  const photos = [...projects, ...projects].slice(0, 9);
  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground py-20 md:py-28 px-5 md:px-8 text-center">
        <span className="text-gold text-xs font-semibold tracking-[0.25em] uppercase">
          In Pictures
        </span>
        <h1 className="mt-4 font-display text-5xl md:text-7xl">Our projects, captured</h1>
      </section>

      <section className="py-16 md:py-20 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Drone & Site Photos" title="See the layouts up close" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((p, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-xl group ${i % 5 === 0 ? "sm:col-span-2 sm:row-span-2 aspect-square" : "aspect-[4/3]"}`}
              >
                <img
                  src={p.image}
                  alt={`${p.name} drone photo`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-5">
                  <span className="text-primary-foreground font-display text-xl">{p.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
