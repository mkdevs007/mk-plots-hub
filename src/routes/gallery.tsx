import { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/lib/projects";
import { SiteLayout } from "@/components/site/Layout";
import { SectionHeader } from "@/components/site/SectionHeader";
import {
  Play,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Video as VideoIcon,
  Loader2,
  MapPin,
} from "lucide-react";

export const Route = createFileRoute("/gallery")({
  loader: async () => {
    const list = await getProjects();
    return { initialProjects: list };
  },
  head: () => ({
    meta: [
      { title: "Project Gallery — Drone Photos & Site Progress | MK Builders & Developers" },
      {
        name: "description",
        content:
          "Aerial drone photos, site progress and walkthroughs from MK Builders & Developers layouts across Karnataka.",
      },
      { property: "og:title", content: "Gallery — MK Builders & Developers" },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: Gallery,
});

interface GalleryItem {
  id: string;
  type: "photo" | "video";
  src: string;
  title: string;
  location: string;
  category: "Residential" | "Commercial" | "Agricultural" | "Industrial";
  projectImage?: string;
}

function Gallery() {
  const { initialProjects } = Route.useLoaderData();
  const { data: projects = initialProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    initialData: initialProjects,
  });

  const [activeCity, setActiveCity] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(12);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const galleryItems = useMemo(() => {
    const items: GalleryItem[] = [];
    projects.forEach((p) => {
      // 1. Main layout image
      if (p.image) {
        items.push({
          id: `${p.slug}-main-image`,
          type: "photo",
          src: p.image,
          title: `${p.name} - Layout View`,
          location: p.city,
          category: (p.type.charAt(0).toUpperCase() + p.type.slice(1)) as any,
        });
      }

      // 2. Main video tour
      if (p.videoUrl) {
        items.push({
          id: `${p.slug}-main-video`,
          type: "video",
          src: p.videoUrl,
          title: `${p.name} - Drone Tour`,
          location: p.city,
          category: (p.type.charAt(0).toUpperCase() + p.type.slice(1)) as any,
          projectImage: p.image,
        });
      }

      // 3. Gallery images
      if (p.galleryImages && p.galleryImages.length > 0) {
        p.galleryImages.forEach((img, idx) => {
          items.push({
            id: `${p.slug}-gallery-img-${idx}`,
            type: "photo",
            src: img,
            title: `${p.name} - Site View #${idx + 1}`,
            location: p.city,
            category: (p.type.charAt(0).toUpperCase() + p.type.slice(1)) as any,
          });
        });
      }

      // 4. Gallery videos
      if (p.galleryVideos && p.galleryVideos.length > 0) {
        p.galleryVideos.forEach((vid, idx) => {
          items.push({
            id: `${p.slug}-gallery-vid-${idx}`,
            type: "video",
            src: vid,
            title: `${p.name} - Walkthrough #${idx + 1}`,
            location: p.city,
            category: (p.type.charAt(0).toUpperCase() + p.type.slice(1)) as any,
            projectImage: p.image,
          });
        });
      }
    });
    return items;
  }, [projects]);

  const photoItems = useMemo(() => {
    return galleryItems.filter((item) => item.type === "photo");
  }, [galleryItems]);

  const videoItems = useMemo(() => {
    return galleryItems.filter((item) => item.type === "video");
  }, [galleryItems]);

  // Apply City filter to both lists
  const filteredPhotos = useMemo(() => {
    return photoItems.filter((item) => activeCity === "all" || item.location.toLowerCase() === activeCity.toLowerCase());
  }, [photoItems, activeCity]);

  const filteredVideos = useMemo(() => {
    return videoItems.filter((item) => activeCity === "all" || item.location.toLowerCase() === activeCity.toLowerCase());
  }, [videoItems, activeCity]);

  // Reset pagination when city changes
  useEffect(() => {
    setVisibleCount(12);
  }, [activeCity]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : null,
        );
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredPhotos.length : null));
      }
      if (e.key === "Escape") {
        setLightboxIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredPhotos]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 12);
      setIsLoadingMore(false);
    }, 600);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : null,
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredPhotos.length : null));
  };

  const currentMedia = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return (
    <SiteLayout>
      {/* Page Header banner */}
      <section className="relative bg-[#1C0624] text-primary-foreground py-20 md:py-28 px-5 md:px-8 text-center overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,134,11,0.08),rgba(0,0,0,0))] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-gold text-xs font-semibold font-nav tracking-[0.25em] uppercase">
            In Pictures & Videos
          </span>
          <h1 className="mt-4 font-display text-4xl md:text-6xl lg:text-7xl leading-tight">
            Our projects, captured
          </h1>
          <p className="mt-4 text-sm md:text-base text-primary-foreground/75 max-w-xl mx-auto leading-relaxed">
            Take a high-definition tour of our gated layouts, industrial subdivisions, and
            agricultural estates across Karnataka's fastest-growing regions.
          </p>
        </div>
      </section>

      {/* Main Gallery Control Section */}
      <section className="py-12 md:py-16 px-5 md:px-8 bg-background text-foreground animate-fade-in">
        <div className="max-w-7xl mx-auto">
          {/* Header & City Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8 mb-12">
            <div className="mb-0 max-w-md">
              <SectionHeader
                center={false}
                eyebrow="Media Center"
                title="Filter by category & city"
              />
            </div>

            {/* City Subfilters */}
            <div className="flex flex-wrap items-center gap-1.5 shrink-0 self-start md:self-end">
              {[
                { label: "All Cities", value: "all" },
                { label: "Bangalore", value: "bangalore" },
                { label: "Mysore", value: "mysore" },
                { label: "Hubli", value: "hubli" },
                { label: "Tumkur", value: "tumkur" },
              ].map((city) => (
                <button
                  key={city.value}
                  onClick={() => setActiveCity(city.value)}
                  className={`px-3.5 py-1 rounded-full text-xs transition border ${
                    activeCity === city.value
                      ? "border-gold text-gold bg-gold/5"
                      : "border-border text-muted-foreground hover:border-muted hover:text-foreground"
                  }`}
                >
                  {city.label}
                </button>
              ))}
            </div>
          </div>

          {filteredPhotos.length === 0 && filteredVideos.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-muted-foreground text-base">
                No media matches the selected city.
              </p>
              <button
                onClick={() => {
                  setActiveCity("all");
                }}
                className="mt-4 text-xs font-semibold text-gold hover:underline"
              >
                Clear city filter
              </button>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Section 1: Drone Tour & Walkthrough Videos */}
              <div>
                <div className="flex items-center gap-2 mb-6 border-b border-border/40 pb-3">
                  <VideoIcon className="w-5 h-5 text-gold" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground font-semibold">Drone Tours & Walkthroughs</h2>
                  <span className="text-xs text-muted-foreground ml-2 font-nav">({filteredVideos.length} Videos)</span>
                </div>

                {filteredVideos.length === 0 ? (
                  <p className="text-sm text-muted-foreground/60 italic py-4">No videos uploaded for the selected city.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredVideos.map((item) => (
                      <div key={item.id} className="relative aspect-video rounded-2xl overflow-hidden shadow-card-hover border border-border bg-black">
                        <video
                          src={item.src}
                          controls
                          playsInline
                          className="w-full h-full object-cover"
                          poster={item.projectImage}
                        />
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold font-nav tracking-widest px-2.5 py-1 rounded-full uppercase">
                          {item.title}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 2: Gated Layouts & Site Images */}
              <div>
                <div className="flex items-center gap-2 mb-6 border-b border-border/40 pb-3">
                  <ImageIcon className="w-5 h-5 text-gold" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground font-semibold">Layout Plans & Site Photos</h2>
                  <span className="text-xs text-muted-foreground ml-2 font-nav">({filteredPhotos.length} Photos)</span>
                </div>

                {filteredPhotos.length === 0 ? (
                  <p className="text-sm text-muted-foreground/60 italic py-4">No photos uploaded for the selected city.</p>
                ) : (
                  <>
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {filteredPhotos.slice(0, visibleCount).map((item, index) => (
                        <div
                          key={item.id}
                          onClick={() => setLightboxIndex(index)}
                          className="group relative cursor-pointer overflow-hidden rounded-xl bg-card border border-border aspect-[4/3] transition-all hover:border-gold/50 shadow-card hover:-translate-y-1 duration-300"
                        >
                          <img
                            src={item.src}
                            alt={item.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                          />
                          {/* Glassmorphic hover overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <div className="flex items-center gap-1.5 text-gold text-[10px] tracking-wider uppercase font-semibold font-nav">
                              <MapPin className="w-3.5 h-3.5 shrink-0" />
                              <span>
                                {item.location} • {item.category}
                              </span>
                            </div>
                            <h3 className="mt-1 font-display text-lg text-primary-foreground font-semibold leading-tight line-clamp-1">
                              {item.title}
                            </h3>
                            <span className="mt-2 inline-flex items-center gap-1 text-xs text-primary-foreground/70 font-medium">
                              <Eye className="w-3.5 h-3.5" /> View Photo
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Load More Button */}
                    {visibleCount < filteredPhotos.length && (
                      <div className="mt-12 text-center">
                        <button
                          onClick={handleLoadMore}
                          disabled={isLoadingMore}
                          className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-border text-foreground font-semibold font-nav hover:border-gold hover:text-gold transition-all duration-300 min-w-44 text-sm disabled:opacity-60 cursor-pointer"
                        >
                          {isLoadingMore ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-gold" /> Loading...
                            </>
                          ) : (
                            "Load More"
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal Dialog Portal */}
      {lightboxIndex !== null && currentMedia && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between items-center p-4 md:p-8 animate-fade"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Control Bar */}
          <div className="w-full flex items-center justify-between z-10 text-white/80">
            <div className="text-xs md:text-sm font-medium tracking-wide">
              Photo View ({lightboxIndex + 1} of {filteredPhotos.length})
            </div>

            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2 hover:bg-white/10 hover:text-white rounded-full transition"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Media Center Content */}
          <div className="relative flex items-center justify-center w-full max-w-5xl h-[65vh] md:h-[75vh]">
            {/* Left Button */}
            <button
              onClick={handlePrev}
              className="absolute left-0 md:-left-16 z-25 p-3 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition"
              aria-label="Previous Media"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Main Media wrapper */}
            <div
              className="relative max-w-full max-h-full flex items-center justify-center overflow-hidden rounded-lg bg-black/40 border border-white/5"
              onClick={(e) => e.stopPropagation()} // Prevent closing
            >
              <img
                src={currentMedia.src}
                alt={currentMedia.title}
                className="max-w-full max-h-[65vh] md:max-h-[75vh] object-contain select-none"
              />
            </div>

            {/* Right Button */}
            <button
              onClick={handleNext}
              className="absolute right-0 md:-right-16 z-25 p-3 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition"
              aria-label="Next Media"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Title & Details Bar */}
          <div className="w-full text-center max-w-lg mx-auto z-10 p-4">
            <h2 className="font-display text-xl md:text-2xl text-primary-foreground font-semibold">
              {currentMedia.title}
            </h2>
            <div className="mt-1 flex items-center justify-center gap-2 text-xs text-primary-foreground/60 tracking-wider">
              <span>{currentMedia.location}</span>
              <span>•</span>
              <span>{currentMedia.category} Plots</span>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
