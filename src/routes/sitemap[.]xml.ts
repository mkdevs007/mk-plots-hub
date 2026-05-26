import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getProjects } from "@/lib/projects";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const dbProjects = await getProjects();
        const paths = [
          "/",
          "/projects",
          "/plots/residential",
          "/plots/commercial",
          "/plots/agricultural",
          "/plots/industrial",
          "/services",
          "/gallery",
          "/about",
          "/contact",
          ...dbProjects.map((p) => `/projects/${p.slug}`),
        ];
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...paths.map(
            (p) => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`,
          ),
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
