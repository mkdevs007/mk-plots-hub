import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { whatsappHref } from "@/components/site/WhatsAppButton";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Thank You — MK Developers" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYou,
});

function ThankYou() {
  return (
    <SiteLayout>
      <section className="py-28 md:py-40 px-5 md:px-8 text-center min-h-[70vh] flex items-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-flex w-20 h-20 rounded-full gold-gradient items-center justify-center text-gold-foreground">
            <CheckCircle2 className="w-10 h-10" />
          </span>
          <h1 className="mt-8 font-display text-5xl md:text-6xl">Thank you!</h1>
          <p className="mt-4 text-muted-foreground text-lg">Our advisor will reach out within 24 hours. For an instant reply, message us on WhatsApp.</p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <a href={whatsappHref()} target="_blank" rel="noreferrer" className="px-7 py-3.5 rounded-md bg-whatsapp text-white font-semibold">Chat on WhatsApp</a>
            <Link to="/projects" className="px-7 py-3.5 rounded-md gold-gradient text-gold-foreground font-semibold">Explore Projects</Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
