import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBlogs, saveBlog, deleteBlog } from "@/lib/blogs";
import { BlogPost } from "@/data/blog";
import { isSupabaseConfigured } from "@/lib/supabase";
import { CloudinaryUpload } from "@/components/ui/CloudinaryUpload";
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Loader2,
  AlertCircle,
  Eye,
  CheckCircle,
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

export const Route = createFileRoute("/admin/blogs")({
  component: AdminBlogsPage,
});

const defaultFormState = (): BlogPost => ({
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  date: "",
  readTime: "5 min read",
  category: "Investment Advisory",
  image: "",
});

function AdminBlogsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Dialog controls
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  // Form states
  const [formValues, setFormValues] = useState<BlogPost>(defaultFormState());
  const [isNewBlog, setIsNewBlog] = useState(true);

  // Fetch blogs
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });

  // Mutations
  const saveMutation = useMutation({
    mutationFn: ({ blog, isNew }: { blog: BlogPost; isNew: boolean }) =>
      saveBlog(blog, isNew),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success(isNewBlog ? "Blog post published." : "Blog post updated.");
      setIsOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save blog post.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (slug: string) => deleteBlog(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog post deleted.");
      setIsDeleting(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete blog post.");
    },
  });

  const openAddDialog = () => {
    setIsNewBlog(true);
    const currentDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    setFormValues({ ...defaultFormState(), date: currentDate });
    setIsOpen(true);
  };

  const openEditDialog = (blog: BlogPost) => {
    setIsNewBlog(false);
    setFormValues(blog);
    setIsOpen(true);
  };

  const openDeleteConfirm = (blog: BlogPost) => {
    setSelectedBlog(blog);
    setIsDeleting(true);
  };

  const handleTitleChange = (title: string) => {
    if (isNewBlog) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormValues((prev) => ({ ...prev, title, slug }));
    } else {
      setFormValues((prev) => ({ ...prev, title }));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formValues.slug) {
      toast.error("Slug is required.");
      return;
    }
    if (!formValues.image) {
      toast.error("Cover image is required.");
      return;
    }

    saveMutation.mutate({ blog: formValues, isNew: isNewBlog });
  };

  // Preview Parser Helper
  const renderMarkdownPreview = (text: string) => {
    if (!text) return <p className="text-muted-foreground/45 text-xs italic">Write markdown content to see preview...</p>;
    
    return text.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <br key={idx} />;

      if (trimmed.startsWith("# ")) {
        return <h1 key={idx} className="font-display text-2xl font-bold text-foreground mt-4 mb-2">{trimmed.slice(2)}</h1>;
      }
      if (trimmed.startsWith("## ")) {
        return <h2 key={idx} className="font-display text-xl font-bold text-foreground mt-3 mb-2 border-b border-border/80 pb-1">{trimmed.slice(3)}</h2>;
      }
      if (trimmed.startsWith("### ")) {
        return <h3 key={idx} className="font-display text-lg font-bold text-foreground mt-2 mb-1">{trimmed.slice(4)}</h3>;
      }
      if (trimmed.startsWith("* ")) {
        return <li key={idx} className="ml-5 list-disc text-muted-foreground text-sm my-1">{trimmed.slice(2)}</li>;
      }
      return <p key={idx} className="text-muted-foreground text-sm leading-relaxed my-2">{trimmed}</p>;
    });
  };

  // Filter & Search Logic
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === "All" || blog.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(blogs.map((b) => b.category)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-foreground font-bold">Blog CMS</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Write, edit, and publish dynamic guides and articles for the investment community.
          </p>
        </div>
        <Button
          onClick={openAddDialog}
          className="gold-gradient text-gold-foreground font-semibold flex items-center gap-2 cursor-pointer rounded-lg px-4 h-11"
        >
          <Plus className="w-5 h-5" /> Write Article
        </Button>
      </div>

      {/* Sandbox Alert */}
      {!isSupabaseConfigured && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex gap-3 text-amber-500 items-start text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Local Sandbox Mode Enabled</p>
            <p className="text-xs text-amber-500/80 mt-1">
              Currently editing local mock posts saved to your browser storage. Connect Supabase to sync them online.
            </p>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-card border border-border/80 p-4 rounded-xl shadow-card">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search articles by title, excerpt, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background border-border text-foreground focus-visible:ring-gold"
          />
        </div>
        <div className="w-full md:w-56">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="bg-background border-border text-foreground hover:bg-secondary/40 font-medium">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Blogs List Table */}
      {isLoading ? (
        <div className="flex justify-center py-20 bg-card border border-border/80 rounded-xl">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border/80 rounded-xl text-muted-foreground">
          No articles found. Write one to publish details.
        </div>
      ) : (
        <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-card animate-fade-up">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/70 border-b border-border/80 text-left">
                <tr>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">
                    Article Title & Cover
                  </th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs w-[18%]">
                    Category
                  </th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs w-[15%]">
                    Read Time
                  </th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs w-[15%]">
                    Published Date
                  </th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs text-right w-[15%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/80">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.slug} className="hover:bg-secondary/20 transition-colors">
                    {/* Cover & Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-16 h-10 object-cover rounded border border-border/80 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-display font-bold text-foreground text-base truncate max-w-[320px]" title={blog.title}>
                            {blog.title}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate max-w-[300px] mt-0.5">
                            {blog.excerpt}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 font-medium text-muted-foreground">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
                        {blog.category}
                      </span>
                    </td>

                    {/* Read Time */}
                    <td className="px-6 py-4 text-muted-foreground font-medium flex items-center gap-1.5 mt-2.5">
                      <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span>{blog.readTime}</span>
                    </td>

                    {/* Published Date */}
                    <td className="px-6 py-4 text-muted-foreground font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>{blog.date}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-muted-foreground hover:text-gold transition rounded-lg hover:bg-secondary"
                          title="View Live"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => openEditDialog(blog)}
                          className="p-2 text-muted-foreground hover:text-foreground transition rounded-lg hover:bg-secondary cursor-pointer"
                          title="Edit Article"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(blog)}
                          className="p-2 text-muted-foreground hover:text-destructive transition rounded-lg hover:bg-destructive/10 cursor-pointer"
                          title="Delete"
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

      {/* Blog Editor Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-card border-border text-foreground">
          <form onSubmit={handleFormSubmit} className="flex flex-col h-full">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl font-bold">
                {isNewBlog ? "Write New Article" : `Edit Article: ${formValues.title}`}
              </DialogTitle>
              <DialogDescription>
                Build guides and market analysis using Markdown formatting for rich layouts.
              </DialogDescription>
            </DialogHeader>

            {/* Split Screen Grid (Form on left, Live Preview on right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-6 border-t border-b border-border/80 my-4 overflow-y-auto">
              
              {/* Left Column: Form Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Article Title
                    </label>
                    <Input
                      value={formValues.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. 5 RERA Laws Every Buyer Must Know"
                      className="bg-background border-border text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Slug URL Key
                    </label>
                    <Input
                      value={formValues.slug}
                      onChange={(e) => setFormValues((v) => ({ ...v, slug: e.target.value }))}
                      placeholder="e.g. rera-laws-buyer-guide"
                      className="bg-background border-border text-foreground"
                      disabled={!isNewBlog}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Category
                    </label>
                    <Select
                      value={formValues.category}
                      onValueChange={(val) => setFormValues((v) => ({ ...v, category: val }))}
                    >
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Investment Advisory">Investment Advisory</SelectItem>
                        <SelectItem value="Legal & RERA">Legal & RERA</SelectItem>
                        <SelectItem value="Market Trends">Market Trends</SelectItem>
                        <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="Tips & Guides">Tips & Guides</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Read Time
                    </label>
                    <Input
                      value={formValues.readTime}
                      onChange={(e) => setFormValues((v) => ({ ...v, readTime: e.target.value }))}
                      placeholder="e.g. 5 min read"
                      className="bg-background border-border text-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Short Excerpt
                  </label>
                  <Textarea
                    value={formValues.excerpt}
                    onChange={(e) => setFormValues((v) => ({ ...v, excerpt: e.target.value }))}
                    placeholder="Provide a quick 1-2 sentence overview to display on the blog listing page..."
                    rows={2}
                    className="bg-background border-border text-foreground text-sm"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Full Content (Markdown Supported)
                  </label>
                  <Textarea
                    value={formValues.content}
                    onChange={(e) => setFormValues((v) => ({ ...v, content: e.target.value }))}
                    placeholder={`Write your article here. Supports Markdown:\n# Heading 1\n## Heading 2\n* Bullet Point\nPlain paragraphs.`}
                    rows={12}
                    className="bg-background border-border text-foreground font-mono text-sm leading-relaxed"
                    required
                  />
                </div>

                <div className="pt-2">
                  <CloudinaryUpload
                    label="Article Cover Image"
                    accept="image/*"
                    value={formValues.image}
                    onChange={(url) => setFormValues((v) => ({ ...v, image: url }))}
                  />
                </div>
              </div>

              {/* Right Column: Live Preview Panel */}
              <div className="bg-background/45 border border-border/80 rounded-xl p-5 flex flex-col max-h-[600px] overflow-y-auto">
                <div className="flex items-center gap-2 pb-3 border-b border-border/60 mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Eye className="w-4 h-4 text-gold" /> Live Page Preview
                </div>
                
                {/* Preview Layout */}
                <div className="flex-1 space-y-4">
                  {formValues.image && (
                    <div className="aspect-[21/9] w-full rounded-lg overflow-hidden border border-border/85 shadow-sm">
                      <img src={formValues.image} alt="Preview Cover" className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider">
                      {formValues.category}
                    </span>
                    <h1 className="font-display text-3xl font-bold text-foreground mt-2 leading-tight">
                      {formValues.title || "Untitled Article"}
                    </h1>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                      <span>Published: {formValues.date}</span>
                      <span>•</span>
                      <span>{formValues.readTime}</span>
                    </div>
                  </div>

                  {formValues.excerpt && (
                    <p className="text-sm font-medium border-l-2 border-gold pl-3 text-muted-foreground italic bg-secondary/10 py-1.5 rounded-r">
                      {formValues.excerpt}
                    </p>
                  )}

                  <article className="prose prose-stone max-w-none pt-2">
                    {renderMarkdownPreview(formValues.content)}
                  </article>
                </div>
              </div>

            </div>

            <DialogFooter className="gap-2">
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
                className="gold-gradient text-gold-foreground font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" /> Publish Article
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
              Delete Article?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete **{selectedBlog?.title}**? This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
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
              onClick={() => selectedBlog && deleteMutation.mutate(selectedBlog.slug)}
              disabled={deleteMutation.isPending}
              className="bg-destructive hover:bg-destructive/95 text-destructive-foreground font-semibold flex items-center gap-1.5 cursor-pointer"
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
