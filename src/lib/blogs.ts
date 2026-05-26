import { supabase, isSupabaseConfigured } from "./supabase";
import { blogPosts as mockBlogPosts, BlogPost } from "@/data/blog";

const LOCAL_STORAGE_KEY = "mk_blogs";

// Helper to get local blogs
const getLocalBlogs = (): BlogPost[] => {
  const local = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (local) {
    return JSON.parse(local);
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockBlogPosts));
  return mockBlogPosts;
};

// 1. Fetch all blogs
export const getBlogs = async (): Promise<BlogPost[]> => {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching blogs from Supabase:", error);
      // Fallback to static in case of database error
      return getLocalBlogs();
    }

    return (data || []).map((dbItem: any) => ({
      slug: dbItem.slug,
      title: dbItem.title,
      excerpt: dbItem.excerpt,
      content: dbItem.content,
      date: dbItem.date,
      readTime: dbItem.read_time,
      category: dbItem.category,
      image: dbItem.image,
    }));
  }

  return getLocalBlogs();
};

// 2. Fetch single blog by slug
export const getBlogBySlug = async (slug: string): Promise<BlogPost | null> => {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching blog by slug from Supabase:", error);
      // Fallback to local search
      const localBlogs = getLocalBlogs();
      return localBlogs.find((b) => b.slug === slug) || null;
    }

    if (!data) return null;

    return {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      date: data.date,
      readTime: data.read_time,
      category: data.category,
      image: data.image,
    };
  }

  const localBlogs = getLocalBlogs();
  return localBlogs.find((b) => b.slug === slug) || null;
};

// 3. Save blog (insert or update)
export const saveBlog = async (blog: BlogPost, isNew: boolean): Promise<void> => {
  const dbPayload = {
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt,
    content: blog.content,
    date: blog.date,
    read_time: blog.readTime,
    category: blog.category,
    image: blog.image,
  };

  if (isSupabaseConfigured) {
    if (isNew) {
      const { error } = await supabase.from("blogs").insert([dbPayload]);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("blogs")
        .update(dbPayload)
        .eq("slug", blog.slug);
      if (error) throw error;
    }
    return;
  }

  // Fallback to local storage
  const currentList = getLocalBlogs();
  let updatedList: BlogPost[];

  if (isNew) {
    if (currentList.some((b) => b.slug === blog.slug)) {
      throw new Error("A blog with this slug already exists.");
    }
    updatedList = [blog, ...currentList];
  } else {
    updatedList = currentList.map((b) => (b.slug === blog.slug ? blog : b));
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
};

// 4. Delete blog
export const deleteBlog = async (slug: string): Promise<void> => {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from("blogs").delete().eq("slug", slug);
    if (error) throw error;
    return;
  }

  const currentList = getLocalBlogs();
  const filteredList = currentList.filter((b) => b.slug !== slug);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredList));
};
