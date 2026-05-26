import { supabase, isSupabaseConfigured } from "./supabase";

export interface Enquiry {
  id: number;
  created_at: string;
  name: string;
  phone: string;
  city: string;
  plot_type: string;
  message?: string;
  project_name?: string;
  plot_id?: string;
  status: "New" | "Contacted" | "Closed";
}

// Key for local storage fallback
const LOCAL_STORAGE_KEY = "mk_enquiries";

// Mock default enquiries to make the UI look rich even in offline mode
const MOCK_ENQUIRIES: Enquiry[] = [
  {
    id: 1,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    city: "Bangalore",
    plot_type: "Residential",
    message: "Interested in 30x40 plots at MK Green Valley. Please call.",
    project_name: "MK Green Valley",
    status: "New",
  },
  {
    id: 2,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    name: "Priya Sharma",
    phone: "+91 91234 56789",
    city: "Mysore",
    plot_type: "Commercial",
    message: "Looking for commercial spaces for showroom.",
    project_name: "MK Royal Heights",
    status: "Contacted",
  },
  {
    id: 3,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    name: "Amit Patel",
    phone: "+91 88888 77777",
    city: "Tumkur",
    plot_type: "Agricultural",
    message: "Want to schedule a site visit for Kunigal farm plots.",
    project_name: "MK Agri Estates",
    status: "Closed",
  },
];

// Helper to get local enquiries
const getLocalEnquiries = (): Enquiry[] => {
  const local = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (local) {
    return JSON.parse(local);
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_ENQUIRIES));
  return MOCK_ENQUIRIES;
};

// 1. Submit an enquiry
export const submitEnquiry = async (
  enquiryData: Omit<Enquiry, "id" | "created_at" | "status">
): Promise<void> => {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from("enquiries").insert([
      {
        name: enquiryData.name,
        phone: enquiryData.phone,
        city: enquiryData.city,
        plot_type: enquiryData.plot_type,
        message: enquiryData.message || null,
        project_name: enquiryData.project_name || null,
        plot_id: enquiryData.plot_id || null,
        status: "New",
      },
    ]);
    if (error) throw error;
    return;
  }

  // Fallback to local storage
  const currentList = getLocalEnquiries();
  const newEnquiry: Enquiry = {
    ...enquiryData,
    id: Date.now(),
    created_at: new Date().toISOString(),
    status: "New",
  };
  currentList.unshift(newEnquiry);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentList));
};

// 2. Fetch all enquiries
export const getEnquiries = async (): Promise<Enquiry[]> => {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching enquiries from Supabase:", error);
      throw error;
    }

    return (data || []).map((dbItem: any) => ({
      id: dbItem.id,
      created_at: dbItem.created_at,
      name: dbItem.name,
      phone: dbItem.phone,
      city: dbItem.city,
      plot_type: dbItem.plot_type,
      message: dbItem.message || "",
      project_name: dbItem.project_name || "",
      plot_id: dbItem.plot_id || "",
      status: dbItem.status || "New",
    }));
  }

  return getLocalEnquiries();
};

// 3. Update enquiry status
export const updateEnquiryStatus = async (
  id: number,
  status: "New" | "Contacted" | "Closed"
): Promise<void> => {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from("enquiries")
      .update({ status })
      .eq("id", id);
    if (error) throw error;
    return;
  }

  const currentList = getLocalEnquiries();
  const updatedList = currentList.map((item) =>
    item.id === id ? { ...item, status } : item
  );
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
};

// 4. Delete an enquiry
export const deleteEnquiry = async (id: number): Promise<void> => {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from("enquiries").delete().eq("id", id);
    if (error) throw error;
    return;
  }

  const currentList = getLocalEnquiries();
  const filteredList = currentList.filter((item) => item.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredList));
};
