import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { whatsappHref } from "@/components/site/WhatsAppButton";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact MK Developers — Talk to a Plot Advisor" },
      { name: "description", content: "Talk to our plot advisor today. Call, WhatsApp or fill the form — we'll get back within 24 hours." },
      { property: "og:title", content: "Contact — MK Developers" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground py-20 md:py-28 px-5 md:px-8 text-center">
        <span className="text-gold text-xs font-semibold tracking-[0.25em] uppercase">Reach Out</span>
        <h1 className="mt-4 font-display text-5xl md:text-7xl">Let's talk plots</h1>
        <p className="mt-4 text-primary-foreground/75 max-w-2xl mx-auto">Whether you're investing for the first time or expanding your portfolio — we're here to help.</p>
      </section>

      <section className="py-16 md:py-20 px-5 md:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.2fr] gap-10">
          <div className="space-y-6">
            <h2 className="font-display text-3xl">Get in touch</h2>
            <div className="space-y-5">
              {[
                { icon: Phone, label: "Call us", value: "+91 99999 99999", href: "tel:+919999999999" },
                { icon: MessageCircle, label: "WhatsApp", value: "Chat instantly", href: whatsappHref() },
                { icon: Mail, label: "Email", value: "info@mkdevelopers.in", href: "mailto:info@mkdevelopers.in" },
                { icon: MapPin, label: "Office", value: "4th Floor, MG Road, Bangalore 560001" },
              ].map((c) => (
                <a key={c.label} href={c.href ?? "#"} target={c.label === "WhatsApp" ? "_blank" : undefined} rel="noreferrer" className="flex gap-4 p-5 bg-card border border-border rounded-xl hover:border-gold transition">
                  <span className="w-11 h-11 rounded-lg gold-gradient flex items-center justify-center shrink-0 text-gold-foreground">
                    <c.icon className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">{c.label}</div>
                    <div className="font-semibold text-foreground mt-0.5">{c.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-card-hover">
            <h2 className="font-display text-3xl">Send us a message</h2>
            <p className="text-sm text-muted-foreground mt-1">We'll respond within 24 hours.</p>
            <div className="mt-6"><EnquiryForm /></div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
