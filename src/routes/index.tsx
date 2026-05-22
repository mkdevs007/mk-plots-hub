import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import heroImg from "@/assets/hero-aerial.jpg";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import {
  ArrowRight,
  ChevronDown,
  Award,
  ShieldCheck,
  MapPin,
  IndianRupee,
  Users,
  Building2,
  Home,
  Store,
  Trees,
  Factory,
  Star,
  Play,
  Phone,
} from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ProjectCard } from "@/components/site/ProjectCard";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { whatsappHref } from "@/components/site/WhatsAppButton";
import { PlotROICalculator } from "@/components/site/PlotROICalculator";
import { projects, cities } from "@/data/projects";
import { blogPosts } from "@/data/blog";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.jpg";
import testimonial3 from "@/assets/testimonial-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "MK Builders & Developers — True, Trusted, Transparent | Premium Plots & Layouts in Karnataka",
      },
      {
        name: "description",
        content:
          "RERA-approved residential, commercial, agricultural & industrial plots across Bangalore, Mysore, Hubli & Tumkur.",
      },
      { property: "og:title", content: "MK Builders & Developers — Own Your Future, Plot by Plot" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const stats = [
  { value: "10+", label: "Years Experience" },
  { value: "500+", label: "Plots Sold" },
  { value: "10+", label: "Layouts Developed" },
  { value: "RERA", label: "Approved" },
  { value: "4+", label: "Cities" },
];

const plotTypes = [
  {
    icon: Home,
    title: "Residential Plots",
    desc: "Homes & gated communities",
    to: "/plots/residential" as const,
  },
  {
    icon: Store,
    title: "Commercial Plots",
    desc: "Shops, offices & showrooms",
    to: "/plots/commercial" as const,
  },
  {
    icon: Trees,
    title: "Agricultural Plots",
    desc: "Farm land & agri investments",
    to: "/plots/agricultural" as const,
  },
  {
    icon: Factory,
    title: "Industrial Plots",
    desc: "Warehouses & industrial zones",
    to: "/plots/industrial" as const,
  },
];

const usps = [
  {
    icon: Award,
    title: "RERA Approved Projects",
    desc: "All layouts legally approved & registered.",
  },
  {
    icon: ShieldCheck,
    title: "Clear Title Plots",
    desc: "100% legal, zero disputes — verified titles.",
  },
  {
    icon: MapPin,
    title: "Prime Locations",
    desc: "Connected to highways, airports & growth corridors.",
  },
  {
    icon: IndianRupee,
    title: "Transparent Pricing",
    desc: "No hidden charges. What you see is what you pay.",
  },
  {
    icon: Users,
    title: "End-to-End Support",
    desc: "From booking to registration, we handle it all.",
  },
  { icon: Building2, title: "Multi-City Presence", desc: "Trusted layouts across Karnataka." },
];

const testimonials = [
  {
    name: "Ravi Kumar",
    city: "Bangalore",
    project: "MK Green Valley",
    photo: testimonial1,
    text: "The team was transparent at every step. Documents, RERA, registration — all smooth. Highly recommend MK Builders & Developers.",
  },
  {
    name: "Anitha Reddy",
    city: "Mysore",
    project: "MK Royal Heights",
    photo: testimonial2,
    text: "I bought a commercial plot and got the layout map and pricing upfront. No surprises. They truly care about their buyers.",
  },
  {
    name: "Suresh Patil",
    city: "Hubli",
    project: "MK Industrial Park",
    photo: testimonial3,
    text: "Professional, prompt and trustworthy. The site visit was well organized and the plot quality is excellent.",
  },
];

function HomePage() {
  const ongoing = projects.filter((p) => p.status !== "Completed").slice(0, 3);
  const [playVideo, setPlayVideo] = useState(false);

  const galleryPhotos = [
    { image: project1, name: "MK Green Valley - Devanahalli" },
    { image: project2, name: "MK Royal Heights - Mysore" },
    { image: project3, name: "MK Agri Estates - Tumkur" },
    {
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop",
      name: "Premium Gated Communities",
    },
    {
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop",
      name: "Lush Parks & Amenities",
    },
    {
      image:
        "https://images.unsplash.com/photo-1444653389962-8149286c578a?q=80&w=800&auto=format&fit=crop",
      name: "MK Industrial Park - Hubli",
    },
  ];

  return (
    <SiteLayout>
      <section className="relative -mt-20 md:-mt-[120px] min-h-[100svh] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={heroImg}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-residential-suburb-structure-40078-large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 text-center text-primary-foreground pt-28 md:pt-36 pb-16">
          <span className="inline-flex items-center gap-2 text-gold text-xs md:text-sm font-semibold tracking-[0.25em] uppercase animate-fade-up">
            <span className="gold-divider" /> True • Trusted • Transparent{" "}
            <span className="gold-divider" />
          </span>
          <h1 className="mt-6 font-display text-5xl md:text-7xl lg:text-8xl leading-[1.05] text-balance animate-fade-up">
            Own Your Future.
            <br />
            <span className="text-gold italic">Plot by Plot.</span>
          </h1>
          <p className="mt-6 text-base md:text-xl text-primary-foreground/85 max-w-2xl mx-auto leading-relaxed animate-fade-up">
            Premium residential, commercial, agricultural & industrial plots across Karnataka — RERA
            approved, clear titles, prime locations.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3.5 justify-center items-center animate-fade-up w-full max-w-md mx-auto sm:max-w-none px-4 sm:px-0">
            <Link
              to="/projects"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full gold-gradient text-gold-foreground font-semibold shadow-card hover:scale-[1.02] transition text-sm"
            >
              Explore Projects <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#enquiry"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/40 text-white font-semibold backdrop-blur-sm hover:bg-white hover:text-primary transition text-sm"
            >
              Reach Out to Us
            </a>
            <a
              href={whatsappHref(
                "Hi MK Builders & Developers, I would like to get more information about your premium plots.",
              )}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-whatsapp text-white font-semibold hover:opacity-90 transition shadow-md text-sm"
            >
              Get Plot Info
            </a>
          </div>
        </div>
        <ChevronDown className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 w-6 h-6 animate-bounce-soft z-10" />
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 grid grid-cols-2 md:grid-cols-5 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl md:text-5xl text-gold">{s.value}</div>
              <div className="mt-1 text-xs md:text-sm text-primary-foreground/70 tracking-wider uppercase">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Now Selling"
            title="Ongoing Projects"
            description="Handpicked layouts in Karnataka's fastest-growing corridors — book before the next price revision."
          />
          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {ongoing.map((p) => (
              <ProjectCard key={p.slug} p={p} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-foreground font-semibold border-b-2 border-gold pb-1 hover:text-gold transition"
            >
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-5 md:px-8 bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="What We Offer" title="A plot for every ambition" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plotTypes.map((t) => (
              <Link
                key={t.title}
                to={t.to}
                className="group bg-card rounded-xl p-8 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-500"
              >
                <span className="inline-flex w-14 h-14 rounded-xl gold-gradient items-center justify-center text-gold-foreground">
                  <t.icon className="w-7 h-7" />
                </span>
                <h3 className="mt-5 font-display text-2xl text-foreground">{t.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold group-hover:gap-3 transition-all">
                  Explore <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-5 md:px-8 bg-card border-y border-border">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="Virtual Tour"
            title="Walkthrough our layouts"
            description="Take a high-definition drone tour of our ongoing gated communities and plot developments from the comfort of your home."
          />
          <div className="mt-12 relative aspect-video rounded-2xl overflow-hidden shadow-card-hover border border-border group bg-black">
            {playVideo ? (
              <iframe
                src="https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1"
                title="MK Builders & Developers Layout Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div
                className="absolute inset-0 w-full h-full cursor-pointer flex items-center justify-center"
                onClick={() => setPlayVideo(true)}
              >
                <img
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop"
                  alt="MK Builders & Developers layout drone tour thumbnail"
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/30" />
                <span className="relative z-10 w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-gold group-hover:border-gold transition-all duration-300 shadow-lg animate-pulse-soft">
                  <Play className="w-8 h-8 md:w-10 md:h-10 fill-current text-white translate-x-0.5" />
                </span>
                <span className="absolute bottom-4 left-4 z-10 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium tracking-wide">
                  2:30 Min Walkthrough
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Why MK Builders & Developers"
            title="Trust that's earned, not claimed"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {usps.map((u) => (
              <div
                key={u.title}
                className="p-8 rounded-xl border border-border bg-card hover:border-gold/50 transition"
              >
                <u.icon className="w-8 h-8 text-gold" />
                <h3 className="mt-5 font-display text-xl text-foreground">{u.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dedicated Premium CTA Section */}
      <section className="py-16 md:py-20 px-5 md:px-8 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(184,134,11,0.12),rgba(0,0,0,0))]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <span className="text-gold text-xs font-semibold tracking-[0.2em] uppercase">
            Connect With Us
          </span>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight leading-tight">
            Looking for a Premium Plot? Let us help you.
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Reach out to get brochures, exact location layouts, and verified legal document copies
            within minutes.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <a
              href="#enquiry"
              className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 rounded-full gold-gradient text-gold-foreground font-semibold text-sm hover:opacity-95 transition hover:scale-[1.02]"
            >
              Reach Out to Us
            </a>
            <a
              href={whatsappHref(
                "Hi MK Builders & Developers, I would like to get brochures and layout information.",
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full border border-white/20 hover:bg-white hover:text-primary transition font-semibold text-sm"
            >
              Get Plot Information
            </a>
            <a
              href="tel:+919999999999"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition"
            >
              <Phone className="w-4 h-4 text-gold" /> Call Plot Advisor
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-5 md:px-8 bg-secondary/50 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Wealth Generator"
            title="Maximize your land investment"
            description="Unlike depreciating assets, land grows in value. Calculate your returns over time."
          />
          <div className="mt-14">
            <PlotROICalculator />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Gallery Teaser"
            title="Glimpse of MK Developments"
            description="Take a visual tour through our meticulously developed plots and surrounding landscapes."
          />
          <div className="mt-14 grid gap-4 grid-cols-2 md:grid-cols-3">
            {galleryPhotos.map((p, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-xl group aspect-[4/3] ${
                  i === 0 || i === 4 ? "md:col-span-2 md:row-span-1" : ""
                }`}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-5">
                  <span className="text-primary-foreground font-display text-lg font-semibold">
                    {p.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-foreground font-semibold border-b-2 border-gold pb-1 hover:text-gold transition"
            >
              View Full Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-5 md:px-8 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-gold text-xs font-semibold tracking-[0.2em] uppercase">
              <span className="gold-divider" /> Buyer Stories <span className="gold-divider" />
            </div>
            <h2 className="mt-4 font-display text-4xl md:text-5xl text-balance">
              What our buyers say
            </h2>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8"
              >
                <div className="flex gap-1 text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4" fill="currentColor" />
                  ))}
                </div>
                <p className="mt-5 text-primary-foreground/85 leading-relaxed">"{t.text}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <img
                    src={t.photo}
                    alt={t.name}
                    loading="lazy"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-xs text-primary-foreground/60">
                      {t.city} • {t.project}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-5 md:px-8 bg-secondary/30 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Knowledge Hub"
            title="Latest insights & investment guides"
            description="Stay ahead with the latest Karnataka RERA updates, smart plot buying guides, and location growth corridors."
          />
          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-gold/50 shadow-card hover:shadow-card-hover transition duration-500 flex flex-col h-full"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-muted relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm text-gold text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase">
                    {post.category}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-xs text-muted-foreground font-medium flex gap-2 items-center">
                    <span>{post.date}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="mt-3 font-display text-xl text-foreground group-hover:text-gold transition line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-gold">
                    Read Article{" "}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-foreground font-semibold border-b-2 border-gold pb-1 hover:text-gold transition"
            >
              View All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="enquiry" className="py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <SectionHeader
              center={false}
              eyebrow="Get a Callback"
              title="Speak to our plot advisor"
              description="Tell us what you're looking for — we'll match you with the right plot within 24 hours."
            />
            <div className="mt-8 space-y-4 text-sm text-muted-foreground">
              <p className="flex gap-2">
                <ShieldCheck className="w-5 h-5 text-gold shrink-0" /> Your details are confidential
                — we don't spam.
              </p>
              <p className="flex gap-2">
                <Users className="w-5 h-5 text-gold shrink-0" /> Talk to a real advisor, never a
                bot.
              </p>
              <p className="flex gap-2">
                <MapPin className="w-5 h-5 text-gold shrink-0" /> Free site visit arranged on
                request.
              </p>
            </div>
          </div>
          <div className="bg-card p-8 rounded-2xl shadow-card-hover border border-border">
            <EnquiryForm />
          </div>
        </div>
      </section>

      <section className="py-20 px-5 md:px-8 bg-secondary/50">
        <div className="max-w-5xl mx-auto text-center">
          <SectionHeader eyebrow="Our Presence" title="Cities we operate in" />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {cities.map((c) => (
              <Link
                key={c}
                to="/projects"
                className="px-6 py-3 bg-card border border-border rounded-full text-sm font-medium hover:border-gold hover:text-gold transition"
              >
                <MapPin className="inline w-4 h-4 mr-1.5 text-gold" /> {c}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
