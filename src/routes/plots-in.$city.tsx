import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ProjectCard } from "@/components/site/ProjectCard";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { getProjects } from "@/lib/projects";
import { useQuery } from "@tanstack/react-query";
import { MapPin, TrendingUp, ShieldCheck, Landmark, Star, ArrowRight } from "lucide-react";

// Custom details for each operating city
const cityData: Record<
  string,
  {
    name: string;
    tagline: string;
    desc: string;
    advantages: { title: string; desc: string }[];
    testimonials: { name: string; project: string; text: string }[];
  }
> = {
  bangalore: {
    name: "Bangalore",
    tagline: "Own premium layout plots in India's Silicon Valley",
    desc: "Bangalore's rapid outer growth, tech corridors, and infrastructure developments make residential and commercial plots the most high-yielding investment class in Karnataka.",
    advantages: [
      {
        title: "Aerotropolis Growth Corridor",
        desc: "Plotted projects in North Bangalore (Devanahalli) sit at the center of multi-billion dollar tech parks and infrastructure upgrades near the airport.",
      },
      {
        title: "Metro & Peripheral Ring Road",
        desc: "Enhanced connectivity with proposed Metro Line expansion and PRR ensures immediate capital appreciation for outer-belt land owners.",
      },
      {
        title: "Gated Community Perks",
        desc: "Our plots feature high-grade blacktop roads, municipal water connectivity, under-ground sewage lines, and 24/7 security.",
      },
    ],
    testimonials: [
      {
        name: "Ravi Kumar",
        project: "MK Green Valley",
        text: "Purchasing a plot in Devanahalli with MK Builders & Developers was the smoothest transaction of my life. Documentation and RERA approval details were completely upfront.",
      },
    ],
  },
  mysore: {
    name: "Mysore",
    tagline: "Secure commercial and residential plots in Karnataka's cultural hub",
    desc: "Mysore is witnessing immense growth as an IT/ITES destination. Affordable entry rates combined with the expansion of the Mysore-Bangalore Expressway make it perfect for investments.",
    advantages: [
      {
        title: "Bangalore-Mysore Highway Expressway",
        desc: "Reduces travel time to under 90 minutes, making Mysore plots ideal for investors seeking weekend getaways or suburban living.",
      },
      {
        title: "Industrial Development Zones",
        desc: "Proximity to Hunsur Road and Nanjangud industrial belts drives high demand for retail, warehouse, and residential plots.",
      },
      {
        title: "Heritage City Peace of Mind",
        desc: "Enjoy wide tree-lined layouts, parks, clean air, and dispute-free clear title ownership.",
      },
    ],
    testimonials: [
      {
        name: "Anitha Reddy",
        project: "MK Royal Heights",
        text: "Bought a commercial plot for setting up a showroom. The distance to key growth corridors is excellent, and value appreciated in 6 months.",
      },
    ],
  },
  hubli: {
    name: "Hubli",
    tagline: "Invest in high-yield industrial & commercial plots in North Karnataka",
    desc: "As the secondary logistics and industrial powerhouse of Karnataka, Hubli-Dharwad offers phenomenal opportunities in commercial development and industrial parks.",
    advantages: [
      {
        title: "Logistics & Cargo Corridor",
        desc: "Ideally located close to National Highway 48 and railway cargo lines, making industrial plots highly optimized for logistics.",
      },
      {
        title: "Smart City Upgrades",
        desc: "Major infrastructure grants have modernised city drainage, smart streetlights, and broad connectivity roads.",
      },
      {
        title: "High Demand Commercial Plots",
        desc: "Perfect for warehouse building, retail showrooms, or small/medium industry setups.",
      },
    ],
    testimonials: [
      {
        name: "Suresh Patil",
        project: "MK Industrial Park",
        text: "The layout has heavy-load power lines and wide roads for trucks. Perfect project delivery from MK Builders & Developers.",
      },
    ],
  },
  tumkur: {
    name: "Tumkur",
    tagline: "Affordable land investment in Karnataka's emerging industrial node",
    desc: "Tumkur is quickly developing as an extension of Greater Bangalore. Proximity to NH-75 and NH-48 has turned locations like Kunigal and Tumkur city into plotting goldmines.",
    advantages: [
      {
        title: "Part of Chennai-Bangalore Industrial Corridor",
        desc: "Massive central funding ensures high-quality industrial infrastructure and institutional jobs nearby.",
      },
      {
        title: "Unbeatable Price Points",
        desc: "Get premium agricultural or residential layouts at a fraction of Bangalore costs, with promising 15% yearly appreciation.",
      },
      {
        title: "Rapid Urban Expansion",
        desc: "Surrounding colleges, hospitals, and commuter rail links are shifting Bangalore professionals to buy farm plots here.",
      },
    ],
    testimonials: [
      {
        name: "Manjunath Gowda",
        project: "MK Agri Estates",
        text: "The soil quality at MK Agri Estates is excellent for farmhouses. Legal checks were smooth, and borehole water connection works perfectly.",
      },
    ],
  },
};

export const Route = createFileRoute("/plots-in/$city")({
  loader: async ({ params }) => {
    const cityKey = params.city.toLowerCase();
    const data = cityData[cityKey];
    if (!data) throw notFound();
    const list = await getProjects();
    return { data, cityKey, initialProjects: list };
  },
  head: ({ loaderData }) => {
    const data = loaderData?.data;
    return {
      meta: [
        {
          title: `Plots for Sale in ${data?.name ?? "Karnataka"} | Gated Layouts | MK Builders & Developers`,
        },
        {
          name: "description",
          content: `Explore RERA-approved plots and land layouts for sale in ${data?.name}. Starting price options, clear titles, premium amenities.`,
        },
        {
          property: "og:title",
          content: `Premium Plots in ${data?.name} — MK Builders & Developers`,
        },
        { property: "og:url", content: `/plots-in/${loaderData?.cityKey}` },
      ],
      links: [{ rel: "canonical", href: `/plots-in/${loaderData?.cityKey}` }],
    };
  },
  component: CityHubPage,
});

function CityHubPage() {
  const { data, cityKey, initialProjects } = Route.useLoaderData();
  const { data: projects = initialProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    initialData: initialProjects,
  });

  const cityProjects = projects.filter((p) => p.city.toLowerCase() === cityKey);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20 md:py-28 px-5 md:px-8 text-center relative overflow-hidden">
        <div className="max-w-5xl mx-auto z-10 relative">
          <span className="text-gold text-xs font-semibold tracking-[0.25em] uppercase flex items-center justify-center gap-1.5">
            <MapPin className="w-4.5 h-4.5" /> Regional Hub — {data.name}
          </span>
          <h1 className="mt-4 font-display text-5xl md:text-7xl text-balance">{data.tagline}</h1>
          <p className="mt-6 text-primary-foreground/75 max-w-2xl mx-auto leading-relaxed">
            {data.desc}
          </p>
        </div>
      </section>

      {/* Projects list */}
      <section className="py-20 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow={`Layouts in ${data.name}`}
            title="Explore Available Projects"
            description={`Fully developed residential, commercial, agricultural, and industrial land parcels inside ${data.name}.`}
          />
          {cityProjects.length ? (
            <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {cityProjects.map((p) => (
                <ProjectCard key={p.slug} p={p} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground mt-12 py-12 bg-secondary/50 rounded-xl">
              New projects launching soon in {data.name}. Leave your contact details below to get
              first priority invitations.
            </p>
          )}
        </div>
      </section>

      {/* Location advantages */}
      <section className="py-20 px-5 md:px-8 bg-secondary/50 border-t border-b border-border">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Why Invest Here"
            title={`Infrastructure & Growth in ${data.name}`}
          />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {data.advantages.map((adv, idx) => (
              <div
                key={idx}
                className="p-8 rounded-xl bg-card border border-border flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center text-gold-foreground mb-6">
                    {idx === 0 ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : idx === 1 ? (
                      <Landmark className="w-5 h-5" />
                    ) : (
                      <ShieldCheck className="w-5 h-5" />
                    )}
                  </div>
                  <h3 className="font-display text-2xl text-foreground font-semibold">
                    {adv.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{adv.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials specific to the city */}
      <section className="py-20 px-5 md:px-8 bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-gold text-xs font-semibold tracking-widest uppercase">
              Investor Success
            </span>
            <h2 className="font-display text-4xl mt-2">What buyers in {data.name} say</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-1 max-w-3xl mx-auto">
            {data.testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-xl p-8 text-center"
              >
                <div className="flex justify-center gap-1 text-gold mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4" fill="currentColor" />
                  ))}
                </div>
                <p className="text-lg md:text-xl text-primary-foreground/90 italic">"{t.text}"</p>
                <div className="mt-6">
                  <div className="font-semibold text-gold">{t.name}</div>
                  <div className="text-xs text-primary-foreground/60">
                    {data.name} • {t.project}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick enquiry callback */}
      <section className="py-20 px-5 md:px-8">
        <div className="max-w-3xl mx-auto bg-card border border-border p-8 md:p-10 rounded-2xl shadow-card-hover">
          <h3 className="font-display text-3xl text-center">
            Request Pricing & Brochure for {data.name}
          </h3>
          <p className="text-sm text-muted-foreground text-center mt-2 mb-6">
            Get plot maps, availability charts, and details about bank loan approvals.
          </p>
          <EnquiryForm />
        </div>
      </section>
    </SiteLayout>
  );
}
