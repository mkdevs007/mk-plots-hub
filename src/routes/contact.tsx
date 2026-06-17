import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { whatsappHref } from "@/components/site/WhatsAppButton";
import { Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact MK Builders & Developers — Talk to a Plot Advisor" },
      {
        name: "description",
        content:
          "Talk to our plot advisor today. Call, WhatsApp or fill the form — we'll get back within 24 hours.",
      },
      { property: "og:title", content: "Contact — MK Builders & Developers" },
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
        <span className="text-gold text-xs font-semibold font-nav tracking-[0.25em] uppercase">
          Reach Out
        </span>
        <h1 className="mt-4 font-display text-5xl md:text-7xl">Let's talk plots</h1>
        <p className="mt-4 text-primary-foreground/75 max-w-2xl mx-auto">
          Whether you're investing for the first time or expanding your portfolio — we're here to
          help.
        </p>
      </section>

      <section className="py-16 md:py-20 px-5 md:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.2fr] gap-10">
          <div className="space-y-6">
            <h2 className="font-display text-3xl">Get in touch</h2>
            <div className="space-y-5">
              {[
                {
                  icon: <Phone className="w-5 h-5" />,
                  label: "Call us",
                  value: "+91 70900 70095",
                  href: "tel:+917090070095",
                  external: false,
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  ),
                  label: "SMS Message",
                  value: "+91 70900 70095",
                  href: "sms:+917090070095",
                  external: false,
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  ),
                  label: "WhatsApp",
                  value: "Chat instantly",
                  href: whatsappHref(),
                  external: true,
                },
                {
                  icon: <Mail className="w-5 h-5" />,
                  label: "Email",
                  value: "info@themkdevelopers.com",
                  href: "mailto:info@themkdevelopers.com",
                  external: false,
                },
                {
                  icon: <MapPin className="w-5 h-5" />,
                  label: "Office",
                  value: "3rd Block, 29, 2nd, 1st Main Rd, 3rd Stage, Basaveshwar Nagar, Bengaluru, Karnataka 560079",
                  href: undefined,
                  external: false,
                },
              ].map((c) => (
                <a
                  key={c.label}
                  href={c.href ?? "#"}
                  target={c.external ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex gap-4 p-5 bg-card border border-border rounded-xl hover:border-gold transition"
                >
                  <span className="w-11 h-11 rounded-lg gold-gradient flex items-center justify-center shrink-0 text-gold-foreground">
                    {c.icon}
                  </span>
                  <div>
                    <div className="text-xs text-muted-foreground font-nav uppercase tracking-wider">
                      {c.label}
                    </div>
                    <div className="font-semibold text-foreground mt-0.5">{c.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-card-hover">
            <h2 className="font-display text-3xl">Send us a message</h2>
            <p className="text-sm text-muted-foreground mt-1">We'll respond within 24 hours.</p>
            <div className="mt-6">
              <EnquiryForm />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
