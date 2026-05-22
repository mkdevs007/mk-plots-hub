import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
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
  id: number;
  type: "photo" | "video";
  src: string;
  title: string;
  location: string;
  category: "Residential" | "Commercial" | "Agricultural" | "Industrial";
}

const GALLERY_ITEMS: GalleryItem[] = [
  // 3 Videos
  {
    id: 1,
    type: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-residential-suburb-structure-40078-large.mp4",
    title: "Aerial Gated Layout Tour",
    location: "Bangalore",
    category: "Residential",
  },
  {
    id: 2,
    type: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-green-suburb-with-residential-houses-40081-large.mp4",
    title: "Green Meadows Plot Walkthrough",
    location: "Mysore",
    category: "Residential",
  },
  {
    id: 3,
    type: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-aerial-drone-shot-of-suburban-houses-in-a-green-40077-large.mp4",
    title: "Tumkur Agri Estate Walkthrough",
    location: "Tumkur",
    category: "Agricultural",
  },
  // 50 Photos
  {
    id: 4,
    type: "photo",
    src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop",
    title: "Green Valley Phase 1",
    location: "Bangalore",
    category: "Residential",
  },
  {
    id: 5,
    type: "photo",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    title: "Royal Heights Central Park",
    location: "Mysore",
    category: "Residential",
  },
  {
    id: 6,
    type: "photo",
    src: "https://images.unsplash.com/photo-1444653389962-8149286c578a?q=80&w=1200&auto=format&fit=crop",
    title: "Industrial Park Road Layout",
    location: "Hubli",
    category: "Industrial",
  },
  {
    id: 7,
    type: "photo",
    src: "https://images.unsplash.com/photo-1524813686514-a57563d77d61?q=80&w=1200&auto=format&fit=crop",
    title: "Devanahalli Highway Access Plots",
    location: "Bangalore",
    category: "Commercial",
  },
  {
    id: 8,
    type: "photo",
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    title: "Mysore Commercial Hub",
    location: "Mysore",
    category: "Commercial",
  },
  {
    id: 9,
    type: "photo",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    title: "Premium Gated Villa Plots",
    location: "Bangalore",
    category: "Residential",
  },
  {
    id: 10,
    type: "photo",
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
    title: "Luxury Estate Entrance",
    location: "Mysore",
    category: "Residential",
  },
  {
    id: 11,
    type: "photo",
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
    title: "Model Villa Plot Site",
    location: "Bangalore",
    category: "Residential",
  },
  {
    id: 12,
    type: "photo",
    src: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200&auto=format&fit=crop",
    title: "MK Meadows Estate",
    location: "Tumkur",
    category: "Agricultural",
  },
  {
    id: 13,
    type: "photo",
    src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
    title: "Tumkur Agri Plot Entry",
    location: "Tumkur",
    category: "Agricultural",
  },
  {
    id: 14,
    type: "photo",
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop",
    title: "Hills View Farm Estate",
    location: "Tumkur",
    category: "Agricultural",
  },
  {
    id: 15,
    type: "photo",
    src: "https://images.unsplash.com/photo-1500627869374-13ad9960a16f?q=80&w=1200&auto=format&fit=crop",
    title: "Golden Field Farm Plots",
    location: "Tumkur",
    category: "Agricultural",
  },
  {
    id: 16,
    type: "photo",
    src: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=1200&auto=format&fit=crop",
    title: "Aerial Plot Boundaries",
    location: "Bangalore",
    category: "Residential",
  },
  {
    id: 17,
    type: "photo",
    src: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?q=80&w=1200&auto=format&fit=crop",
    title: "Shady Grove Walking Track",
    location: "Bangalore",
    category: "Residential",
  },
  {
    id: 18,
    type: "photo",
    src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
    title: "MK Signature Villa Site",
    location: "Mysore",
    category: "Residential",
  },
  {
    id: 19,
    type: "photo",
    src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop",
    title: "Royal Enclave Plot Layout",
    location: "Mysore",
    category: "Residential",
  },
  {
    id: 20,
    type: "photo",
    src: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=1200&auto=format&fit=crop",
    title: "Leveling Plot Infrastructure",
    location: "Hubli",
    category: "Industrial",
  },
  {
    id: 21,
    type: "photo",
    src: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop",
    title: "Foundation Plot Setup",
    location: "Hubli",
    category: "Industrial",
  },
  {
    id: 22,
    type: "photo",
    src: "https://images.unsplash.com/photo-1503387873171-db3b29047319?q=80&w=1200&auto=format&fit=crop",
    title: "Avenue Plantation & Trees",
    location: "Bangalore",
    category: "Residential",
  },
  {
    id: 23,
    type: "photo",
    src: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop",
    title: "Lakeside Agricultural Land",
    location: "Tumkur",
    category: "Agricultural",
  },
  {
    id: 24,
    type: "photo",
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    title: "Highland Retreat Plots",
    location: "Tumkur",
    category: "Agricultural",
  },
  {
    id: 25,
    type: "photo",
    src: "https://images.unsplash.com/photo-1472214222541-d510753a4907?q=80&w=1200&auto=format&fit=crop",
    title: "Green Meadow Farm Plots",
    location: "Tumkur",
    category: "Agricultural",
  },
  {
    id: 26,
    type: "photo",
    src: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop",
    title: "Agri Plot Boundary Fencing",
    location: "Tumkur",
    category: "Agricultural",
  },
  {
    id: 27,
    type: "photo",
    src: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200&auto=format&fit=crop",
    title: "Children's Play Park Site",
    location: "Bangalore",
    category: "Residential",
  },
  {
    id: 28,
    type: "photo",
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
    title: "Mountain View Agri Estate",
    location: "Tumkur",
    category: "Agricultural",
  },
  {
    id: 29,
    type: "photo",
    src: "https://images.unsplash.com/photo-1531834685988-c596400c490d?q=80&w=1200&auto=format&fit=crop",
    title: "Commercial Office Plot Land",
    location: "Hubli",
    category: "Commercial",
  },
  {
    id: 30,
    type: "photo",
    src: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=1200&auto=format&fit=crop",
    title: "Internal Concrete Road Layout",
    location: "Bangalore",
    category: "Residential",
  },
  {
    id: 31,
    type: "photo",
    src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200&auto=format&fit=crop",
    title: "River-facing Farmland",
    location: "Tumkur",
    category: "Agricultural",
  },
  {
    id: 32,
    type: "photo",
    src: "https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?q=80&w=1200&auto=format&fit=crop",
    title: "Eco-Friendly Agri Enclave",
    location: "Tumkur",
    category: "Agricultural",
  },
  {
    id: 33,
    type: "photo",
    src: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=1200&auto=format&fit=crop",
    title: "Industrial Storage Site",
    location: "Hubli",
    category: "Industrial",
  },
  {
    id: 34,
    type: "photo",
    src: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=1200&auto=format&fit=crop",
    title: "Gated Layout Aerial Progress",
    location: "Bangalore",
    category: "Residential",
  },
  {
    id: 35,
    type: "photo",
    src: "https://images.unsplash.com/photo-1592595896551-12b371d546d5?q=80&w=1200&auto=format&fit=crop",
    title: "Water Overhead Tank Site",
    location: "Bangalore",
    category: "Residential",
  },
  {
    id: 36,
    type: "photo",
    src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
    title: "Luxury Villa Plot Phase 2",
    location: "Bangalore",
    category: "Residential",
  },
  {
    id: 37,
    type: "photo",
    src: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=1200&auto=format&fit=crop",
    title: "Commercial Logistics Plot",
    location: "Hubli",
    category: "Industrial",
  },
  {
    id: 38,
    type: "photo",
    src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop",
    title: "Logistics Hub Warehouse Land",
    location: "Hubli",
    category: "Industrial",
  },
  {
    id: 39,
    type: "photo",
    src: "https://images.unsplash.com/photo-1558036117-09d930fe741d?q=80&w=1200&auto=format&fit=crop",
    title: "Blacktop Internal Road",
    location: "Bangalore",
    category: "Residential",
  },
  {
    id: 40,
    type: "photo",
    src: "https://images.unsplash.com/photo-1590073844006-33379778ae09?q=80&w=1200&auto=format&fit=crop",
    title: "Tech Park Adjacent Plots",
    location: "Bangalore",
    category: "Commercial",
  },
  {
    id: 41,
    type: "photo",
    src: "https://images.unsplash.com/photo-1576085898312-78975977e914?q=80&w=1200&auto=format&fit=crop",
    title: "Coconut Plantation Plot",
    location: "Tumkur",
    category: "Agricultural",
  },
  {
    id: 42,
    type: "photo",
    src: "https://images.unsplash.com/photo-1501854140026-f78ee44d7b5b?q=80&w=1200&auto=format&fit=crop",
    title: "Agri Farm House Plots",
    location: "Tumkur",
    category: "Agricultural",
  },
  {
    id: 43,
    type: "photo",
    src: "https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?q=80&w=1200&auto=format&fit=crop",
    title: "Entrance Gate Structure",
    location: "Bangalore",
    category: "Residential",
  },
  {
    id: 44,
    type: "photo",
    src: "https://images.unsplash.com/photo-1523348837708-1552a59116e5?q=80&w=1200&auto=format&fit=crop",
    title: "Organic Farm Plots",
    location: "Tumkur",
    category: "Agricultural",
  },
  {
    id: 45,
    type: "photo",
    src: "https://images.unsplash.com/photo-1464207687583-18056ecf6e33?q=80&w=1200&auto=format&fit=crop",
    title: "Paved Footpath Site",
    location: "Bangalore",
    category: "Residential",
  },
  {
    id: 46,
    type: "photo",
    src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop",
    title: "Community Center Park",
    location: "Mysore",
    category: "Residential",
  },
  {
    id: 47,
    type: "photo",
    src: "https://images.unsplash.com/photo-1599809275671-678a1f81d11a?q=80&w=1200&auto=format&fit=crop",
    title: "Topographical Surveying",
    location: "Bangalore",
    category: "Residential",
  },
  {
    id: 48,
    type: "photo",
    src: "https://images.unsplash.com/photo-1591955502621-c8a79a744a9b?q=80&w=1200&auto=format&fit=crop",
    title: "Plot Stone Markers",
    location: "Bangalore",
    category: "Residential",
  },
  {
    id: 49,
    type: "photo",
    src: "https://images.unsplash.com/photo-1507035895480-2a3a58c2278a?q=80&w=1200&auto=format&fit=crop",
    title: "Connecting Road Boulevard",
    location: "Mysore",
    category: "Residential",
  },
  {
    id: 50,
    type: "photo",
    src: "https://images.unsplash.com/photo-1560518883-ce09059ee7fa?q=80&w=1200&auto=format&fit=crop",
    title: "Completed Layout Banner View",
    location: "Bangalore",
    category: "Residential",
  },
  {
    id: 51,
    type: "photo",
    src: "https://images.unsplash.com/photo-1510798831974-d51b4c682164?q=80&w=1200&auto=format&fit=crop",
    title: "Commercial Gated Layout",
    location: "Mysore",
    category: "Commercial",
  },
  {
    id: 52,
    type: "photo",
    src: "https://images.unsplash.com/photo-1572120360610-d38702f23ebd?q=80&w=1200&auto=format&fit=crop",
    title: "Residential Layout Phase 3",
    location: "Bangalore",
    category: "Residential",
  },
  {
    id: 53,
    type: "photo",
    src: "https://images.unsplash.com/photo-1585412727339-3a6a10787a7d?q=80&w=1200&auto=format&fit=crop",
    title: "Drainage Infrastructure Setup",
    location: "Bangalore",
    category: "Residential",
  },
];

function Gallery() {
  const [activeTab, setActiveTab] = useState<"all" | "photos" | "videos">("all");
  const [activeCity, setActiveCity] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(12);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Apply both Tab filters and City filters
  const filteredItems = GALLERY_ITEMS.filter((item) => {
    const matchesTab = activeTab === "all" || item.type === activeTab.slice(0, -1);
    const matchesCity =
      activeCity === "all" || item.location.toLowerCase() === activeCity.toLowerCase();
    return matchesTab && matchesCity;
  });

  // Reset pagination when filter changes
  useEffect(() => {
    setVisibleCount(12);
  }, [activeTab, activeCity]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null,
        );
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : null));
      }
      if (e.key === "Escape") {
        setLightboxIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredItems]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 12);
      setIsLoadingMore(false);
    }, 600); // Premium delay feeling
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null,
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : null));
  };

  const currentMedia = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <SiteLayout>
      {/* Page Header banner */}
      <section className="relative bg-[#1C0624] text-primary-foreground py-20 md:py-28 px-5 md:px-8 text-center overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,134,11,0.08),rgba(0,0,0,0))] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-gold text-xs font-semibold tracking-[0.25em] uppercase">
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
      <section className="py-12 md:py-16 px-5 md:px-8 bg-background text-foreground">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
            <SectionHeader
              center={false}
              eyebrow="Media Center"
              title="Filter by category & city"
              className="mb-0 max-w-md"
            />

            {/* Filter controls wrapper */}
            <div className="flex flex-col gap-4 shrink-0">
              {/* Media Type Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-card border border-border rounded-full self-start md:self-end">
                {(["all", "photos", "videos"] as const).map((tab) => {
                  const count =
                    tab === "all"
                      ? GALLERY_ITEMS.length
                      : GALLERY_ITEMS.filter((i) => i.type === tab.slice(0, -1)).length;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                        activeTab === tab
                          ? "gold-gradient text-gold-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)} ({count})
                    </button>
                  );
                })}
              </div>

              {/* City Subfilters */}
              <div className="flex flex-wrap items-center gap-1.5">
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
          </div>

          {/* Media Grid */}
          {filteredItems.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-muted-foreground text-base">
                No media matches the selected filters.
              </p>
              <button
                onClick={() => {
                  setActiveTab("all");
                  setActiveCity("all");
                }}
                className="mt-4 text-xs font-semibold text-gold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredItems.slice(0, visibleCount).map((item, index) => {
                  return (
                    <div
                      key={item.id}
                      onClick={() => setLightboxIndex(index)}
                      className="group relative cursor-pointer overflow-hidden rounded-xl bg-card border border-border aspect-[4/3] transition-all hover:border-gold/50 shadow-card hover:-translate-y-1 duration-300"
                    >
                      {item.type === "photo" ? (
                        <img
                          src={item.src}
                          alt={`${item.title} at ${item.location}`}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          {/* Video thumbnail fallback or simple poster representation */}
                          <video
                            src={item.src}
                            preload="metadata"
                            muted
                            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/30" />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-gold group-hover:text-gold-foreground transition-all duration-300">
                            <Play className="w-5 h-5 fill-current translate-x-0.5" />
                          </div>
                        </div>
                      )}

                      {/* Glassmorphic hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <div className="flex items-center gap-1.5 text-gold text-[10px] tracking-wider uppercase font-semibold">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {item.location} • {item.category}
                          </span>
                        </div>
                        <h3 className="mt-1 font-display text-lg text-primary-foreground font-semibold leading-tight line-clamp-1">
                          {item.title}
                        </h3>
                        <span className="mt-2 inline-flex items-center gap-1 text-xs text-primary-foreground/70 font-medium">
                          {item.type === "video" ? (
                            <>
                              <VideoIcon className="w-3.5 h-3.5" /> Play Video
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5" /> View Photo
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load More Button */}
              {visibleCount < filteredItems.length && (
                <div className="mt-12 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-border text-foreground font-semibold hover:border-gold hover:text-gold transition-all duration-300 min-w-44 text-sm disabled:opacity-60"
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
              {currentMedia.type === "video" ? "Video View" : "Photo View"} ({lightboxIndex + 1} of{" "}
              {filteredItems.length})
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
              {currentMedia.type === "photo" ? (
                <img
                  src={currentMedia.src}
                  alt={currentMedia.title}
                  className="max-w-full max-h-[65vh] md:max-h-[75vh] object-contain select-none"
                />
              ) : (
                <video
                  src={currentMedia.src}
                  controls
                  autoPlay
                  className="max-w-full max-h-[65vh] md:max-h-[75vh] object-contain"
                />
              )}
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
