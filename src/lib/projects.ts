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

export function parseAreaFromSize(sizeStr: string): number | null {
  const clean = sizeStr.toLowerCase().trim();
  
  // 1. Matches "30x40" or "30 x 40" or "30*40"
  const dimensionsMatch = clean.match(/(\d+(?:\.\d+)?)\s*[x*]\s*(\d+(?:\.\d+)?)/);
  if (dimensionsMatch) {
    const w = parseFloat(dimensionsMatch[1]);
    const h = parseFloat(dimensionsMatch[2]);
    if (!isNaN(w) && !isNaN(h)) {
      return w * h;
    }
  }
  
  // 2. Matches "1/4 acre" or "0.25 acre" or "1 acre"
  if (clean.includes("acre")) {
    const acreMatch = clean.match(/(\d+(?:\.\d+)?)\s*acre/);
    if (acreMatch) {
      const val = parseFloat(acreMatch[1]);
      if (!isNaN(val)) return val * 43560; // 1 acre = 43560 sq ft
    }
    if (clean.includes("1/4") || clean.includes("0.25")) return 10890;
    if (clean.includes("1/2") || clean.includes("0.5")) return 21780;
    if (clean.includes("1") || clean.startsWith("one")) return 43560;
  }
  
  // 3. Matches "1200+ sq.ft" or "1200 sqft" or "1200"
  const numberMatch = clean.match(/(\d+[\d,]*)/);
  if (numberMatch) {
    const val = parseFloat(numberMatch[1].replace(/,/g, ""));
    if (!isNaN(val)) return val;
  }
  
  return null;
}

export function getEffectivePriceLakh(p: Project): number | undefined {
  // If priceLakh is explicitly set and > 0, return it
  if (p.priceLakh && p.priceLakh > 0) {
    return p.priceLakh;
  }
  
  // If startingPrice is price per sqft (e.g. "1499" or "₹1,499/Sq.Ft")
  if (p.startingPrice) {
    const cleanStr = p.startingPrice.trim();
    if (
      cleanStr.toLowerCase().includes("sq.ft") ||
      cleanStr.toLowerCase().includes("sqft") ||
      cleanStr.toLowerCase().includes("sq ft") ||
      /^\d+$/.test(cleanStr)
    ) {
      const numericStr = cleanStr.replace(/[^0-9]/g, "");
      const priceSqft = numericStr ? parseInt(numericStr, 10) : 0;
      if (priceSqft > 0 && p.sizes && p.sizes.length > 0) {
        // Parse the smallest size's area to get starting price
        let minArea: number | null = null;
        for (const sizeStr of p.sizes) {
          const area = parseAreaFromSize(sizeStr);
          if (area !== null) {
            if (minArea === null || area < minArea) {
              minArea = area;
            }
          }
        }
        if (minArea !== null) {
          return parseFloat(((minArea * priceSqft) / 100000).toFixed(2));
        }
      }
    }
  }
  
  return p.priceLakh;
}

export function formatStartingPrice(startingPrice?: string): string {
  if (!startingPrice) return "Price on Request";
  
  const cleanStr = startingPrice.trim();
  if (cleanStr === "" || cleanStr.toLowerCase() === "price on request" || cleanStr.toLowerCase() === "on request") {
    return "Price on Request";
  }
  if (cleanStr === "Sold Out" || cleanStr.toLowerCase() === "sold out") {
    return "Sold Out";
  }
  
  // If it's a raw numeric string (e.g., "1499")
  if (/^\d+$/.test(cleanStr)) {
    const priceVal = parseInt(cleanStr, 10);
    if (priceVal >= 100) {
      return `₹${new Intl.NumberFormat('en-IN').format(priceVal)}/Sq.Ft`;
    } else {
      return `₹${priceVal} Lakh`;
    }
  }
  
  // If it's already formatted (e.g. contains "₹", "Lakh" or "/Sq.Ft"), return it as is
  return cleanStr;
}

