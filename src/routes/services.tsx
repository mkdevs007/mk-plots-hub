import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { SectionHeader } from "@/components/site/SectionHeader";
import {
  MapPin,
  Home,
  Store,
  Trees,
  Factory,
  Route as RoadIcon,
  IndianRupee,
  PhoneCall,
  Car,
  FileCheck,
  Landmark,
  Key,
} from "lucide-react";
import { PlotROICalculator } from "@/components/site/PlotROICalculator";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Our Services — Layout Development & Plot Sales | MK Builders & Developers" },
      {
        name: "description",
        content:
          "Layout development, plot sales, site development and investment advisory. End-to-end real estate services across Karnataka.",
      },
      { property: "og:title", content: "Services — MK Builders & Developers" },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});

const servicesList = [
  {
    icon: MapPin,
    title: "Layout Development",
    desc: "Planning, approvals and delivery of premium plotted developments.",
  },
  {
    icon: Home,
    title: "Residential Plots",
    desc: "Plots for homes and gated housing communities.",
  },
  {
    icon: Store,
    title: "Commercial Plots",
    desc: "High-visibility plots for shops, offices and showrooms.",
  },
  { icon: Trees, title: "Agricultural Plots", desc: "Farm land and weekend-farm investments." },
  { icon: Factory, title: "Industrial Plots", desc: "Warehouses and industrial-zone parcels." },
  {
    icon: RoadIcon,
    title: "Site Development",
    desc: "Roads, drainage, electricity and landscaping done right.",
  },
  {
    icon: IndianRupee,
    title: "Investment Advisory",
    desc: "Guidance on the best plots for ROI and growth.",
  },
];

const steps = [
  {
    num: "01",
    title: "Enquiry & Selection",
    desc: "Call or fill the form. Our advisor helps you choose the right layout and plot based on your budget.",
    icon: PhoneCall,
  },
  {
    num: "02",
    title: "Free Site Visit",
    desc: "We arrange a free site visit with transport. Walk the layout, see the infrastructure, and choose your plot.",
    icon: Car,
  },
  {
    num: "03",
    title: "Legal Review",
    desc: "Our legal team shares DTCP order, RERA certificate, EC, RTC, and title documents for your review.",
    icon: FileCheck,
  },
  {
    num: "04",
    title: "Booking & Loan",
    desc: "Pay a nominal token amount to book your plot. We assist with bank loan application and fast approval.",
    icon: Landmark,
  },
  {
    num: "05",
    title: "Registration",
    desc: "Complete final payment, execute the sale deed at the sub-registrar office, and take physical possession.",
    icon: Key,
  },
];

function Services() {
  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 md:py-28 px-5 md:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(184,134,11,0.15),rgba(0,0,0,0))]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-gold text-xs font-semibold font-nav tracking-[0.25em] uppercase">
            What we do
          </span>
          <h1 className="mt-4 font-display text-5xl md:text-7xl">Built for every plot need</h1>
          <p className="mt-5 max-w-2xl mx-auto text-primary-foreground/75 font-light leading-relaxed">
            From land acquisition to layout approvals and registration. We handle every step with
            absolute transparency.
          </p>
        </div>
      </section>

      {/* Services List Section */}
      <section className="py-20 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Our Services" title="End-to-end plot expertise" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {servicesList.map((s) => (
              <div
                key={s.title}
                className="p-8 rounded-xl bg-card border border-border hover:border-gold/50 hover:-translate-y-1 transition-all duration-500 shadow-card group"
              >
                <span className="inline-flex w-12 h-12 rounded-lg bg-secondary text-gold items-center justify-center group-hover:bg-gold group-hover:text-white transition-all duration-300">
                  <s.icon className="w-6 h-6" />
                </span>
                <h3 className="mt-5 font-display text-xl text-foreground font-semibold">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed font-light">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works (Timeline Process) Section */}
      <section className="py-20 md:py-28 px-5 md:px-8 bg-secondary/30 border-t border-border overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="The Journey"
            title="How It Works"
            description="Our simple, five-step guided path from your initial interest to owning your dream plot."
          />

          <div className="relative mt-20">
            {/* Dashed connector line for desktop */}
            <div className="hidden lg:block absolute top-[44px] left-[8%] right-[8%] h-0.5 border-t border-dashed border-gold/40 z-0" />

            <div className="grid gap-10 md:gap-12 lg:grid-cols-5 relative z-10">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group">
                  {/* Step Badge / Icon Wrapper */}
                  <div className="relative mb-6">
                    {/* Pulsing glow under active steps */}
                    <div className="absolute inset-0 rounded-full bg-gold/10 scale-120 group-hover:scale-150 transition-transform duration-300 opacity-80" />

                    <div className="relative z-10 w-20 h-20 rounded-full bg-card border-2 border-gold flex items-center justify-center shadow-card group-hover:bg-gold group-hover:text-white transition-all duration-300">
                      <step.icon className="w-8 h-8 text-gold group-hover:text-white transition-colors duration-300" />

                      {/* Step Number Badge */}
                      <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center border border-gold shadow-sm">
                        {step.num}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display text-xl text-foreground font-semibold mb-2 group-hover:text-gold transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-light px-2">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-20 md:py-28 px-5 md:px-8 bg-secondary/50 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <PlotROICalculator />
        </div>
      </section>
    </SiteLayout>
  );
}
