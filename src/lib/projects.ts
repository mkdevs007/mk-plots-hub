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
