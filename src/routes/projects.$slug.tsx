/**
 * Legacy route — /projects/:slug
 * Every request is 301-redirected to the new location-first SEO URL.
 * New canonical: /{area-slug}-{project-slug}
 * e.g. /projects/mk-brhat-samruddhi → /kenchanapura-nagarabhavi-ext-mk-brhat-samruddhi
 */
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { getProjectBySlug, generateLocationSlug } from "@/lib/projects";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    const project = await getProjectBySlug(params.slug);
    if (!project) throw notFound();
    throw redirect({
      href: `/${generateLocationSlug(project)}`,
      statusCode: 301,
    });
  },
  // Component is unreachable — loader always throws
  component: () => null,
});
