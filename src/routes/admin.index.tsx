import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { projects as mockProjectsList, Project, ProjectStatus } from "@/data/projects";
import { getEnquiries, Enquiry } from "@/lib/enquiries";
import {
  Building,
  Inbox,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Phone,
  User,
  ArrowRight,
  AlertCircle,
  Loader2,
  MapPin,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
} from "recharts";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

// Fetch projects helper (matching admin.projects.tsx)
const fetchProjects = async (): Promise<Project[]> => {
  if (!isSupabaseConfigured) {
    const local = localStorage.getItem("mk_projects");
    if (local) return JSON.parse(local);
    localStorage.setItem("mk_projects", JSON.stringify(mockProjectsList));
    return mockProjectsList;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((dbItem: any) => ({
    slug: dbItem.slug,
    name: dbItem.name,
    status: dbItem.status as ProjectStatus,
    city: dbItem.city,
    area: dbItem.area,
    landmark: dbItem.landmark || "",
    type: dbItem.type as any,
    sizes: dbItem.sizes || [],
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
  }));
};

function AdminOverview() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Projects & Enquiries
  const { data: projects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const { data: enquiries = [], isLoading: loadingEnquiries } = useQuery({
    queryKey: ["enquiries"],
    queryFn: getEnquiries,
  });

  if (loadingProjects || loadingEnquiries) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  // --- STATS COMPUTATION ---
  const totalSites = projects.length;
  const totalEnquiries = enquiries.length;

  const totalAvailablePlots = projects.reduce((acc, curr) => acc + curr.availablePlots, 0);
  const totalPlotsCount = projects.reduce((acc, curr) => acc + curr.totalPlots, 0);

  const reraApprovedSites = projects.filter((p) => p.rera && p.rera.trim().length > 0).length;

  // --- DATA PREPARATION FOR CHARTS ---
  // 1. Leads by Status
  const newLeads = enquiries.filter((e) => e.status === "New").length;
  const contactedLeads = enquiries.filter((e) => e.status === "Contacted").length;
  const closedLeads = enquiries.filter((e) => e.status === "Closed").length;

  const leadStatusData = [
    { name: "New", value: newLeads, color: "#f59e0b" },      // Amber
    { name: "Contacted", value: contactedLeads, color: "#3b82f6" }, // Blue
    { name: "Closed", value: closedLeads, color: "#10b981" },     // Emerald
  ].filter((item) => item.value > 0); // Only show statuses that have data

  // Fallback if no leads exist
  const hasLeads = leadStatusData.length > 0;
  const dummyLeadData = [
    { name: "New", value: 1, color: "#f59e0b" },
    { name: "Contacted", value: 2, color: "#3b82f6" },
    { name: "Closed", value: 1, color: "#10b981" }
  ];

  // 2. Plot Availability by Site (top 6 sites for clarity)
  const plotAvailabilityData = projects.slice(0, 6).map((p) => ({
    name: p.name.length > 15 ? `${p.name.slice(0, 15)}...` : p.name,
    Available: p.availablePlots,
    Sold: p.totalPlots - p.availablePlots,
  }));

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const recentEnquiries = enquiries.slice(0, 5);
  const recentProjects = projects.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl text-foreground font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time metrics, overview analytics, and quick shortcuts for MK Builders platform.
        </p>
      </div>

      {/* Sandbox Alert */}
      {!isSupabaseConfigured && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex gap-3 text-amber-500 items-start text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Local Sandbox Mode Enabled</p>
            <p className="text-xs text-amber-500/80 mt-1">
              Currently running in local preview mode. Ensure Supabase credentials are set in environment variables to read/write live database tables.
            </p>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Projects",
            value: totalSites,
            icon: Building,
            desc: "Active layout projects",
            color: "border-border/80 text-gold bg-secondary/10",
          },
          {
            title: "Total Enquiries",
            value: totalEnquiries,
            icon: Inbox,
            desc: "Client callback requests",
            color: "border-border/80 text-gold bg-secondary/10",
          },
          {
            title: "Available Plots",
            value: `${totalAvailablePlots} / ${totalPlotsCount}`,
            icon: TrendingUp,
            desc: "Unsold inventory plots",
            color: "border-border/80 text-gold bg-secondary/10",
          },
          {
            title: "RERA Approved",
            value: reraApprovedSites,
            icon: ShieldCheck,
            desc: "Registered layouts",
            color: "border-border/80 text-gold bg-secondary/10",
          },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-xl border flex flex-col justify-between shadow-card bg-card ${card.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {card.title}
                </span>
                <span className="w-9 h-9 rounded-lg bg-background/50 flex items-center justify-center text-gold">
                  <Icon className="w-5 h-5" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-display font-bold text-foreground">{card.value}</h3>
                <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts section */}
      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Site Availability Chart */}
          <div className="lg:col-span-2 bg-card border border-border/80 p-5 rounded-xl shadow-card flex flex-col">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">
              Plot Stock Status (Top 6 Sites)
            </h3>
            <div className="h-72 w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={plotAvailabilityData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="name" stroke="#888" fontSize={11} tickLine={false} />
                  <YAxis stroke="#888" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Bar dataKey="Available" fill="#d4af37" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Sold" fill="#2c2c2e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Enquiries Pie Chart */}
          <div className="bg-card border border-border/80 p-5 rounded-xl shadow-card flex flex-col">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">
              Leads by Status
            </h3>
            <div className="h-64 w-full relative flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hasLeads ? leadStatusData : dummyLeadData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {(hasLeads ? leadStatusData : dummyLeadData).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} opacity={hasLeads ? 1 : 0.4} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold font-display">{totalEnquiries}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Leads</span>
              </div>
            </div>

            {/* Legends */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border/60 text-center text-xs">
              <div>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5" />
                <span className="text-muted-foreground">New:</span>{" "}
                <strong className="text-foreground">{newLeads}</strong>
              </div>
              <div>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 mr-1.5" />
                <span className="text-muted-foreground">Contact:</span>{" "}
                <strong className="text-foreground">{contactedLeads}</strong>
              </div>
              <div>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5" />
                <span className="text-muted-foreground">Closed:</span>{" "}
                <strong className="text-foreground">{closedLeads}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-up">
        {/* Recent Enquiries */}
        <div className="bg-card border border-border/80 p-5 rounded-xl shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-border/80 mb-4">
              <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold" /> Recent Enquiries
              </h3>
              <Link
                to="/admin/enquiries"
                className="text-xs font-semibold text-gold hover:underline flex items-center gap-1"
              >
                All Enquiries <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentEnquiries.length === 0 ? (
              <p className="text-sm text-muted-foreground py-10 text-center">
                No lead enquiries recorded yet.
              </p>
            ) : (
              <div className="space-y-4">
                {recentEnquiries.map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition"
                  >
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-muted-foreground" /> {enquiry.name}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gold" /> {enquiry.phone} • {enquiry.city}
                      </p>
                      {enquiry.project_name && (
                        <p className="text-[10px] font-bold text-gold uppercase tracking-wider">
                          Interest: {enquiry.project_name}
                        </p>
                      )}
                    </div>
                    <div className="text-right space-y-1">
                      <span className="text-[10px] text-muted-foreground block">
                        {formatDate(enquiry.created_at)}
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          enquiry.status === "Closed"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : enquiry.status === "Contacted"
                              ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                              : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}
                      >
                        {enquiry.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Site Projects */}
        <div className="bg-card border border-border/80 p-5 rounded-xl shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-border/80 mb-4">
              <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                <Building className="w-5 h-5 text-gold" /> Active Projects
              </h3>
              <Link
                to="/admin/projects"
                className="text-xs font-semibold text-gold hover:underline flex items-center gap-1"
              >
                Manage Projects <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground py-10 text-center">
                No active layout projects created.
              </p>
            ) : (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div
                    key={project.slug}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-12 h-9 object-cover rounded border border-border/80 shrink-0"
                      />
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">{project.name}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-gold" /> {project.area}, {project.city}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="text-xs text-foreground font-bold block">
                        {project.availablePlots} / {project.totalPlots} Plots
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
