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
      return JSON.parse(local);
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
    startingPrice: dbItem.starting_price,
    priceLakh: Number(dbItem.price_lakh),
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
  }));
};

// Shared function to retrieve a specific project by slug
export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
  const allProjects = await getProjects();
  return allProjects.find((p) => p.slug === slug) || null;
};
