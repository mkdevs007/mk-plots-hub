import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { projects as mockProjectsList, Project, ProjectStatus, SizePrice, ProgressMilestone, NearbyPlace, NearbyCategory } from "@/data/projects";
import { parseApproval, generateLocationSlug } from "@/lib/projects";
import { CloudinaryUpload } from "@/components/ui/CloudinaryUpload";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  MapPin,
  ExternalLink,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/projects")({
  component: AdminDashboard,
});

// Helper functions for Database interactions
const fetchProjectsFromDb = async (): Promise<Project[]> => {
  if (!isSupabaseConfigured) {
    // Read from localStorage first, fallback to mock data
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
    throw error;
  }

  // Map db snake_case keys back to camelCase Project properties
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

const saveProjectToDb = async (project: Project, isNew: boolean) => {
  const dbPayload = {
    slug: project.slug,
    name: project.name,
    status: project.status,
    city: project.city,
    area: project.area,
    landmark: project.landmark,
    type: project.type,
    sizes: project.sizes,
    size_prices: project.sizePrices || [],
    total_plots: project.totalPlots,
    available_plots: project.availablePlots,
    starting_price: project.startingPrice || "",
    price_lakh: project.priceLakh !== undefined && project.priceLakh !== null && !isNaN(project.priceLakh) ? project.priceLakh : 0,
    amenities: project.amenities,
    rera: project.rera,
    image: project.image,
    video_url: project.videoUrl || null,
    gallery_images: project.galleryImages || [],
    gallery_videos: project.galleryVideos || [],
    description: project.description,
    progress_timeline: project.progressTimeline || [],
    layout_pdf_url: project.layoutPdfUrl || null,
    nearby_places: project.nearbyPlaces || [],
    faqs: project.faqs || [],
    map_link: project.mapLink || null,
  };

  if (!isSupabaseConfigured) {
    const local = localStorage.getItem("mk_projects");
    let currentList: Project[] = local ? JSON.parse(local) : [...mockProjectsList];

    if (isNew) {
      // Check duplicate slug
      if (currentList.some((p) => p.slug === project.slug)) {
        throw new Error("A project with this slug already exists.");
      }
      currentList.unshift(project);
    } else {
      currentList = currentList.map((p) => (p.slug === project.slug ? project : p));
    }

    localStorage.setItem("mk_projects", JSON.stringify(currentList));
    return;
  }

  if (isNew) {
    const { error } = await supabase.from("projects").insert([dbPayload]);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("projects")
      .update(dbPayload)
      .eq("slug", project.slug);
    if (error) throw error;
  }
};

const deleteProjectFromDb = async (slug: string) => {
  if (!isSupabaseConfigured) {
    const local = localStorage.getItem("mk_projects");
    if (local) {
      const currentList: Project[] = JSON.parse(local);
      const filtered = currentList.filter((p) => p.slug !== slug);
      localStorage.setItem("mk_projects", JSON.stringify(filtered));
    }
    return;
  }

  const { error } = await supabase.from("projects").delete().eq("slug", slug);
  if (error) throw error;
};

// Initial state for form
const defaultFormState = (): Project => ({
  slug: "",
  name: "",
  status: "New Launch",
  city: "Bangalore",
  area: "",
  landmark: "",
  type: "residential",
  sizes: ["30x40", "30x50"],
  sizePrices: [],
  totalPlots: 100,
  availablePlots: 100,
  startingPrice: "",
  priceLakh: undefined,
  amenities: ["Road", "Water", "Electricity", "Security"],
  rera: "",
  image: "",
  videoUrl: "",
  galleryImages: [],
  galleryVideos: [],
  description: "",
  progressTimeline: [],
  layoutPdfUrl: "",
  nearbyPlaces: [],
  mapLink: "",
});

const NEARBY_CATEGORIES: { value: NearbyCategory; label: string }[] = [
  { value: "airport", label: "Airport" },
  { value: "railway", label: "Railway Station" },
  { value: "highway", label: "Highway / Main Road" },
  { value: "school", label: "School / College" },
  { value: "hospital", label: "Hospital / Clinic" },
  { value: "market", label: "Market / Mall" },
  { value: "it_park", label: "IT Park / Tech Hub" },
  { value: "other", label: "Other" },
];

function AdminDashboard() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState("All");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  
  // Dialog controls
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Form states
  const [formValues, setFormValues] = useState<Project>(defaultFormState());
  const [isNewProject, setIsNewProject] = useState(true);
  const [sizesInput, setSizesInput] = useState("30x40, 30x50");
  const [amenitiesInput, setAmenitiesInput] = useState("Road, Water, Electricity, Security");
  const [showNewCityInput, setShowNewCityInput] = useState(false);
  const [sizePrices, setSizePrices] = useState<SizePrice[]>([]);
  const [progressTimeline, setProgressTimeline] = useState<ProgressMilestone[]>([]);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [approvalType, setApprovalType] = useState<"RERA" | "DTCP" | "MUDA" | "BDA">("RERA");
  const [approvalNumber, setApprovalNumber] = useState<string>("");

  // React Query queries
  const { data: projects = [], isLoading, error: queryError } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjectsFromDb,
  });

  // Mutations
  const saveMutation = useMutation({
    mutationFn: ({ project, isNew }: { project: Project; isNew: boolean }) =>
      saveProjectToDb(project, isNew),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(isNewProject ? "Project created successfully." : "Project updated successfully.");
      setIsOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save project.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (slug: string) => deleteProjectFromDb(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully.");
      setIsDeleting(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete project.");
    },
  });

  const openAddDialog = () => {
    setIsNewProject(true);
    setFormValues(defaultFormState());
    setSizesInput("30x40, 30x50");
    setAmenitiesInput("Road, Water, Electricity, Security");
    setSizePrices([]);
    setProgressTimeline([]);
    setNearbyPlaces([]);
    setShowNewCityInput(false);
    setApprovalType("RERA");
    setApprovalNumber("");
    setIsOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setIsNewProject(false);
    setFormValues(project);
    setSizesInput(project.sizes.join(", "));
    setAmenitiesInput(project.amenities.join(", "));
    setSizePrices(project.sizePrices || []);
    setProgressTimeline(project.progressTimeline || []);
    setNearbyPlaces(project.nearbyPlaces || []);
    setShowNewCityInput(false);
    const apprv = parseApproval(project.rera);
    setApprovalType(apprv.type);
    setApprovalNumber(apprv.number);
    setIsOpen(true);
  };

  const openDeleteConfirm = (project: Project) => {
    setSelectedProject(project);
    setIsDeleting(true);
  };

  const handleNameChange = (name: string) => {
    if (isNewProject) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormValues((prev) => ({ ...prev, name, slug }));
    } else {
      setFormValues((prev) => ({ ...prev, name }));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formValues.slug) {
      toast.error("Slug is required.");
      return;
    }
    if (!formValues.image) {
      toast.error("Main layout image is required.");
      return;
    }

    const sizes = sizesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const amenities = amenitiesInput
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    const reraCombined = `${approvalType}|${(approvalNumber || "").trim()}`;

    const finalProject: Project = {
      ...formValues,
      rera: reraCombined,
      sizes,
      amenities,
      sizePrices: sizePrices.filter((r) => r.size.trim()),
      progressTimeline: progressTimeline.filter((m) => m.title.trim()),
      nearbyPlaces: nearbyPlaces.filter((n) => n.name.trim()),
    };

    saveMutation.mutate({ project: finalProject, isNew: isNewProject });
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = filterCity === "All" || p.city === filterCity;

    return matchesSearch && matchesCity;
  });

  const uniqueCities = Array.from(new Set(projects.map((p) => p.city)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-foreground font-bold">Project Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add, update, or remove layout sites displayed on the main platform.
          </p>
        </div>
        <Button
          onClick={openAddDialog}
          className="gold-gradient text-gold-foreground font-semibold flex items-center gap-2 cursor-pointer rounded-lg px-4 h-11"
        >
          <Plus className="w-5 h-5" /> Add New Site
        </Button>
      </div>

      {!isSupabaseConfigured && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex gap-3 text-amber-500 items-start text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Local Sandbox Mode Enabled</p>
            <p className="text-xs text-amber-500/80 mt-1">
              Changes are saved to local browser storage (`localStorage`) for testing. To sync to database, configure your Supabase environment variables.
            </p>
          </div>
        </div>
      )}

      {/* Toolbar filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-card border border-border/80 p-4 rounded-xl shadow-card">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search projects by name, city, area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background border-border text-foreground focus-visible:ring-gold"
          />
        </div>
        <div className="w-full md:w-56">
          <Select value={filterCity} onValueChange={setFilterCity}>
            <SelectTrigger className="bg-background border-border text-foreground hover:bg-secondary/40 font-medium">
              <SelectValue placeholder="Filter by City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Cities</SelectItem>
              {uniqueCities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Table */}
      {isLoading ? (
        <div className="flex justify-center py-20 bg-card border border-border/80 rounded-xl">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border/80 rounded-xl text-muted-foreground">
          No projects found. Create one to get started.
        </div>
      ) : (
        <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/70 border-b border-border/80 text-left">
                <tr>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">
                    Site Details
                  </th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">
                    Type
                  </th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">
                    Status
                  </th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">
                    Availability
                  </th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">
                    Price
                  </th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/80">
                {filteredProjects.map((project) => (
                  <tr key={project.slug} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-14 h-10 object-cover rounded border border-border/80 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-display text-lg font-bold truncate text-foreground">
                            {project.name}
                          </h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-gold" /> {project.area}, {project.city}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize text-muted-foreground font-medium">
                      {project.type}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          project.status === "Completed"
                            ? "bg-badge-done-bg text-badge-done-fg"
                            : project.status === "New Launch"
                              ? "bg-badge-new-bg text-badge-new-fg"
                              : project.status === "Few Plots Left"
                                ? "bg-badge-few-bg text-badge-few-fg"
                                : "bg-badge-ongoing-bg text-badge-ongoing-fg"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-medium">
                      {project.availablePlots} / {project.totalPlots} Plots
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">
                      {project.startingPrice}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* SEO URL pill — copy for Meta Ads / Google */}
                      <div className="mb-2 flex items-center justify-end gap-1.5">
                        <span className="text-[10px] font-nav text-muted-foreground/60 truncate max-w-[180px]">
                          /{generateLocationSlug(project)}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`https://themkdevelopers.com/${generateLocationSlug(project)}`);
                            setCopiedSlug(project.slug);
                            setTimeout(() => setCopiedSlug(null), 2000);
                          }}
                          title="Copy landing page URL for Meta Ads"
                          className="p-1 text-muted-foreground hover:text-gold transition rounded cursor-pointer"
                        >
                          {copiedSlug === project.slug
                            ? <Check className="w-3.5 h-3.5 text-emerald-500" />
                            : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/${generateLocationSlug(project)}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Open live landing page"
                          className="p-2 text-muted-foreground hover:text-gold transition rounded-lg hover:bg-secondary"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => openEditDialog(project)}
                          className="p-2 text-muted-foreground hover:text-foreground transition rounded-lg hover:bg-secondary cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(project)}
                          className="p-2 text-muted-foreground hover:text-destructive transition rounded-lg hover:bg-destructive/10 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border text-foreground">
          <form onSubmit={handleFormSubmit}>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl font-bold">
                {isNewProject ? "Add New Project Site" : `Edit Project: ${formValues.name}`}
              </DialogTitle>
              <DialogDescription>
                Fill out the form below to construct your dynamic site layout information.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Project Name
                </label>
                <Input
                  value={formValues.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="E.g. MK Royal Valley"
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Site Slug (URL key)
                </label>
                <Input
                  value={formValues.slug}
                  onChange={(e) => setFormValues((v) => ({ ...v, slug: e.target.value }))}
                  placeholder="e.g. mk-royal-valley"
                  className="bg-background border-border text-foreground"
                  disabled={!isNewProject}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </label>
                <Select
                  value={formValues.status}
                  onValueChange={(val) => setFormValues((v) => ({ ...v, status: val as ProjectStatus }))}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="New Launch">New Launch</SelectItem>
                    <SelectItem value="Few Plots Left">Few Plots Left</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Layout Type
                </label>
                <Select
                  value={formValues.type}
                  onValueChange={(val) => setFormValues((v) => ({ ...v, type: val as any }))}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="agricultural">Agricultural</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  City
                </label>
                {showNewCityInput ? (
                  <div className="flex gap-2">
                    <Input
                      value={formValues.city}
                      onChange={(e) => setFormValues((v) => ({ ...v, city: e.target.value }))}
                      placeholder="Enter new city name"
                      className="bg-background border-border text-foreground flex-1"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowNewCityInput(false);
                        setFormValues((v) => ({ ...v, city: uniqueCities[0] || "Bangalore" }));
                      }}
                      className="border-border text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Select
                    value={formValues.city}
                    onValueChange={(val) => {
                      if (val === "ADD_NEW_CITY") {
                        setShowNewCityInput(true);
                        setFormValues((v) => ({ ...v, city: "" }));
                      } else {
                        setFormValues((v) => ({ ...v, city: val }));
                      }
                    }}
                  >
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueCities.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                      <SelectItem value="ADD_NEW_CITY" className="text-gold font-semibold">
                        + Add New City...
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Area/Region
                </label>
                <Input
                  value={formValues.area}
                  onChange={(e) => setFormValues((v) => ({ ...v, area: e.target.value }))}
                  placeholder="E.g. Devanahalli"
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Landmark description
                </label>
                <Input
                  value={formValues.landmark}
                  onChange={(e) => setFormValues((v) => ({ ...v, landmark: e.target.value }))}
                  placeholder="E.g. 5 km from airport road"
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Approval Type
                  </label>
                  <Select
                    value={approvalType}
                    onValueChange={(val: any) => setApprovalType(val)}
                  >
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RERA">RERA Approved</SelectItem>
                      <SelectItem value="DTCP">DTCP Approved</SelectItem>
                      <SelectItem value="MUDA">MUDA Approved</SelectItem>
                      <SelectItem value="BDA">BDA Approved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Approval No. (Optional)
                  </label>
                  <Input
                    value={approvalNumber}
                    onChange={(e) => setApprovalNumber(e.target.value)}
                    placeholder="E.g. PRM/KA/RERA/..."
                    className="bg-background border-border text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Sizes (comma-separated)
                </label>
                <Input
                  value={sizesInput}
                  onChange={(e) => setSizesInput(e.target.value)}
                  placeholder="E.g. 30x40, 30x50, 40x60"
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Amenities (comma-separated)
                </label>
                <Input
                  value={amenitiesInput}
                  onChange={(e) => setAmenitiesInput(e.target.value)}
                  placeholder="E.g. Road, Water, Electricity, Park"
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Plots count
                </label>
                <Input
                  type="number"
                  value={formValues.totalPlots}
                  onChange={(e) =>
                    setFormValues((v) => ({ ...v, totalPlots: parseInt(e.target.value) || 0 }))
                  }
                  className="bg-background border-border text-foreground"
                  min={0}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Available Plots count
                </label>
                <Input
                  type="number"
                  value={formValues.availablePlots}
                  onChange={(e) =>
                    setFormValues((v) => ({ ...v, availablePlots: parseInt(e.target.value) || 0 }))
                  }
                  className="bg-background border-border text-foreground"
                  min={0}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Starting Price label
                </label>
                <Input
                  value={formValues.startingPrice ?? ""}
                  onChange={(e) => setFormValues((v) => ({ ...v, startingPrice: e.target.value }))}
                  placeholder="E.g. ₹18 Lakh or Sold Out"
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Price in Lakhs (numerical)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formValues.priceLakh ?? ""}
                  onChange={(e) =>
                    setFormValues((v) => ({ ...v, priceLakh: e.target.value ? parseFloat(e.target.value) : undefined }))
                  }
                  className="bg-background border-border text-foreground"
                  min={0}
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Google Maps Location Link
                </label>
                <Input
                  value={formValues.mapLink ?? ""}
                  onChange={(e) => setFormValues((v) => ({ ...v, mapLink: e.target.value }))}
                  placeholder="E.g. https://maps.app.goo.gl/..."
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Project Description
                </label>
                <Textarea
                  value={formValues.description}
                  onChange={(e) => setFormValues((v) => ({ ...v, description: e.target.value }))}
                  placeholder="Describe details regarding this project layout..."
                  rows={4}
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>

              {/* Cloudinary Asset Uploaders */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-border/85 pt-4">
                <CloudinaryUpload
                  label="Main Layout Thumbnail"
                  accept="image/*"
                  value={formValues.image}
                  onChange={(url) => setFormValues((v) => ({ ...v, image: url }))}
                />

                <CloudinaryUpload
                  label="Main Walkthrough Video"
                  accept="video/*"
                  value={formValues.videoUrl || ""}
                  onChange={(url) => setFormValues((v) => ({ ...v, videoUrl: url }))}
                />

                <CloudinaryUpload
                  label="Gallery Layout Images (Multiple)"
                  accept="image/*"
                  multiple
                  value={formValues.galleryImages || []}
                  onChange={(urls) => setFormValues((v) => ({ ...v, galleryImages: urls }))}
                />

                <CloudinaryUpload
                  label="Gallery Walkthrough Videos (Multiple)"
                  accept="video/*"
                  multiple
                  value={formValues.galleryVideos || []}
                  onChange={(urls) => setFormValues((v) => ({ ...v, galleryVideos: urls }))}
                />

                <div className="md:col-span-2">
                  <CloudinaryUpload
                    label="Layout Plan PDF (Download button on project page)"
                    accept=".pdf,application/pdf"
                    value={formValues.layoutPdfUrl || ""}
                    onChange={(url) => setFormValues((v) => ({ ...v, layoutPdfUrl: url }))}
                  />
                </div>
              </div>

              {/* Per-size Pricing */}
              <div className="md:col-span-2 border-t border-border/85 pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Plot Availability Pricing (per size)
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Set exact prices per size shown on the project page. If left empty, prices are auto-calculated from the base price above.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-border text-xs cursor-pointer"
                    onClick={() => setSizePrices((prev) => [...prev, { size: "", price: "" }])}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Row
                  </Button>
                </div>
                {sizePrices.length === 0 ? (
                  <p className="text-xs text-muted-foreground/60 italic py-2">
                    No size pricing set — auto-calculated from base price.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {sizePrices.map((row, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <Input
                          value={row.size}
                          onChange={(e) => {
                            const updated = [...sizePrices];
                            updated[idx] = { ...updated[idx], size: e.target.value };
                            setSizePrices(updated);
                          }}
                          placeholder="Size (e.g. 30x40)"
                          className="bg-background border-border text-foreground text-sm"
                        />
                        <Input
                          value={row.price}
                          onChange={(e) => {
                            const updated = [...sizePrices];
                            updated[idx] = { ...updated[idx], price: e.target.value };
                            setSizePrices(updated);
                          }}
                          placeholder="Price (e.g. ₹18 Lakh)"
                          className="bg-background border-border text-foreground text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setSizePrices((prev) => prev.filter((_, i) => i !== idx))}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition rounded cursor-pointer shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Nearby Places */}
              <div className="md:col-span-2 border-t border-border/85 pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Nearby Landmarks & Distances
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Shown as "What's Nearby" on the project page — add key distances from the plot.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-border text-xs cursor-pointer"
                    onClick={() =>
                      setNearbyPlaces((prev) => [
                        ...prev,
                        { name: "", distance: "", category: "other" },
                      ])
                    }
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Place
                  </Button>
                </div>
                {nearbyPlaces.length === 0 ? (
                  <p className="text-xs text-muted-foreground/60 italic py-2">
                    No nearby places added yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {nearbyPlaces.map((place, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <select
                          value={place.category}
                          onChange={(e) => {
                            const updated = [...nearbyPlaces];
                            updated[idx] = { ...updated[idx], category: e.target.value as NearbyCategory };
                            setNearbyPlaces(updated);
                          }}
                          className="bg-background border border-border text-foreground text-sm rounded-md px-3 py-2 w-44 shrink-0 focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none"
                        >
                          {NEARBY_CATEGORIES.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                          ))}
                        </select>
                        <Input
                          value={place.name}
                          onChange={(e) => {
                            const updated = [...nearbyPlaces];
                            updated[idx] = { ...updated[idx], name: e.target.value };
                            setNearbyPlaces(updated);
                          }}
                          placeholder="Place name (e.g. Kempegowda Airport)"
                          className="bg-background border-border text-foreground text-sm flex-1"
                        />
                        <Input
                          value={place.distance}
                          onChange={(e) => {
                            const updated = [...nearbyPlaces];
                            updated[idx] = { ...updated[idx], distance: e.target.value };
                            setNearbyPlaces(updated);
                          }}
                          placeholder="Distance (e.g. 8 km)"
                          className="bg-background border-border text-foreground text-sm w-32 shrink-0"
                        />
                        <button
                          type="button"
                          onClick={() => setNearbyPlaces((prev) => prev.filter((_, i) => i !== idx))}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition rounded cursor-pointer shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Construction Progress Timeline */}
              <div className="md:col-span-2 border-t border-border/85 pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Layout Construction Progress
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Timeline milestones shown on the project detail page. Leave empty to use default.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-border text-xs cursor-pointer"
                    onClick={() =>
                      setProgressTimeline((prev) => [
                        ...prev,
                        { date: "", title: "", desc: "", done: false },
                      ])
                    }
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Milestone
                  </Button>
                </div>
                {progressTimeline.length === 0 ? (
                  <p className="text-xs text-muted-foreground/60 italic py-2">
                    No milestones added — default timeline will be shown.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {progressTimeline.map((item, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-xl border border-border bg-background p-4 space-y-2.5"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setProgressTimeline((prev) => prev.filter((_, i) => i !== idx))
                          }
                          className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-destructive transition rounded cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-2 gap-2 pr-8">
                          <Input
                            value={item.date}
                            onChange={(e) => {
                              const updated = [...progressTimeline];
                              updated[idx] = { ...updated[idx], date: e.target.value };
                              setProgressTimeline(updated);
                            }}
                            placeholder="Date (e.g. Jan 2025)"
                            className="bg-secondary/30 border-border text-foreground text-sm"
                          />
                          <Input
                            value={item.title}
                            onChange={(e) => {
                              const updated = [...progressTimeline];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setProgressTimeline(updated);
                            }}
                            placeholder="Milestone title"
                            className="bg-secondary/30 border-border text-foreground text-sm"
                          />
                        </div>
                        <Textarea
                          value={item.desc}
                          onChange={(e) => {
                            const updated = [...progressTimeline];
                            updated[idx] = { ...updated[idx], desc: e.target.value };
                            setProgressTimeline(updated);
                          }}
                          placeholder="Brief description of work done or planned..."
                          rows={2}
                          className="bg-secondary/30 border-border text-foreground text-sm"
                        />
                        <label className="flex items-center gap-2 cursor-pointer w-fit">
                          <input
                            type="checkbox"
                            checked={item.done}
                            onChange={(e) => {
                              const updated = [...progressTimeline];
                              updated[idx] = { ...updated[idx], done: e.target.checked };
                              setProgressTimeline(updated);
                            }}
                            className="w-4 h-4 accent-gold cursor-pointer"
                          />
                          <span className="text-xs text-muted-foreground font-medium">
                            Mark as completed
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="border-t border-border pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="bg-background border-border text-foreground hover:bg-secondary cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saveMutation.isPending}
                className="gold-gradient text-gold-foreground font-semibold flex items-center gap-1 cursor-pointer"
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" /> Save Project
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-bold text-destructive">
              Delete Project
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete **{selectedProject?.name}**? This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleting(false)}
              className="bg-background border-border text-foreground hover:bg-secondary cursor-pointer"
            >
              No, Keep It
            </Button>
            <Button
              type="button"
              onClick={() => selectedProject && deleteMutation.mutate(selectedProject.slug)}
              disabled={deleteMutation.isPending}
              className="bg-destructive hover:bg-destructive/95 text-destructive-foreground font-semibold flex items-center gap-1 cursor-pointer"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" /> Yes, Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
