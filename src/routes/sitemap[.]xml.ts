import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getProjects, generateLocationSlug } from "@/lib/projects";

const BASE_URL = "https://themkdevelopers.com";
const TODAY = new Date().toISOString().split("T")[0];

type UrlEntry = {
  path: string;
  changefreq: string;
  priority: string;
  lastmod?: string;
};

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const dbProjects = await getProjects();

        const staticPages: UrlEntry[] = [
          { path: "/", changefreq: "daily", priority: "1.0", lastmod: TODAY },
          { path: "/projects", changefreq: "daily", priority: "0.8", lastmod: TODAY },
          { path: "/about", changefreq: "monthly", priority: "0.6" },
          { path: "/services", changefreq: "monthly", priority: "0.6" },
          { path: "/gallery", changefreq: "weekly", priority: "0.5" },
          { path: "/contact", changefreq: "monthly", priority: "0.7" },
          { path: "/plots/residential", changefreq: "weekly", priority: "0.7" },
          { path: "/plots/commercial", changefreq: "weekly", priority: "0.7" },
          { path: "/plots/agricultural", changefreq: "weekly", priority: "0.6" },
          { path: "/plots/industrial", changefreq: "weekly", priority: "0.6" },
          { path: "/plots-in/bangalore", changefreq: "weekly", priority: "0.8" },
          { path: "/plots-in/mysore", changefreq: "weekly", priority: "0.8" },
          { path: "/plots-in/hubli", changefreq: "weekly", priority: "0.7" },
          { path: "/plots-in/tumkur", changefreq: "weekly", priority: "0.7" },
          { path: "/blog", changefreq: "weekly", priority: "0.5" },
        ];

        // Project landing pages — highest priority, location-first URLs
        const projectPages: UrlEntry[] = dbProjects.map((p) => ({
          path: `/${generateLocationSlug(p)}`,
          changefreq: "weekly",
          priority: "0.9",
          lastmod: TODAY,
        }));

        // Legacy /projects/:slug redirects — still included so Google discovers the 301
        const legacyPages: UrlEntry[] = dbProjects.map((p) => ({
          path: `/projects/${p.slug}`,
          changefreq: "monthly",
          priority: "0.3",
        }));

        const allEntries = [...staticPages, ...projectPages, ...legacyPages];

        const urlTags = allEntries.map(({ path, changefreq, priority, lastmod }) => {
          const lines = [
            `  <url>`,
            `    <loc>${BASE_URL}${path}</loc>`,
            `    <changefreq>${changefreq}</changefreq>`,
            `    <priority>${priority}</priority>`,
          ];
          if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
          lines.push(`  </url>`);
          return lines.join("\n");
        });

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urlTags,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
