import { supabase, isSupabaseConfigured } from "./supabase";
import { projects as mockProjectsList, Project, ProjectStatus } from "@/data/projects";

// Shared function to retrieve projects from either Supabase or fallback local storage
export const getProjects = async (): Promise<Project[]> => {
  if (!isSupabaseConfigured) {
    if (typeof window === "undefined") {
      return mockProjectsList;
    }
    const local = localStorage.getItem("mk_projects");
    if (local) {
      try {
        const parsed = JSON.parse(local) as Project[];
        let updated = false;
        const synced = parsed.map((p) => {
          const mock = mockProjectsList.find((m) => m.slug === p.slug);
          if (mock) {
            let merged = { ...p };
            for (const key of Object.keys(mock) as Array<keyof Project>) {
              if (p[key] === undefined || p[key] === null || p[key] === "") {
                (merged as any)[key] = mock[key];
                updated = true;
              }
            }
            return merged;
          }
          return p;
        });
        if (updated) {
          localStorage.setItem("mk_projects", JSON.stringify(synced));
        }
        return synced;
      } catch (e) {
        console.error("Error parsing local storage projects:", e);
      }
    }
    localStorage.setItem("mk_projects", JSON.stringify(mockProjectsList));
    return mockProjectsList;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects from Supabase:", error);
    // Graceful fallback to static list in case of network/db issues
    return mockProjectsList;
  }

  return (data || []).map((dbItem: any) => ({
    slug: dbItem.slug,
    name: dbItem.name,
    status: dbItem.status as ProjectStatus,
    city: dbItem.city,
    area: dbItem.area,
    landmark: dbItem.landmark || "",
    type: dbItem.type as any,
    sizes: dbItem.sizes || [],
    sizePrices: dbItem.size_prices || [],
    totalPlots: dbItem.total_plots,
    availablePlots: dbItem.available_plots,
    startingPrice: dbItem.starting_price || undefined,
    priceLakh: dbItem.price_lakh !== null && dbItem.price_lakh !== undefined ? Number(dbItem.price_lakh) : undefined,
    amenities: dbItem.amenities || [],
    rera: dbItem.rera || "",
    image: dbItem.image,
    videoUrl: dbItem.video_url || "",
    galleryImages: dbItem.gallery_images || [],
    galleryVideos: dbItem.gallery_videos || [],
    description: dbItem.description,
    progressTimeline: dbItem.progress_timeline || [],
    layoutPdfUrl: dbItem.layout_pdf_url || "",
    nearbyPlaces: dbItem.nearby_places || [],
    faqs: dbItem.faqs || [],
    mapLink: dbItem.map_link || "",
  }));
};

// Shared function to retrieve a specific project by slug
export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
  const allProjects = await getProjects();
  return allProjects.find((p) => p.slug === slug) || null;
};

export interface ApprovalDetails {
  type: "RERA" | "DTCP" | "MUDA" | "BDA";
  number: string;
}

// ─── SEO URL Helpers ────────────────────────────────────────────────────────

/**
 * Derives a location-first URL slug: {area-slug}-{project-slug}
 * e.g. "Kenchanapura, Nagarabhavi Ext." + "mk-brhat-samruddhi"
 *      → "kenchanapura-nagarabhavi-ext-mk-brhat-samruddhi"
 * Works automatically for admin-added projects.
 */
export function generateLocationSlug(project: Project): string {
  const areaSlug = project.area
    .replace(/\./g, "")        // "R.T." → "RT"
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${areaSlug}-${project.slug}`;
}

/** Find a project by its computed location slug */
export async function getProjectByLocationSlug(
  locationSlug: string,
): Promise<Project | null> {
  const all = await getProjects();
  return all.find((p) => generateLocationSlug(p) === locationSlug) ?? null;
}

/**
 * Build a rich keyword string from every piece of project data.
 * Used in the <meta name="keywords"> tag on project landing pages.
 */
export function generateProjectKeywords(project: Project): string {
  const approval = parseApproval(project.rera);
  const areaTerms = project.area
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
  const kws: string[] = [];

  areaTerms.forEach((area) => {
    kws.push(`plots in ${area}`);
    kws.push(`sites for sale in ${area}`);
    kws.push(`${area} ${project.type} plots`);
    kws.push(`${area} plots for sale`);
  });

  kws.push(
    `plots in ${project.city}`,
    `${project.city} plots for sale`,
    `${project.city} ${project.type} plots`,
    `${approval.type} approved plots ${project.city}`,
    `RERA approved plots ${project.city}`,
    `gated community plots ${project.city}`,
    `${project.type} plots Karnataka`,
    `${project.type} sites Karnataka`,
  );

  project.sizes.forEach((size) => kws.push(`${size} ${project.type} plot`));

  if (project.landmark) kws.push(`plots near ${project.landmark}`);

  (project.nearbyPlaces ?? []).slice(0, 5).forEach((pl) =>
    kws.push(`plots near ${pl.name}`),
  );

  if (project.startingPrice) {
    kws.push(`plots starting ${project.startingPrice}`);
  }

  kws.push(
    "MK Builders Developers",
    "MK Builders Bangalore",
    "buy plots Karnataka",
    "plotted development Karnataka",
  );

  return [...new Set(kws)].join(", ");
}

export function parseApproval(reraString: string | undefined | null): ApprovalDetails {
  const str = (reraString || "").trim();
  if (str.includes("|")) {
    const [type, num] = str.split("|");
    const parsedType = (type || "RERA").trim().toUpperCase();
    return {
      type: (parsedType === "DTCP" || parsedType === "MUDA" || parsedType === "BDA" ? parsedType : "RERA") as any,
      number: (num || "").trim(),
    };
  }

  // Backwards compatibility for existing plain RERA numbers or empty strings
  if (!str) {
    return {
      type: "RERA",
      number: "",
    };
  }

  // If the string starts with "RERA", "DTCP", "MUDA", or "BDA" case-insensitive
  const upper = str.toUpperCase();
  if (upper.startsWith("RERA:")) {
    return { type: "RERA", number: str.slice(5).trim() };
  }
  if (upper.startsWith("DTCP:")) {
    return { type: "DTCP", number: str.slice(5).trim() };
  }
  if (upper.startsWith("MUDA:")) {
    return { type: "MUDA", number: str.slice(5).trim() };
  }
  if (upper.startsWith("BDA:")) {
    return { type: "BDA", number: str.slice(4).trim() };
  }

  return {
    type: "RERA",
    number: str,
  };
}
