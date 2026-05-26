import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { SectionHeader } from "@/components/site/SectionHeader";
import { getBlogs } from "@/lib/blogs";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blog/")({
  loader: async () => {
    const posts = await getBlogs();
    return { posts };
  },
  head: () => ({
    meta: [
      { title: "MK Builders & Developers Blog — Real Estate Guides & Advice" },
      {
        name: "description",
        content:
          "Expert guides, legal advice on RERA, investment analyses, and growth corridors for buying land and plots in Karnataka.",
      },
      { property: "og:title", content: "Blog — MK Builders & Developers" },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogPage,
});

function BlogPage() {
  const { posts } = Route.useLoaderData();

  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground py-20 md:py-28 px-5 md:px-8 text-center">
        <span className="text-gold text-xs font-semibold tracking-[0.25em] uppercase">
          Knowledge Hub
        </span>
        <h1 className="mt-4 font-display text-5xl md:text-7xl">Insights & Guides</h1>
        <p className="mt-5 max-w-2xl mx-auto text-primary-foreground/75">
          Everything you need to know about plotted land investment, legal procedures, KRERA
          guidelines, and upcoming growth markets in Karnataka.
        </p>
      </section>

      <section className="py-20 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Latest Articles" title="From our land experts" />

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group bg-card rounded-xl overflow-hidden border border-border shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-500 flex flex-col h-full"
              >
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="block aspect-[16/10] overflow-hidden"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-semibold">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {post.date}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl text-foreground group-hover:text-gold transition">
                    <Link to="/blog/$slug" params={{ slug: post.slug }}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" /> {post.readTime}
                    </span>
                    <Link
                      to="/blog/$slug"
                      params={{ slug: post.slug }}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-gold group-hover:gap-2 transition-all"
                    >
                      Read Article <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
