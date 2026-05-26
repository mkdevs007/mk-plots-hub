import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEnquiries, updateEnquiryStatus, deleteEnquiry, Enquiry } from "@/lib/enquiries";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  Inbox,
  Search,
  Trash2,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  Building,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Clock,
  PhoneCall,
  CheckSquare,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export const Route = createFileRoute("/admin/enquiries")({
  component: AdminEnquiriesPage,
});

function AdminEnquiriesPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  
  // Dialog state for delete confirmation
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  // React Query Queries
  const { data: enquiries = [], isLoading, error: queryError } = useQuery({
    queryKey: ["enquiries"],
    queryFn: getEnquiries,
  });

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: Enquiry["status"] }) =>
      updateEnquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      toast.success("Enquiry status updated.");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update status.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteEnquiry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      toast.success("Enquiry deleted successfully.");
      setIsDeleting(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete enquiry.");
    },
  });

  const openDeleteConfirm = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsDeleting(true);
  };

  const handleStatusChange = (id: number, status: Enquiry["status"]) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleConfirmDelete = () => {
    if (selectedEnquiry) {
      deleteMutation.mutate(selectedEnquiry.id);
    }
  };

  // Date Formatting Helper
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // Filter and Search Logic
  const filteredEnquiries = enquiries.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm) ||
      item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.project_name && item.project_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === "All" || item.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Export to CSV Function
  const handleExportCSV = () => {
    if (filteredEnquiries.length === 0) {
      toast.error("No lead enquiries available to export.");
      return;
    }
    const headers = [
      "Submission Date",
      "Client Name",
      "Phone Number",
      "City",
      "Plot Type Interest",
      "Project Interest",
      "Plot ID",
      "Custom Message",
      "Status",
    ];

    const rows = filteredEnquiries.map((e) => [
      formatDate(e.created_at),
      e.name,
      e.phone,
      e.city,
      e.plot_type,
      e.project_name || "General Enquiry",
      e.plot_id || "",
      e.message || "",
      e.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `mk_leads_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export downloaded successfully.");
  };

  // Stats Counters
  const totalCount = enquiries.length;
  const newCount = enquiries.filter((e) => e.status === "New").length;
  const contactedCount = enquiries.filter((e) => e.status === "Contacted").length;
  const closedCount = enquiries.filter((e) => e.status === "Closed").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-4xl text-foreground font-bold">User Enquiries & Leads</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review user callback requests, site enquiries, and project queries submitted across the website.
        </p>
      </div>

      {/* Local Storage Sandbox warning banner */}
      {!isSupabaseConfigured && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex gap-3 text-amber-500 items-start text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Local Sandbox Mode Enabled</p>
            <p className="text-xs text-amber-500/80 mt-1">
              Currently using mock enquiries saved to local storage. Connect Supabase credentials in your environment variables to link live submissions.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Enquiries",
            count: totalCount,
            icon: Inbox,
            color: "text-foreground bg-secondary/40 border-border/80",
          },
          {
            label: "New Leads",
            count: newCount,
            icon: Clock,
            color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
          },
          {
            label: "Contacted",
            count: contactedCount,
            icon: PhoneCall,
            color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
          },
          {
            label: "Closed / Deals",
            count: closedCount,
            icon: CheckSquare,
            color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-xl border flex items-center justify-between shadow-card ${stat.color}`}
            >
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-display font-bold mt-1.5">{stat.count}</h3>
              </div>
              <span className="w-12 h-12 rounded-lg bg-background/50 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6" />
              </span>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-card border border-border/80 p-4 rounded-xl shadow-card">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search enquiries by name, phone, city, or project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background border-border text-foreground focus-visible:ring-gold"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
          <div className="w-full sm:w-48">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-background border-border text-foreground hover:bg-secondary/40 font-medium h-10">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="border-border text-foreground hover:bg-secondary flex items-center gap-1.5 font-semibold cursor-pointer h-10 w-full sm:w-auto"
          >
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Leads Table */}
      {isLoading ? (
        <div className="flex justify-center py-20 bg-card border border-border/80 rounded-xl">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border/80 rounded-xl text-muted-foreground">
          No enquiries found matching your search.
        </div>
      ) : (
        <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-card animate-fade-up">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/70 border-b border-border/80 text-left">
                <tr>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs w-[18%]">
                    Date Submitted
                  </th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs w-[25%]">
                    User Contact
                  </th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs w-[22%]">
                    Preferred Plot
                  </th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs w-[20%]">
                    Enquiry Details
                  </th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs w-[15%] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/80">
                {filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-secondary/20 transition-colors">
                    {/* Date */}
                    <td className="px-6 py-4 text-muted-foreground font-medium whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gold shrink-0" />
                        <span>{formatDate(enquiry.created_at)}</span>
                      </div>
                    </td>

                    {/* Contact details */}
                    <td className="px-6 py-4">
                      <div>
                        <h4 className="font-semibold text-foreground text-base">{enquiry.name}</h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs">
                          {/* Quick Phone Call */}
                          <a
                            href={`tel:${enquiry.phone}`}
                            className="flex items-center gap-1 text-muted-foreground hover:text-gold transition font-medium"
                          >
                            <Phone className="w-3.5 h-3.5" /> {enquiry.phone}
                          </a>
                          
                          {/* Quick WhatsApp Action */}
                          <a
                            href={`https://wa.me/${enquiry.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-whatsapp font-medium hover:opacity-85 transition"
                          >
                            <MessageSquare className="w-3.5 h-3.5" /> Chat
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Plot details & Page source */}
                    <td className="px-6 py-4">
                      <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-background border border-border text-foreground">
                          {enquiry.plot_type}
                        </span>
                        
                        {enquiry.project_name ? (
                          <div className="flex items-center gap-1.5 mt-1.5 text-xs font-semibold text-gold">
                            <Building className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate max-w-[150px]">
                              {enquiry.project_name} {enquiry.plot_id ? `#${enquiry.plot_id}` : ""}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span>General Enquiry ({enquiry.city})</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Message or comments */}
                    <td className="px-6 py-4">
                      <p
                        className="text-muted-foreground text-xs leading-relaxed max-w-[250px] line-clamp-3"
                        title={enquiry.message || "No message provided."}
                      >
                        {enquiry.message || <em className="text-muted-foreground/50">No message</em>}
                      </p>
                    </td>

                    {/* Actions and Status update */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3.5">
                        {/* Status Select Trigger */}
                        <Select
                          value={enquiry.status}
                          onValueChange={(val) =>
                            handleStatusChange(enquiry.id, val as Enquiry["status"])
                          }
                        >
                          <SelectTrigger
                            className={`w-[125px] h-8 text-xs font-bold border transition ${
                              enquiry.status === "Closed"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : enquiry.status === "Contacted"
                                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                  : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            }`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="New" className="text-amber-500 font-bold">New</SelectItem>
                            <SelectItem value="Contacted" className="text-blue-500 font-bold">Contacted</SelectItem>
                            <SelectItem value="Closed" className="text-emerald-500 font-bold">Closed</SelectItem>
                          </SelectContent>
                        </Select>

                        {/* Delete Button */}
                        <button
                          onClick={() => openDeleteConfirm(enquiry)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition rounded-lg hover:bg-destructive/10 cursor-pointer"
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

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Delete Enquiry?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the enquiry from <strong>{selectedEnquiry?.name}</strong>? This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleting(false)}
              className="bg-background border-border text-foreground hover:bg-secondary cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
