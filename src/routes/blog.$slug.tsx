import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { blogPosts } from "@/data/blog";
import { Calendar, Clock, ChevronLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = blogPosts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.post.title} | MK Builders & Developers Blog` },
      { name: "description", content: loaderData?.post.excerpt ?? "" },
      { property: "og:title", content: loaderData?.post.title ?? "" },
      { property: "og:description", content: loaderData?.post.excerpt ?? "" },
      { property: "og:image", content: loaderData?.post.image ?? "" },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/blog/${loaderData?.post.slug}` },
    ],
    links: [{ rel: "canonical", href: `/blog/${loaderData?.post.slug}` }],
  }),
  component: BlogPostDetail,
});

function BlogPostDetail() {
  const { post } = Route.useLoaderData();

  // Simple parser to render mock markdown content nicely
  const renderContent = (text: string) => {
    return text.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <br key={idx} />;

      // Headings
      if (trimmed.startsWith("# ")) {
        return (
          <h1
            key={idx}
            className="font-display text-4xl md:text-5xl mt-8 mb-4 font-bold text-foreground leading-tight"
          >
            {trimmed.slice(2)}
          </h1>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h2
            key={idx}
            className="font-display text-2xl md:text-3xl mt-8 mb-4 font-semibold text-foreground border-b border-border pb-2"
          >
            {trimmed.slice(3)}
          </h2>
        );
      }
      if (trimmed.startsWith("### ")) {
        return (
          <h3
            key={idx}
            className="font-display text-xl md:text-2xl mt-6 mb-3 font-semibold text-foreground"
          >
            {trimmed.slice(4)}
          </h3>
        );
      }

      // Bullet points
      if (trimmed.startsWith("* ")) {
        const parts = trimmed.slice(2).split(":");
        if (parts.length > 1) {
          return (
            <li key={idx} className="ml-6 list-disc text-muted-foreground leading-relaxed my-1.5">
              <strong className="text-foreground">{parts[0]}:</strong>
              {parts.slice(1).join(":")}
            </li>
          );
        }
        return (
          <li key={idx} className="ml-6 list-disc text-muted-foreground leading-relaxed my-1.5">
            {trimmed.slice(2)}
          </li>
        );
      }

      // Table formatting helper
      if (trimmed.startsWith("|")) {
        // Skip header separators like | :--- | :--- |
        if (trimmed.includes("---")) return null;

        const cells = trimmed
          .split("|")
          .map((c) => c.trim())
          .filter(Boolean);
        const isHeader = idx === 11 || idx === 12; // Simple check for header line context

        return (
          <div
            key={idx}
            className="grid grid-cols-3 gap-4 border-b border-border py-2 text-sm text-muted-foreground"
          >
            {cells.map((cell, cIdx) => (
              <span key={cIdx} className={cIdx === 0 ? "font-semibold text-foreground" : ""}>
                {cell}
              </span>
            ))}
          </div>
        );
      }

      // Regular paragraphs
      return (
        <p key={idx} className="my-4 text-muted-foreground leading-relaxed text-base md:text-lg">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <SiteLayout>
      <article className="py-12 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold transition mb-8"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Blog
          </Link>

          {/* Featured Image */}
          <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-card mb-8">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 md:left-10 md:right-10 text-white">
              <span className="px-3 py-1 rounded-full bg-gold text-gold-foreground text-xs font-semibold uppercase tracking-wider">
                {post.category}
              </span>
              <h1 className="font-display text-3xl md:text-5xl lg:text-6xl mt-4 leading-tight font-bold">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-sm mt-4 text-white/80">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {post.readTime}
                </span>
              </div>
            </div>
          </div>

          {/* Content Layout */}
          <div className="grid lg:grid-cols-[1fr_360px] gap-12 mt-12">
            {/* Article Body */}
            <div className="prose prose-stone max-w-none">
              {renderContent(post.content)}

              {/* Social Sharing */}
              <div className="mt-12 pt-6 border-t border-border flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-gold" /> Share this article:
                </span>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full border border-border hover:border-gold hover:text-gold transition">
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-full border border-border hover:border-gold hover:text-gold transition">
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-full border border-border hover:border-gold hover:text-gold transition">
                    <Linkedin className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar CTA Form */}
            <aside className="self-start lg:sticky lg:top-28">
              <div className="bg-card border border-border p-6 rounded-2xl shadow-card-hover">
                <h3 className="font-display text-2xl font-bold">Interested in land investment?</h3>
                <p className="text-sm text-muted-foreground mt-1.5 mb-5">
                  Speak to our layout consultant for properties with high growth potential and clean
                  deeds.
                </p>
                <EnquiryForm compact />
              </div>
            </aside>
          </div>
        </div>
      </article>
    </SiteLayout>
  );
}
